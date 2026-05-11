const prisma = require('./src/config/db.config');

async function main() {
  const users = await prisma.users.findMany({
    include: { majors: { select: { major_name: true } } }
  });
  users.forEach(u => {
    console.log(`user_id:${u.user_id} | student_id:${u.student_id} | apply_year:${u.student_id.substring(0,4)} | major_id:${u.major_id} | major:${u.majors?.major_name}`);
  });
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
