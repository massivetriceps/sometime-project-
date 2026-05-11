const prisma = require('../../config/db');
const axios  = require('axios');

// ────────────────────────────────────────
// CSP 엔진 호출 (FastAPI)
// FastAPI 미완성 → Mock으로 자동 fallback
// TODO: FastAPI 완성 시 실제 호출로 교체
// ────────────────────────────────────────
// ── 시간표 충돌 검사 ──────────────────────────────────
const hasConflict = (newSchedules, existingSchedules) => {
  for (const ns of newSchedules) {
    for (const es of existingSchedules) {
      if (
        es.day_of_week === ns.day_of_week &&
        es.start_period <= ns.end_period &&
        ns.start_period <= es.end_period
      ) return true;
    }
  }
  return false;
};

// ── 과목명 정규화 (수업방식 표기 제거) ───────────────────
const normalizeCourseName = (name) =>
  name.trim()
    .replace(/\s*\(실시간화상강의\)/g, '')
    .replace(/\s*\(실시간강의\)/g, '')
    .replace(/\s*\(온라인\)/g, '')
    .trim();

// ── 배열 셔플 (plan 다양성) ───────────────────────────
const shuffle = (arr, seed = 0) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (seed * 1234567 + i * 7654321) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Mock 플랜 빌더 ────────────────────────────────────
const buildMockPlan = (seed, courses, cartIds, constraints) => {
  const {
    cartCourseIds,
    targetCredits = 18,
    free_day_mask = 0,
    allow_first   = false,
    prefer_online = false,
  } = constraints;

  const DAY_BIT = { '월': 1, '화': 2, '수': 4, '목': 8, '금': 16 };

  // 장바구니 과목 정보 (같은 과목명 분반 중복 제거)
  const cartMap = Object.fromEntries(courses.map(c => [c.course_id, c]));
  const cartDetails = cartCourseIds
    .map(id => cartMap[id]).filter(Boolean)
    .filter((c, idx, arr) => arr.findIndex(x => normalizeCourseName(x.course_name) === normalizeCourseName(c.course_name)) === idx);
  const cartCredits = cartDetails.reduce((s, c) => s + c.credits, 0);
  const cartSchedules = cartDetails.flatMap(c => c.schedules);

  // 추가 가능 과목 필터링
  const pool = shuffle(
    courses.filter(c => {
      if (cartCourseIds.includes(c.course_id)) return false;
      // 오전 1교시 제한
      if (!allow_first && c.schedules.some(s => s.start_period === 1)) return false;
      // 공강 요일 제한
      if (free_day_mask) {
        const usesBlockedDay = c.schedules.some(s => (DAY_BIT[s.day_of_week] ?? 0) & free_day_mask);
        if (usesBlockedDay) return false;
      }
      return true;
    }),
    seed
  );

  // 온라인 선호 시 온라인 강의 앞으로 정렬
  const sorted = prefer_online
    ? [...pool.filter(c => c.schedules.every(s => !s.building_id)), ...pool.filter(c => c.schedules.some(s => s.building_id))]
    : pool;

  // 목표 학점까지 충돌 없이 채우기
  const selected = cartDetails.map(c => c.course_id);
  let credits = cartCredits;
  const usedSchedules = [...cartSchedules];
  const usedCourseNames = new Set(cartDetails.map(c => normalizeCourseName(c.course_name)));

  for (const c of sorted) {
    if (credits >= targetCredits) break;
    if (usedCourseNames.has(normalizeCourseName(c.course_name))) continue;
    if (hasConflict(c.schedules, usedSchedules)) continue;
    selected.push(c.course_id);
    credits += c.credits;
    usedSchedules.push(...c.schedules);
    usedCourseNames.add(normalizeCourseName(c.course_name));
  }

  return selected;
};

const callCSPEngine = async (payload) => {
  const CSP_URL = process.env.CSP_URL || 'http://localhost:8000/csp/generate';

  try {
    const res = await axios.post(CSP_URL, payload, { timeout: 10000 });
    return res.data.plans;
  } catch (e) {
    // TODO: FastAPI 완성 후 아래 Mock 제거
    console.warn('[CSP] FastAPI 미연결 → Mock 사용');
    const { courses, constraints } = payload;
    return [
      { plan_type: 'A', course_ids: buildMockPlan(1, courses, constraints.cartCourseIds, constraints), total_walk_minutes: 0, score: 100 },
      { plan_type: 'B', course_ids: buildMockPlan(2, courses, constraints.cartCourseIds, constraints), total_walk_minutes: 0, score: 90  },
      { plan_type: 'C', course_ids: buildMockPlan(3, courses, constraints.cartCourseIds, constraints), total_walk_minutes: 0, score: 80  },
    ];
  }
};

