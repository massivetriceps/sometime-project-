const prisma = require('../../config/db.config');

const getUsageStats = async () => {
  // 1. 오늘 자정부터 내일 자정 전까지의 시간 범위 설정
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 2. 누적 생성된 시간표 수 (전체 카운트)
  const total_timetables = await prisma.timetables.count();

  // 3. 일일 API 호출 수 (오늘 하루 동안 쌓인 ACCESS_LOGS 수)
  const api_call_counts = await prisma.aCCESS_LOGS.count({
    where: {
      created_at: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // 4. 일일 활성 유저 수 (오늘 하루 동안 접속한 고유 user_id 수)
  const active_users_group = await prisma.aCCESS_LOGS.groupBy({
    by: ['user_id'],
    where: {
      created_at: {
        gte: today,
        lt: tomorrow,
      },
      user_id: { not: null }, // 비회원(로그인 전) 제외
    },
  });
  const daily_active_users = active_users_group.length;

  return {
    daily_active_users,
    total_timetables,
    api_call_counts,
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

module.exports = {
  getUsageStats,
  getPreferenceStats,
  getErrorLogs,
};