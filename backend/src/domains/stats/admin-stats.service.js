const prisma = require('../../config/db.config');

const getUsageStats = async () => {
  // ── 날짜 범위 설정 ──────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // ── 전일 대비 증감 계산 헬퍼 ─────────────────
  const trendPct = (curr, prev) => {
    if (prev === 0 && curr === 0) return null;
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 1000) / 10; // 소수점 1자리
  };

  // ── 병렬 쿼리 ────────────────────────────────
  const [
    total_timetables,
    api_call_counts,
    active_users_group,
    today_timetables,
    yesterday_timetables,
    yesterday_api_calls,
    yesterday_dau_group,
    today_new_users,
    yesterday_new_users,
  ] = await Promise.all([
    prisma.timetables.count(),
    prisma.aCCESS_LOGS.count({ where: { created_at: { gte: today, lt: tomorrow } } }),
    prisma.aCCESS_LOGS.groupBy({
      by: ['user_id'],
      where: { created_at: { gte: today, lt: tomorrow }, user_id: { not: null } },
    }),
    prisma.timetables.count({ where: { created_at: { gte: today, lt: tomorrow } } }),
    prisma.timetables.count({ where: { created_at: { gte: yesterday, lt: today } } }),
    prisma.aCCESS_LOGS.count({ where: { created_at: { gte: yesterday, lt: today } } }),
    prisma.aCCESS_LOGS.groupBy({
      by: ['user_id'],
      where: { created_at: { gte: yesterday, lt: today }, user_id: { not: null } },
    }),
    prisma.users.count({ where: { created_at: { gte: today, lt: tomorrow } } }),
    prisma.users.count({ where: { created_at: { gte: yesterday, lt: today } } }),
  ]);

  const daily_active_users = active_users_group.length;
  const yesterday_dau = yesterday_dau_group.length;

  return {
    daily_active_users,
    daily_active_users_trend: trendPct(daily_active_users, yesterday_dau),
    total_timetables,
    today_timetables,
    today_timetables_trend: trendPct(today_timetables, yesterday_timetables),
    api_call_counts,
    api_call_counts_trend: trendPct(api_call_counts, yesterday_api_calls),
    today_new_users,
    today_new_users_trend: trendPct(today_new_users, yesterday_new_users),
  };
};

const getPreferenceStats = async () => {
  // 1. 전체 설정 건수 (모수)
  const total = await prisma.preferences.count();

  // 데이터가 아예 없는 경우 에러 방지용 기본값 반환
  if (total === 0) {
    return {
      total_preferences_count: 0,
      ratios: { avoid_uphill_ratio: 0, prefer_online_ratio: 0, minimize_gaps_ratio: 0, prioritize_required_ratio: 0 },
      top_choices: { top_preferred_time: null, top_free_day: null, top_credit_intensity: null },
      averages: { avg_max_classes_per_day: 0 }
    };
  }

  // 2. Boolean(참/거짓) 값들 카운트 (Promise.all로 병렬 처리하여 속도 최적화)
  const [avoidUphill, preferOnline, minimizeGaps, prioritizeReq] = await Promise.all([
    prisma.preferences.count({ where: { avoid_uphill: true } }),
    prisma.preferences.count({ where: { prefer_online: true } }),
    prisma.preferences.count({ where: { minimize_gaps: true } }),
    prisma.preferences.count({ where: { prioritize_required: true } })
  ]);

  // 3. 가장 인기 있는 옵션 1위 추출 (Group By 사용)
  const [timeGroup, dayGroup, creditGroup] = await Promise.all([
    prisma.preferences.groupBy({
      by: ['preferred_time'],
      _count: { preferred_time: true },
      orderBy: { _count: { preferred_time: 'desc' } },
      take: 1, // 가장 많은 1개만 가져오기
    }),
    prisma.preferences.groupBy({
      by: ['free_days'],
      _count: { free_days: true },
      where: { free_days: { not: null } },
      orderBy: { _count: { free_days: 'desc' } },
      take: 1,
    }),
    prisma.preferences.groupBy({
      by: ['credit_intensity'],
      _count: { credit_intensity: true },
      orderBy: { _count: { credit_intensity: 'desc' } },
      take: 1,
    })
  ]);

  // 4. 하루 최대 수업 개수 평균 계산 (NULL 제외)
  const maxClassesAgg = await prisma.preferences.aggregate({
    _avg: { max_classes_per_day: true },
  });

  // 5. 최종 데이터 조립 (비율은 소수점 1자리까지 표기)
  return {
    total_preferences_count: total,
    ratios: {
      avoid_uphill_ratio: Number(((avoidUphill / total) * 100).toFixed(1)),
      prefer_online_ratio: Number(((preferOnline / total) * 100).toFixed(1)),
      minimize_gaps_ratio: Number(((minimizeGaps / total) * 100).toFixed(1)),
      prioritize_required_ratio: Number(((prioritizeReq / total) * 100).toFixed(1)),
    },
    top_choices: {
      top_preferred_time: timeGroup.length > 0 ? timeGroup[0].preferred_time : null,
      top_free_day: dayGroup.length > 0 ? dayGroup[0].free_days : null,
      top_credit_intensity: creditGroup.length > 0 ? creditGroup[0].credit_intensity : null,
    },
    averages: {
      avg_max_classes_per_day: maxClassesAgg._avg.max_classes_per_day 
        ? Number(maxClassesAgg._avg.max_classes_per_day.toFixed(1)) 
        : null
    }
  };
};

const getErrorLogs = async (page = 1, limit = 20) => {
  // 1. 몇 개를 건너뛸지 계산 (예: 2페이지면 앞에 20개를 건너뜀)
  const skip = (page - 1) * limit;

  // 2. 전체 로그 개수와 해당 페이지의 데이터를 동시에 가져옵니다. ($transaction 활용)
  const [total_count, content] = await prisma.$transaction([
    prisma.errorLogs.count(),
    prisma.errorLogs.findMany({
      skip: skip,
      take: limit,
      orderBy: { created_at: 'desc' }, // 최신 오류가 맨 위에 오도록 정렬
      select: {
        log_id: true,
        error_type: true,
        error_message: true,
        created_at: true,
      },
    }),
  ]);

  // 3. 프론트엔드 테이블 컴포넌트가 그리기 좋은 형태로 반환
  return {
    total_count,
    current_page: page,
    total_pages: Math.ceil(total_count / limit),
    content,
  };
};

// ────────────────────────────────────────────────────────────
// 일별 접속자·시간표 통계 (area chart, days = 7 | 30)
// ────────────────────────────────────────────────────────────
const getDailyStats = async (days = 7) => {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const [userGroups, timetables] = await Promise.all([
      prisma.aCCESS_LOGS.groupBy({
        by: ['user_id'],
        where: { created_at: { gte: day, lt: nextDay }, user_id: { not: null } },
      }),
      prisma.timetables.count({ where: { created_at: { gte: day, lt: nextDay } } }),
    ]);

    result.push({
      date: `${day.getMonth() + 1}/${day.getDate()}`,
      users: userGroups.length,
      timetables,
    });
  }

  return result;
};

// ────────────────────────────────────────────────────────────
// 요일별 접속 분포 (bar chart, 최근 30일)
// ────────────────────────────────────────────────────────────
const getWeekdayStats = async () => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const logs = await prisma.aCCESS_LOGS.findMany({
    where: { created_at: { gte: since } },
    select: { created_at: true },
  });

  const KR_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const counts  = Object.fromEntries(KR_DAYS.map((d) => [d, 0]));

  for (const log of logs) {
    const d = KR_DAYS[new Date(log.created_at).getDay()];
    counts[d]++;
  }

  return ['월', '화', '수', '목', '금', '토', '일'].map((day) => ({
    day,
    count: counts[day],
  }));
};

// ────────────────────────────────────────────────────────────
// Plan A/B/C 최종 선택 분포
// ────────────────────────────────────────────────────────────
const getPlanDistribution = async (period = 'all') => {
  const where = { is_selected: true };

  if (period !== 'all') {
    const days = period === '7d' ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    where.created_at = { gte: since };
  }

  const groups = await prisma.timetables.groupBy({
    by: ['plan_type'],
    where,
    _count: { plan_type: true },
  });

  const total = groups.reduce((s, g) => s + g._count.plan_type, 0);
  const COLORS = { A: '#4F7CF3', B: '#8FA8FF', C: '#C3B5FF' };

  const plans = ['A', 'B', 'C'].map((pt) => {
    const g = groups.find((x) => x.plan_type === pt);
    const count = g?._count.plan_type ?? 0;
    return {
      plan:     `Plan ${pt}`,
      selected: count,
      pct:      total > 0 ? Math.round((count / total) * 100) : 0,
      color:    COLORS[pt],
    };
  });

  return { plans, total };
};

// ────────────────────────────────────────────────────────────
// 공강 선호 요일 분포 (preferences.free_days 파싱)
// ────────────────────────────────────────────────────────────
const getFreeDayDistribution = async () => {
  const prefs = await prisma.preferences.findMany({
    where:  { free_days: { not: null } },
    select: { free_days: true },
  });

  const counts = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0 };
  let total = 0;

  for (const p of prefs) {
    const days = (p.free_days || '')
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d in counts);
    for (const d of days) {
      counts[d]++;
      total++;
    }
  }

  const META = {
    MON: { name: '월요일', short: '월', color: '#8FA8FF' },
    TUE: { name: '화요일', short: '화', color: '#8EDDD0' },
    WED: { name: '수요일', short: '수', color: '#C3B5FF' },
    THU: { name: '목요일', short: '목', color: '#F4AFCF' },
    FRI: { name: '금요일', short: '금', color: '#F7CFA1' },
  };

  return Object.entries(counts).map(([code, count]) => ({
    ...META[code],
    value: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
};

// ────────────────────────────────────────────────────────────
// 학과별 사용자 현황
// ────────────────────────────────────────────────────────────
const getDeptDistribution = async () => {
  const users = await prisma.users.findMany({
    where:  { major_id: { not: null } },
    select: { majors: { select: { major_name: true } } },
  });

  const majorCounts = {};
  for (const u of users) {
    const name = u.majors?.major_name ?? '기타';
    majorCounts[name] = (majorCounts[name] || 0) + 1;
  }

  const COLORS = ['#4F7CF3', '#8FA8FF', '#A78BFA', '#C3B5FF', '#8EDDD0', '#F4AFCF'];

  return Object.entries(majorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([dept, count], i) => ({
      dept,
      short: dept.length > 4 ? dept.substring(0, 3) : dept,
      count,
      color: COLORS[i % COLORS.length],
    }));
};

module.exports = {
  getUsageStats,
  getPreferenceStats,
  getErrorLogs,
  getDailyStats,
  getWeekdayStats,
  getPlanDistribution,
  getFreeDayDistribution,
  getDeptDistribution,
};