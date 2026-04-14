const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
// 기존 유저 로그인에 쓰던 비밀키 사용
const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key'; 

const loginAdmin = async (loginId, password) => {
  // 1. 관리자 테이블(ADMINS)에서 아이디 찾기
  const admin = await prisma.admins.findFirst({
    where: { login_id: loginId },
  });

  if (!admin) {
    const error = new Error('존재하지 않는 관리자 계정입니다.');
    error.status = 404;
    throw error;
  }

  // 2. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }

  // 3. 관리자 전용 출입증(JWT) 발급
  // 토큰 안에 'isAdmin: true'와 'role'을 넣어서 일반 유저와 구별
  const token = jwt.sign(
    { 
      admin_id: admin.admin_id, 
      role: admin.role, 
      isAdmin: true 
    },
    JWT_SECRET,
    { expiresIn: '12h' } // 관리자는 업무 시간이 기니까 12시간짜리 출입증 발급
  );

  return {
    access_token: token,
    message: "관리자 로그인에 성공했습니다.",
  };
};

module.exports = {
  loginAdmin,
};