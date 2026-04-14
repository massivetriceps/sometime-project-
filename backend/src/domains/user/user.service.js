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

module.exports = { withdrawUser };
