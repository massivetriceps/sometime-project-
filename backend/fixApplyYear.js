const prisma = require('./src/config/db.config');

async function main() {
  const rows = await prisma.gRADUATION_REQS.findMany();

  for (const row of rows) {
    // 2자리 연도만 수정 (ex: "21" → "2021")
    if (row.apply_year.length === 2) {
      const newYear = '20' + row.apply_year;
      await prisma.gRADUATION_REQS.update({
        where: { req_id: row.req_id },
        data: { apply_year: newYear },
      });
      console.log(`req_id:${row.req_id} "${row.apply_year}" → "${newYear}"`);
    } else {
      console.log(`req_id:${row.req_id} "${row.apply_year}" → 변경 불필요`);
    }
  }

  console.log('\n완료!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
