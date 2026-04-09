const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const updateUserInfo = async (userId, currentPassword, updateData) => {
  // 1. DB에서 유저 찾기 (미들웨어가 넘겨준 userId 사용)
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    const error = new Error('유저를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  // 2. 현재 비밀번호 검증 (보안의 핵심!)
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error('현재 비밀번호가 일치하지 않아 정보를 수정할 수 없습니다.');
    error.status = 401; // Unauthorized
    throw error;
  }

  // 3. 업데이트할 데이터만 쏙쏙 골라내기 (명세서의 '옵션' 처리)
  const dataToUpdate = {};
  
  if (updateData.new_password) {
    // 새 비밀번호는 반드시 다시 암호화해서 저장!
    dataToUpdate.password = await bcrypt.hash(updateData.new_password, 10);
  }
  if (updateData.email) {
    dataToUpdate.email = updateData.email;
  }
  if (updateData.grade) {
    dataToUpdate.grade = updateData.grade;
  }
  if (updateData.student_id) {
    dataToUpdate.student_id = updateData.student_id;
  }
  if (updateData.major_id) {
    dataToUpdate.major_id = updateData.major_id;
  }

  // 4. DB에 업데이트 쿼리 날리기
  await prisma.users.update({
    where: { user_id: userId },
    data: dataToUpdate,
  });

  return { message: "회원 정보가 성공적으로 수정되었습니다." };
};

// 기존에 만들었던 탈퇴(withdrawUser) 함수가 있다면 함께 내보내주세요!
module.exports = {
  updateUserInfo, 
};