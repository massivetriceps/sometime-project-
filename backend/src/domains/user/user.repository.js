const prisma = require('../../config/db.config');

const findUserById = async (user_id) => {
  return prisma.users.findUnique({ where: { user_id } });
};

const deleteUser = async (user_id) => {
  return prisma.users.delete({ where: { user_id } });
};

const updateUser = async (user_id, data) => {
  return prisma.users.update({ where: { user_id }, data });
};

// 프론트엔드 전달용 안전한 프로필 조회 (비밀번호 제외)
const getUserProfile = async (user_id) => {
  return prisma.users.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      login_id: true,
      name: true,
      email: true,
      grade: true,
      student_id: true,
      major_id: true,
      created_at: true,
      majors: {        // ✅ 추가
        select: {
          major_name: true,
          college_name: true,
        }
    }
  }
  });
};
module.exports = { findUserById, deleteUser, updateUser, getUserProfile };
