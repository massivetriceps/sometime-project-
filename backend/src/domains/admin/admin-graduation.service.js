const prisma = require('../../config/db.config');

const updateGraduationRules = async (ruleData) => {
  const { major_id, apply_year, ...restData } = ruleData;

  // 해당 학과 & 학번의 졸업요건이 이미 존재하는지 확인
  const existingRule = await prisma.gRADUATION_REQS.findFirst({
    where: { major_id, apply_year },
  });

  if (existingRule) {
    // 존재하면 업데이트 (고유 ID인 req_id로 업데이트)
    await prisma.gRADUATION_REQS.update({
      where: { req_id: existingRule.req_id },
      data: restData,
    });
  } else {
    // 없으면 새로 생성
    await prisma.gRADUATION_REQS.create({
      data: { major_id, apply_year, ...restData },
    });
  }

  return { message: '졸업요건이 성공적으로 갱신되었습니다.' };
};

module.exports = { updateGraduationRules };