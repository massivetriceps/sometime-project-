const bcrypt = require('bcrypt');
const userRepository = require('./user.repository');
const { NoParams, UserNotFoundError, InvalidCredentialsError } = require('../../errors/customErrors');

const withdrawUser = async (userId, password) => {
  if (!password)
    throw new NoParams('탈퇴를 위해 현재 비밀번호를 입력해주세요.', { userId });

  const user = await userRepository.findUserById(userId);
  if (!user)
    throw new UserNotFoundError('유저를 찾을 수 없습니다.', { userId });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new InvalidCredentialsError('비밀번호가 일치하지 않아 탈퇴할 수 없습니다.', { userId });

  await userRepository.deleteUser(userId);

  return { message: '회원 탈퇴가 성공적으로 처리되었습니다. 이용해 주셔서 감사합니다.' };
};
// 정보 수정 로직
const updateUserInfo = async (userId, currentPassword, updateData) => {
  // 1. 빈칸 검사
  if (!currentPassword)
    throw new NoParams('정보 수정을 위해 현재 비밀번호를 입력해주세요.', { userId });

  // 2. 유저 존재 확인
  const user = await userRepository.findUserById(userId);
  if (!user)
    throw new UserNotFoundError('유저를 찾을 수 없습니다.', { userId });

  // 3. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid)
    throw new InvalidCredentialsError('현재 비밀번호가 일치하지 않습니다.', { userId });

  // 4. 바꿀 데이터 조립
  const dataToUpdate = {};
  if (updateData.new_password) {
    dataToUpdate.password = await bcrypt.hash(updateData.new_password, 10);
  }
  if (updateData.email) dataToUpdate.email = updateData.email;
  if (updateData.grade) dataToUpdate.grade = updateData.grade;
  if (updateData.student_id) dataToUpdate.student_id = updateData.student_id;
  if (updateData.major_id) dataToUpdate.major_id = updateData.major_id;

  // 5. 창고에 업데이트 지시
  await userRepository.updateUser(userId, dataToUpdate);

  return { message: '회원 정보가 성공적으로 수정되었습니다.' };
};

// 내 정보 조회 로직
const getUserInfo = async (userId) => {
  const userProfile = await userRepository.getUserProfile(userId);
  
  if (!userProfile) {
    throw new UserNotFoundError('유저 정보를 찾을 수 없습니다.', { userId });
  }
  const { majors, ...rest } = userProfile;  // majors 분리
  
  return {
    ...rest,
    major_name: userProfile.majors?.major_name || '미지정',
    college_name: userProfile.majors?.college_name || '미지정',
  };
};
module.exports = { withdrawUser, updateUserInfo, getUserInfo };
