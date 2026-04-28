const prisma = require('../../config/db.config');

const updateDistances = async (distances) => {
  // 1. 방어 로직: 데이터가 배열로 잘 들어왔는지 확인
  if (!distances || !Array.isArray(distances)) {
    const error = new Error('distances 배열 데이터가 필요합니다.');
    error.status = 400;
    throw error;
  }

  let createdCount = 0;
  let updatedCount = 0;

  // 2. 트랜잭션: 중간에 하나라도 에러가 나면 전체를 취소(Rollback)합니다.
  await prisma.$transaction(async (tx) => {
    for (const dist of distances) {
      const { from_building_id, to_building_id, time_minutes, is_uphill } = dist;

      // 필수값 체크
      if (!from_building_id || !to_building_id || time_minutes === undefined) {
        throw new Error('from_building_id, to_building_id, time_minutes는 필수입니다.');
      }

      // 3. 기존에 이미 등록된 동일한 경로가 있는지 DB에서 찾습니다.
      const existing = await tx.distances.findFirst({
        where: { 
          from_building_id: from_building_id, 
          to_building_id: to_building_id 
        },
      });

      if (existing) {
        // 이미 있으면 이동 시간과 오르막 여부만 갱신
        await tx.distances.update({
          where: { distance_id: existing.distance_id },
          data: { time_minutes, is_uphill: is_uphill || false },
        });
        updatedCount++;
      } else {
        // 없으면 새로 생성
        await tx.distances.create({
          data: { from_building_id, to_building_id, time_minutes, is_uphill: is_uphill || false },
        });
        createdCount++;
      }
    }
  });

  return {
    message: '동선 데이터가 성공적으로 갱신되었습니다.',
    created: createdCount,
    updated: updatedCount
  };
};

module.exports = { updateDistances };