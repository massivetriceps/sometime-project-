const prisma = require('../../config/db.config');
const graduationRepository = require('./graduation.repository');
const { NoParams } = require('../../errors/customErrors');

const getTakenHistory = async (userId) => {
  const courses = await graduationRepository.findTakenCoursesByUserId(userId);
  return courses.map((c) => ({
    history_id:     c.history_id,
    course_code:    c.course_code,
    course_name:    c.course_name,
    classification: c.classification,
    credits:        c.credits,
  }));
};

const saveTakenHistory = async (userId, courses) => {
  // 1. 데이터 검증
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    throw new NoParams('입력할 기수강 내역이 없습니다.');
  }

  // 2. 기존 내역 삭제 후 새로 저장 (트랜잭션 권장)
  // 여기서는 단순화를 위해 순차적으로 실행합니다.
  await graduationRepository.deleteTakenCoursesByUserId(userId);
  const result = await graduationRepository.createTakenCourses(userId, courses);

  return {
    message: '기수강 내역이 성공적으로 저장되었습니다.',
    count: result.count
  };
};

const getDashboard = async (userId) => {
  // 1. 유저 정보 조회 (학과 및 학번 가져오기)
  const user = await prisma.users.findUnique({ where: { user_id: userId } });
  if (!user) throw new Error('유저 정보를 찾을 수 없습니다.');

  // 학번(예: 202136048)에서 앞 4자리를 추출하여 입학년도(apply_year)로 사용
  const applyYear = user.student_id.substring(0, 4);

  // 2. 해당 학과 & 입학년도에 맞는 졸업요건 기준 조회
  // 💡 스키마가 GRADUATION_REQS 이므로 Prisma는 gRADUATION_REQS 로 매핑합니다.
  let reqs = await prisma.gRADUATION_REQS.findFirst({
    where: { major_id: user.major_id, apply_year: applyYear },
  });

  // 만약 해당 학번의 요건이 아직 DB에 없다면, 해당 학과의 가장 최신 요건을 폴백(Fallback)으로 가져옵니다.
  if (!reqs) {
    reqs = await prisma.gRADUATION_REQS.findFirst({
      where: { major_id: user.major_id },
      orderBy: { apply_year: 'desc' },
    });
  }
  
  if (!reqs) throw new Error('해당 학과의 졸업요건 데이터가 없습니다.');

  // 3. 유저의 기수강 내역 모두 조회
  const takenCourses = await prisma.takenCourses.findMany({
    where: { user_id: userId },
  });

  // 4. 취득 학점 계산 로직
  let total_earned = 0, major_req_earned = 0, major_elec_earned = 0;
  let basic_lib_earned = 0, area_earned = 0, free_earned = 0;
  // 융합교양: 영역별 이수 학점 (예술/사회/자연/세계)
  const conv = { art: 0, society: 0, nature: 0, world: 0 };

  takenCourses.forEach((c) => {
    total_earned += c.credits;
    if      (c.classification === '전필') major_req_earned += c.credits;
    else if (c.classification === '전선') major_elec_earned += c.credits;
    else if (['기교', '교필'].includes(c.classification) || c.classification.includes('기초교양')) basic_lib_earned += c.credits;
    else if (c.classification === '융합(예술)') conv.art    += c.credits;
    else if (c.classification === '융합(사회)') conv.society += c.credits;
    else if (c.classification === '융합(자연)') conv.nature  += c.credits;
    else if (c.classification === '융합(세계)') conv.world   += c.credits;
    else if (c.classification === '계교' || c.classification.includes('계열교양')) area_earned += c.credits;
    else if (['교양선택', '교선', '자유선택'].includes(c.classification) || c.classification.includes('교양')) free_earned += c.credits;
  });

  // 융합교양 요건: req > 0 인 영역 중 3개 이상 이수해야 함
  const convReqs = {
    art:    reqs.convergence_art     || 0,
    society:reqs.convergence_society || 0,
    nature: reqs.convergence_nature  || 0,
    world:  reqs.convergence_world   || 0,
  };
  const conv_req_areas   = 3; // 4개 영역 중 3개 이상 이수
  const conv_total_req   = convReqs.art + convReqs.society + convReqs.nature + convReqs.world;
  const conv_total_earned = conv.art + conv.society + conv.nature + conv.world;
  // 이수한 영역 수 (해당 영역에 학점이 있으면 이수)
  const conv_areas_done  = [conv.art, conv.society, conv.nature, conv.world].filter(v => v > 0).length;

  // 5. 프론트엔드 표출 포맷으로 매핑
  return {
    total_req_credits:   reqs.total_credits,
    total_earned_credits: total_earned,
    details: {
      major_required: { req: reqs.major_required, earned: major_req_earned },
      major_elective: { req: reqs.major_elective, earned: major_elec_earned },
      basic_liberal:  { req: reqs.basic_liberal,  earned: basic_lib_earned },
      convergence_lib: {
        req_areas:     conv_req_areas,   // 이수해야 할 영역 수 (3)
        req_credits:   conv_total_req,   // 총 요구 학점
        earned_credits: conv_total_earned,
        areas_done:    conv_areas_done,  // 현재 이수 완료한 영역 수
        areas: {                         // 영역별 이수 학점
          art:     { req: convReqs.art,     earned: conv.art     },
          society: { req: convReqs.society, earned: conv.society },
          nature:  { req: convReqs.nature,  earned: conv.nature  },
          world:   { req: convReqs.world,   earned: conv.world   },
        },
      },
      area_liberal: { req: reqs.area_liberal || 0, earned: area_earned },
      free_liberal: { req: reqs.free_liberal || 0, earned: free_earned },
    },
  };
};

module.exports = {
  getTakenHistory,
  saveTakenHistory,
  getDashboard,
};