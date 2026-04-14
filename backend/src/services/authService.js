const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer'); 
const crypto = require('crypto');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

// 회원가입 로직
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

// 로그인 로직 
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

// 아이디 찾기 및 마스킹 로직
const findLoginId = async (name, email) => {
  // 1. 이름과 이메일이 모두 일치하는 유저 찾기
  const user = await prisma.users.findFirst({
    where: {
      name: name,
      email: email,
    },
  });

  // 2. 일치하는 유저가 없으면 에러 던지기
  if (!user) {
    const error = new Error('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
    error.status = 404; // Not Found
    throw error;
  }

  // 3. 아이디 마스킹 처리 로직 (앞 3자리만 보여주고 나머지는 * 처리)
  const originalId = user.login_id;
  let maskedId = '';

  if (originalId.length <= 3) {
    // 아이디가 3자리 이하면 맨 앞 1자리만 보여줌
    maskedId = originalId.substring(0, 1) + '*'.repeat(originalId.length - 1);
  } else {
    // 일반적인 경우: 앞 3자리 + 나머지 길이만큼 * 붙이기
    maskedId = originalId.substring(0, 3) + '*'.repeat(originalId.length - 3);
  }

  // 예: "student2026" -> "stu********"
  return { login_id: maskedId };
};

// 비밀번호 초기화 (임시 비밀번호 발송)
const resetPassword = async (name, email) => {
  // 1. 이름과 이메일이 일치하는 유저 찾기
  const user = await prisma.users.findFirst({
    where: { name: name, email: email },
  });

  if (!user) {
    const error = new Error('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  // 2. 임시 비밀번호 생성 (8자리 랜덤 문자열, 예: 4f9a2b1c)
  const tempPassword = crypto.randomBytes(4).toString('hex');

  // 3. 임시 비밀번호 암호화 후 DB에 덮어쓰기 (Update)
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  await prisma.users.update({
    where: { user_id: user.user_id },
    data: { password: hashedPassword },
  });

  // 4. 메일 발송기(Transporter) 세팅 (발송하는 사람 정보)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // .env에 저장할 구글 아이디
      pass: process.env.EMAIL_PASS, // .env에 저장할 앱 비밀번호
    },
  });

  // 5. 실제 메일 보내기
  await transporter.sendMail({
    from: `"Sometime 관리자" <${process.env.EMAIL_USER}>`,
    to: email, // 방금 찾은 유저의 이메일 (예: thunder@gachon.ac.kr)
    subject: '[Sometime] 임시 비밀번호 발급 안내',
    text: `안녕하세요 ${name}님,\n\n요청하신 계정의 임시 비밀번호가 발급되었습니다.\n\n임시 비밀번호: [ ${tempPassword} ]\n\n임시 비밀번호로 로그인하신 후, 반드시 마이페이지에서 비밀번호를 변경해 주시기 바랍니다.\n\n감사합니다.`
  });

  return { message: "등록된 이메일로 임시 비밀번호가 발송되었습니다." };
};

// 회원 탈퇴 로직
const withdrawUser = async (userId, password) => {
  // 1. DB에서 유저 찾기 (미들웨어가 준 userId로 정확히 타겟팅)
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    const error = new Error('유저를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  // 2. 비밀번호 검증 (현재 비밀번호가 맞는지 확인)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('비밀번호가 일치하지 않아 탈퇴할 수 없습니다.');
    error.status = 401;
    throw error;
  }

  // 3. 비밀번호가 맞으면 DB에서 유저 삭제
  await prisma.users.delete({
    where: { user_id: userId },
  });

  return { message: "회원 탈퇴가 성공적으로 처리되었습니다. 이용해 주셔서 감사합니다." };
};

module.exports = {
  registerUser,
  loginUser,
  findLoginId,
  resetPassword,
  withdrawUser,
};