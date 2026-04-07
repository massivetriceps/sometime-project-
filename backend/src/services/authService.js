const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

// ✅ [추가됨] 회원가입 로직
const registerUser = async (userData) => {
  const { login_id, password, name, grade, student_id, major_id, email } = userData;

  // 1. 중복 검사: 이미 존재하는 아이디나 이메일인지 확인
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ login_id: login_id }, { email: email }],
    },
  });

  if (existingUser) {
    const error = new Error('이미 존재하는 아이디 또는 이메일입니다.');
    error.status = 409; // API 명세서 상태 코드 반영 (Conflict)
    throw error;
  }

  // 2. 비밀번호 암호화 (Bcrypt 사용, 10은 암호화 강도)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. DB에 유저 정보 저장
  const newUser = await prisma.users.create({
    data: {
      login_id,
      password: hashedPassword, // 암호화된 비밀번호 저장!
      name,
      grade,
      student_id,
      major_id,
      email,
    },
  });

  // 4. API 명세서에 맞춘 결과 반환
  return {
    user_id: newUser.user_id,
    message: '회원가입이 완료되었습니다.',
  };
};

// 기존 로그인 로직 (이전과 동일)
const loginUser = async (login_id, password) => {
  const user = await prisma.users.findUnique({ where: { login_id } });
  if (!user) {
    const error = new Error('아이디 또는 비밀번호가 일치하지 않음');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('아이디 또는 비밀번호가 일치하지 않음');
    error.status = 401;
    throw error;
  }

  const accessToken = jwt.sign(
    { user_id: user.user_id, login_id: user.login_id },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { access_token: accessToken };
};

module.exports = {
  registerUser,
  loginUser,
};