// ────────────────────────────────────────
// AI 코멘트 생성 (OpenAI)
// OPENAI_API_KEY 없으면 null 저장 후 진행
// ────────────────────────────────────────
const generateAIComment = async (plan) => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OPENAI_API_KEY 없음 → 코멘트 null 처리');
    return null;
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            '너는 가천대학교 시간표 추천 도우미야. ' +
            '건물 간 이동시간, 공강 확보, 전공필수 충족 여부를 ' +
            '분석해서 한 문장으로 자연어 설명해줘. 한국어로만 답해.',
        },
        { role: 'user', content: JSON.stringify(plan) },
      ],
      max_tokens: 150,
    });

    return chat.choices[0].message.content.trim();
  } catch (e) {
    console.error('[AI] 코멘트 생성 실패:', e.message);
    return null;
  }
};

// ────────────────────────────────────────
// 1. 시간표 생성
// ────────────────────────────────────────
const createTimetable = async (userId, body) => {
  const {
    dept, grade, dormitory,
    free_day_mask, avoid_uphill,
    allow_first, prefer_online,
    target_credits, semester,
  } = body;

  // 1) 장바구니 조회
  const carts = await prisma.carts.findMany({ where: { user_id: userId } });
  const cartCourseIds = [...new Set(carts.map((c) => c.course_id))];

  // 2) 강의 + 스케줄 + 건물 조회
  const courses = await prisma.courses.findMany({
    include: { course_schedules: { include: { buildings: true } } },
  });

  // 3) 거리행렬 조회
  const distances = await prisma.distances.findMany();

  // 4) CSP 호출 (Mock 포함)
  const plans = await callCSPEngine({
    userId,
    constraints: {
      dept, grade, dormitory,
      free_day_mask,
      avoid_uphill,
      allow_first,
      prefer_online,
      cartCourseIds,
      targetCredits: target_credits ?? 18,
    },
    courses: courses.map((c) => ({
      course_id:      c.course_id,
      course_code:    c.course_code,
      course_name:    c.course_name,
      classification: c.classification,
      credits:        c.credits,
      schedules:      c.course_schedules.map((s) => ({
        day_of_week:   s.day_of_week,
        start_period:  s.start_period,
        end_period:    s.end_period,
        building_id:   s.building_id,
        building_name: s.buildings?.building_name ?? '온라인',
      })),
    })),
    distances: distances.map((d) => ({
      from_building_id: d.from_building_id,
      to_building_id:   d.to_building_id,
      time_minutes:     d.time_minutes,
      is_uphill:        d.is_uphill,
    })),
  });

  // 4-5) 기존 시간표 전부 삭제 후 새로 생성 (중복 방지)
  const oldTimetables = await prisma.timetables.findMany({ where: { user_id: userId }, select: { timetable_id: true } });
  if (oldTimetables.length > 0) {
    const oldIds = oldTimetables.map(t => t.timetable_id);
    await prisma.timetableCourses.deleteMany({ where: { timetable_id: { in: oldIds } } });
    await prisma.timetables.deleteMany({ where: { timetable_id: { in: oldIds } } });
  }

  // 5) Plan별 AI 코멘트 생성 + DB 저장
  const created = [];

  for (const plan of plans) {
    const ai_comment = await generateAIComment(plan);

    const timetable = await prisma.timetables.create({
      data: {
        user_id:            userId,
        plan_type:          plan.plan_type,
        grade:              grade ?? null,
        semester:           semester ?? null,
        optimization_score: plan.score ?? 0,
        ai_comment,
        is_selected:        false,
      },
    });

    // TIMETABLE_COURSES 매핑 (prisma camelCase 모델명 사용)
    await prisma.timetableCourses.createMany({
      data: plan.course_ids.map((course_id) => ({
        timetable_id: timetable.timetable_id,
        course_id,
      })),
    });

    created.push({
      timetable_id: timetable.timetable_id,
      plan_type:    plan.plan_type,
      score:        plan.score,
    });
  }

  return { timetables: created };
};

// ────────────────────────────────────────
// 2. 시간표 목록 조회
// ────────────────────────────────────────
const getTimetables = async (userId) => {
  const timetables = await prisma.timetables.findMany({
    where:   { user_id: userId },
    orderBy: { plan_type: 'asc' },
    include: {
      timetable_courses: {
        include: {
          courses: {
            include: {
              course_schedules: { include: { buildings: true } },
            },
          },
        },
      },
    },
  });

  return timetables.map((t) => ({
    timetable_id:       t.timetable_id,
    plan_type:          t.plan_type,
    grade:              t.grade,
    semester:           t.semester,
    is_selected:        t.is_selected,
    optimization_score: t.optimization_score,
    created_at:         t.created_at,
    courses: t.timetable_courses
      .filter((tc, idx, arr) => arr.findIndex((x) => x.course_id === tc.course_id) === idx)
      .map((tc) => {
      const c = tc.courses;
      return {
        course_id:      c.course_id,
        course_name:    c.course_name,
        classification: c.classification,
        credits:        c.credits,
        professor:      c.professor,
        schedules:   c.course_schedules.map((s) => ({
          day_of_week:  s.day_of_week,
          start_period: s.start_period,
          end_period:   s.end_period,
          room_name:    s.room_name,
          building:     s.buildings?.building_name ?? '온라인',
        })),
      };
    }),
  }));
};

