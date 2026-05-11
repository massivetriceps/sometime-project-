const prisma = require('./src/config/db.config');

async function main() {
  // 1. req_id:17 삭제 (컴공 2021학번 중복 - req_id:10이 더 정확한 데이터)
  await prisma.gRADUATION_REQS.delete({ where: { req_id: 17 } });
  console.log('삭제: req_id:17 (컴공 2021 중복)');

  // 2. req_id:16 삭제 (동양어문학과 2024, 전부 0으로 잘못 입력된 데이터)
  await prisma.gRADUATION_REQS.delete({ where: { req_id: 16 } });
  console.log('삭제: req_id:16 (동양어문학과 2024, 전부 0)');

  const remaining = await prisma.gRADUATION_REQS.count();
  console.log('\n정리 완료. 남은 데이터:', remaining, '개');

  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
