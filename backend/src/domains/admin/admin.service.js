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

// 관리자 정보 수정 로직
const updateAdminInfo = async (adminId, currentPassword, updateData) => {
  // 1. 현재 비밀번호 입력 확인
  if (!currentPassword) {
    throw new NoParams('정보 수정을 위해 현재 비밀번호를 입력해주세요.', { adminId });
  }

  // 2. 관리자 존재 확인
  const admin = await adminRepository.findAdminById(adminId);
  if (!admin) {
    throw new UserNotFoundError('관리자 계정을 찾을 수 없습니다.', { adminId });
  }

  // 3. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError('현재 비밀번호가 일치하지 않습니다.', { adminId });
  }

  // 4. 업데이트할 데이터 조립
  const dataToUpdate = {};
  
  // 새 비밀번호가 입력되었다면 암호화해서 교체
  if (updateData.new_password) {
    dataToUpdate.password = await bcrypt.hash(updateData.new_password, 10);
  }
  
  // 이름이 입력되었다면 교체 (필요시 다른 필드도 이곳에 추가)
  if (updateData.name) {
    dataToUpdate.name = updateData.name;
  }

  // 5. 창고 관리자에게 업데이트 지시
  await adminRepository.updateAdmin(adminId, dataToUpdate);

  return { message: '관리자 정보가 성공적으로 수정되었습니다.' };
};

// 전체 사용자 목록 조회 로직
const getAllUsers = async () => {
  const users = await adminRepository.findAllUsers();
  
  return { 
    total_count: users.length,
    users 
  };
};

// 관리자에 의한 사용자 삭제 로직
const deleteUserByAdmin = async (targetUserId) => {
  // 1. 삭제할 유저가 있는지 확인 (관리자 창고의 기존 기능을 활용하거나 새로 로직 추가)
  // 여기서는 간단하게 삭제를 시도하고, 없으면 Prisma 에러가 발생하므로 에러 핸들링을 합니다.
  try {
    await adminRepository.deleteUserById(targetUserId);
    return { message: `성공적으로 사용자(ID: ${targetUserId}) 계정을 삭제했습니다.` };
  } catch (error) {
    // P2025는 Prisma에서 레코드를 찾지 못했을 때 발생하는 에러 코드입니다.
    if (error.code === 'P2025') {
      throw new UserNotFoundError('삭제하려는 사용자를 찾을 수 없습니다.', { targetUserId });
    }
    throw error;
  }
};

module.exports = {
  loginAdmin,
  updateAdminInfo,
  getAllUsers,
  deleteUserByAdmin
};