// ────────────────────────────────────────
// 3. AI 코멘트 조회
// ────────────────────────────────────────
const getComment = async (userId, timetableId) => {
  const timetable = await prisma.timetables.findUnique({
    where: { timetable_id: timetableId },
  });

  if (!timetable) {
    const err = new Error('시간표를 찾을 수 없습니다.'); err.statusCode = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.statusCode = 403; throw err;
  }

  return {
    timetable_id: timetable.timetable_id,
    plan_type:    timetable.plan_type,
    ai_comment:   timetable.ai_comment,
  };
};

// ────────────────────────────────────────
// 4. 시간표 수정 (부분 수정: add/remove)
// ────────────────────────────────────────
const updateTimetable = async (userId, timetableId, { add = [], remove = [] }) => {
  const timetable = await prisma.timetables.findUnique({
    where: { timetable_id: timetableId },
    include: {
      timetable_courses: {
        include: { courses: { include: { course_schedules: true } } },
      },
    },
  });

  if (!timetable) {
    const err = new Error('시간표를 찾을 수 없습니다.'); err.statusCode = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.statusCode = 403; throw err;
  }

  // 추가할 강의 시간 충돌 검사
  if (add.length > 0) {
    const currentSchedules = timetable.timetable_courses.flatMap(
      (tc) => tc.courses.course_schedules
    );
    const addCourses = await prisma.courses.findMany({
      where:   { course_id: { in: add } },
      include: { course_schedules: true },
    });

    for (const course of addCourses) {
      for (const ns of course.course_schedules) {
        const conflict = currentSchedules.some(
          (cs) =>
            cs.day_of_week === ns.day_of_week &&
            cs.start_period <= ns.end_period &&
            ns.start_period <= cs.end_period
        );
        if (conflict) {
          const err = new Error(
            `${course.course_name} 강의가 기존 시간표와 충돌합니다.`
          );
          err.statusCode = 400;
          throw err;
        }
      }
    }
  }

  await prisma.$transaction([
    // remove
    ...(remove.length > 0
      ? [
          prisma.timetableCourses.deleteMany({
            where: {
              timetable_id: timetableId,
              course_id:    { in: remove },
            },
          }),
        ]
      : []),
    // add
    ...(add.length > 0
      ? [
          prisma.timetableCourses.createMany({
            data:           add.map((course_id) => ({ timetable_id: timetableId, course_id })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  return { timetable_id: timetableId, message: '시간표가 수정되었습니다.' };
};

// ────────────────────────────────────────
// 5. 시간표 삭제
// ────────────────────────────────────────
const deleteTimetable = async (userId, timetableId) => {
  const timetable = await prisma.timetables.findUnique({
    where: { timetable_id: timetableId },
  });

  if (!timetable) {
    const err = new Error('시간표를 찾을 수 없습니다.'); err.statusCode = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.statusCode = 403; throw err;
  }

  await prisma.$transaction([
    prisma.timetableCourses.deleteMany({ where: { timetable_id: timetableId } }),
    prisma.timetables.delete({ where: { timetable_id: timetableId } }),
  ]);

  return { message: '시간표가 삭제되었습니다.' };
};

// ────────────────────────────────────────
// 6. 시간표 확정 → 수강내역 자동 추가
// ────────────────────────────────────────
const confirmTimetable = async (userId, timetableId) => {
  const timetable = await prisma.timetables.findUnique({
    where: { timetable_id: timetableId },
    include: { timetable_courses: { include: { courses: true } } },
  });

  if (!timetable) {
    const err = new Error('시간표를 찾을 수 없습니다.'); err.statusCode = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.statusCode = 403; throw err;
  }

  const { grade, semester } = timetable;

  // course_id 기준 중복 제거 (같은 과목이 여러 schedule로 중복 등록된 경우 방지)
  const uniqueCourses = Object.values(
    Object.fromEntries(
      timetable.timetable_courses
        .filter(tc => tc.courses)
        .map(tc => [tc.courses.course_id, tc.courses])
    )
  );

  // 이번 학기(grade+semester) 수강내역 전체 교체
  const newRecords = uniqueCourses.map(c => ({
    user_id:        userId,
    course_code:    c.course_code,
    course_name:    c.course_name,
    classification: c.classification,
    credits:        c.credits,
    grade:          grade ?? null,
    semester:       semester ?? null,
  }));

  await prisma.$transaction([
    // 이 학기 기존 수강내역 삭제 후 교체 (다른 학기는 건드리지 않음)
    prisma.takenCourses.deleteMany({
      where: { user_id: userId, grade: grade ?? null, semester: semester ?? null },
    }),
    prisma.takenCourses.createMany({ data: newRecords }),
    // ABC 중 이 시간표만 is_selected = true, 나머지 false
    prisma.timetables.updateMany({
      where: { user_id: userId, timetable_id: { not: timetableId } },
      data:  { is_selected: false },
    }),
    prisma.timetables.update({
      where: { timetable_id: timetableId },
      data:  { is_selected: true },
    }),
  ]);

  return {
    message: '시간표가 확정되었습니다.',
    added_count: newRecords.length,
  };
};

module.exports = {
  createTimetable,
  getTimetables,
  getComment,
  updateTimetable,
  deleteTimetable,
  confirmTimetable,
};
