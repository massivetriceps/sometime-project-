const prisma = require('./src/config/db.config');

async function main() {
  const row = await prisma.gRADUATION_REQS.findFirst({
    where: { major_id: 62, apply_year: '2021' }
  });
  console.log(JSON.stringify(row, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
