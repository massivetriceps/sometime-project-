const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepository = require('./admin.repository');
const { 
  NoParams, 
  UserNotFoundError, 
  InvalidCredentialsError 
} = require('../../errors/customErrors');

const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

const loginAdmin = async (login_id, password) => {
  // 1. 필수값 체크
  if (!login_id || !password) {
    throw new NoParams('아이디와 비밀번호를 모두 입력해주세요.', { login_id });
  }

  // 2. 관리자 존재 확인
  const admin = await adminRepository.findAdminByLoginId(login_id);
  if (!admin) {
    throw new UserNotFoundError('존재하지 않는 관리자 계정입니다.', { login_id });
  }

  // 3. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError('비밀번호가 일치하지 않습니다.', { login_id });
  }

  // 4. 관리자 전용 토큰 생성 (admin_id와 role 포함)
  const accessToken = jwt.sign(
    { 
      admin_id: admin.admin_id, 
      login_id: admin.login_id, 
      role: admin.role,
      isAdmin: true 
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return { 
    access_token: accessToken, 
    message: "관리자 로그인에 성공했습니다." 
  };
};

module.exports = {
  loginAdmin,
};