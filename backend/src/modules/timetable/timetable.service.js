const prisma = require('../../config/db');
const axios  = require('axios');

// ────────────────────────────────────────
// CSP 엔진 호출 (FastAPI)
// FastAPI 미완성 → Mock으로 자동 fallback
// TODO: FastAPI 완성 시 실제 호출로 교체
// ────────────────────────────────────────
const callCSPEngine = async (payload) => {
  const CSP_URL = process.env.CSP_URL || 'http://localhost:8000/csp/generate';

  try {
    const res = await axios.post(CSP_URL, payload, { timeout: 10000 });
    return res.data.plans;
  } catch (e) {
    // TODO: FastAPI 완성 후 아래 Mock 제거
    console.warn('[CSP] FastAPI 미연결 → Mock 사용');
    const cartIds = payload.constraints.cartCourseIds;
    return [
      { plan_type: 'A', course_ids: cartIds, total_walk_minutes: 0, score: 100 },
      { plan_type: 'B', course_ids: cartIds, total_walk_minutes: 0, score: 90  },
      { plan_type: 'C', course_ids: cartIds, total_walk_minutes: 0, score: 80  },
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
  } = body;

  // 1) 장바구니 조회
  const carts = await prisma.carts.findMany({ where: { user_id: userId } });
  const cartCourseIds = carts.map((c) => c.course_id);

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

  // 5) Plan별 AI 코멘트 생성 + DB 저장
  const created = [];

  for (const plan of plans) {
    const ai_comment = await generateAIComment(plan);

    const timetable = await prisma.timetables.create({
      data: {
        user_id:            userId,
        plan_type:          plan.plan_type,
        optimization_score: plan.score,
        total_walk_minutes: plan.total_walk_minutes,
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
    is_selected:        t.is_selected,
    optimization_score: t.optimization_score,
    total_walk_minutes: t.total_walk_minutes,
    created_at:         t.created_at,
    courses: t.timetable_courses.map((tc) => {
      const c = tc.courses;
      return {
        course_id:   c.course_id,
        course_name: c.course_name,
        credits:     c.credits,
        professor:   c.professor,
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
    const err = new Error('시간표를 찾을 수 없습니다.'); err.status = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.status = 403; throw err;
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
    const err = new Error('시간표를 찾을 수 없습니다.'); err.status = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.status = 403; throw err;
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
          err.status = 400;
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
    const err = new Error('시간표를 찾을 수 없습니다.'); err.status = 404; throw err;
  }
  if (timetable.user_id !== userId) {
    const err = new Error('접근 권한이 없습니다.'); err.status = 403; throw err;
  }

  await prisma.$transaction([
    prisma.timetableCourses.deleteMany({ where: { timetable_id: timetableId } }),
    prisma.timetables.delete({ where: { timetable_id: timetableId } }),
  ]);

  return { message: '시간표가 삭제되었습니다.' };
};

module.exports = {
  createTimetable,
  getTimetables,
  getComment,
  updateTimetable,
  deleteTimetable,
};
