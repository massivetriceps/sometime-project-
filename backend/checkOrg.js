const prisma = require('./src/config/db.config');
async function main() {
  const rows = await prisma.courses.findMany({
    where: { classification: '교선' },
    select: { course_name: true, classification: true, organization: true, credits: true },
    take: 15,
  });
  console.log('=== 교선 과목 샘플 ===');
  rows.forEach(r => console.log(`${r.course_name} | org: ${r.organization} | ${r.credits}학점`));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
