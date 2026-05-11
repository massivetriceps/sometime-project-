const prisma = require('./src/config/db.config');
async function main() {
  // 다양한 과목의 classification 값 확인
  const rows = await prisma.courses.findMany({
    where: { course_name: { contains: '한국사' } },
    select: { course_name: true, classification: true, credits: true },
    take: 5,
  });
  console.log('=== 한국사 ===');
  console.log(JSON.stringify(rows, null, 2));

  // 전체 distinct classification 값 확인
  const all = await prisma.courses.findMany({
    select: { classification: true },
    distinct: ['classification'],
    take: 50,
  });
  console.log('\n=== 전체 classification 종류 ===');
  console.log(all.map(r => r.classification).join('\n'));

  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
