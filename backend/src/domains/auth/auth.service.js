const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authRepository = require('./auth.repository');
const {
  NoParams,
  DuplicateUserError,
  InvalidCredentialsError,
  UserNotFoundError,
  ServerError,
} = require('../../errors/customErrors');

const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

const registerUser = async ({ login_id, password, name, grade, student_id, major_id, email }) => {
  if (!login_id || !password || !name || !grade || !student_id || !major_id || !email)
    throw new NoParams('필수 파라미터가 누락되었습니다.', { login_id, name, grade, student_id, major_id, email });

  const existing = await authRepository.findUserByLoginIdOrEmail(login_id, email);
  if (existing)
    throw new DuplicateUserError('이미 존재하는 아이디 또는 이메일입니다.', { login_id, email });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await authRepository.createUser({
    login_id,
    password: hashedPassword,
    name,
    grade,
    student_id,
    major_id,
    email,
  });

  return { user_id: newUser.user_id, message: '회원가입이 완료되었습니다.' };
};

const loginUser = async (login_id, password) => {
  if (!login_id || !password)
    throw new NoParams('아이디와 비밀번호를 모두 입력해주세요.', { login_id });

  const user = await authRepository.findUserByLoginId(login_id);
  if (!user)
    throw new InvalidCredentialsError('아이디 또는 비밀번호가 일치하지 않습니다.', { login_id });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new InvalidCredentialsError('아이디 또는 비밀번호가 일치하지 않습니다.', { login_id });

  const accessToken = jwt.sign(
    { user_id: user.user_id, login_id: user.login_id },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { access_token: accessToken };
};

const findLoginId = async (name, email) => {
  if (!name || !email)
    throw new NoParams('이름과 이메일을 모두 입력해주세요.', { name, email });

  const user = await authRepository.findUserByNameAndEmail(name, email);
  if (!user)
    throw new UserNotFoundError('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.', { name, email });

  const originalId = user.login_id;
  const maskedId =
    originalId.length <= 3
      ? originalId.substring(0, 1) + '*'.repeat(originalId.length - 1)
      : originalId.substring(0, 3) + '*'.repeat(originalId.length - 3);

  return { login_id: maskedId };
};

const resetPassword = async (name, email) => {
  if (!name || !email)
    throw new NoParams('이름과 이메일을 모두 입력해주세요.', { name, email });

  const user = await authRepository.findUserByNameAndEmail(name, email);
  if (!user)
    throw new UserNotFoundError('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.', { name, email });

  const tempPassword = crypto.randomBytes(4).toString('hex');
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  await authRepository.updateUserPassword(user.user_id, hashedPassword);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sometime 관리자" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '[Sometime] 임시 비밀번호 발급 안내',
      text: `안녕하세요 ${name}님,\n\n임시 비밀번호: [ ${tempPassword} ]\n\n로그인 후 반드시 비밀번호를 변경해 주세요.\n\n감사합니다.`,
    });
  } catch (error) {
    throw new ServerError('이메일 발송 중 오류가 발생했습니다.', { email, error: error.message });
  }

  return { message: '등록된 이메일로 임시 비밀번호가 발송되었습니다.' };
};

module.exports = { registerUser, loginUser, findLoginId, resetPassword };
