const prisma = require('./src/config/db.config');
async function main() {
  const carts = await prisma.carts.findMany({
    where: { user_id: 3 },
    include: { courses: { select: { course_name: true, classification: true, credits: true } } },
  });
  console.log(`장바구니 총 ${carts.length}개:`);
  carts.forEach(c => console.log(`  course_id:${c.course_id} | ${c.courses.course_name} | ${c.courses.classification} | ${c.courses.credits}학점 | 담은날:${c.created_at}`));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
