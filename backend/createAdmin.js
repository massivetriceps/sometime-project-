const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // 1. 비밀번호 암호화
  const hashedPassword = await bcrypt.hash('admin1234!', 10);
  
  // 2. 관리자 생성 (최신 스키마의 필수 필드인 email 추가)
  await prisma.admins.create({ 
    data: {
      login_id: 'admin_master',
      password: hashedPassword,
      name: '최고관리자',
      email: 'admin@gachon.ac.kr', // ✨ 최신 DB 필수 필드 추가
      role: 'ADMIN'                // ✨ 'SUPER' 또는 'ADMIN' (DB 제약조건 확인 필요)
    }
  });

  console.log('✅ 최고 관리자 계정이 성공적으로 생성되었습니다!');
  console.log('👉 ID: admin_master / PW: admin1234!');
}

main()
  .catch((e) => {
    console.error('❌ 계정 생성 중 에러 발생:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });