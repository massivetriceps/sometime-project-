const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234!', 10);
  
  await prisma.admin.create({ // .admins -> .admin
    data: {
      login_id: 'admin_master',
      password: hashedPassword,
      name: '최고관리자',
      role: 'SUPER'
    }
  });
  console.log('✅ 최고 관리자 계정이 생성되었습니다! (ID: admin_master / PW: admin1234!)');
}

main().catch(console.error).finally(() => prisma.$disconnect());