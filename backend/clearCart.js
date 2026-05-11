const prisma = require('./src/config/db.config');
async function main() {
  const deleted = await prisma.carts.deleteMany({ where: { user_id: 3 } });
  console.log(`✅ 장바구니 ${deleted.count}개 항목 삭제 완료`);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
