const prisma = require('../../config/db.config');

// 로그인 ID로 관리자 찾기
const findAdminByLoginId = async (login_id) => {
  return prisma.admin.findUnique({
    where: { login_id },
  });
};
// 고유 ID로 관리자 찾기
const findAdminById = async (admin_id) => {
  return prisma.admin.findUnique({ where: { admin_id } });
};

// 관리자 정보 업데이트
const updateAdmin = async (admin_id, data) => {
  return prisma.admin.update({ where: { admin_id }, data });
};

// 모든 사용자 목록 조회
const findAllUsers = async () => {
  return prisma.users.findMany({
    select: {
      user_id: true,
      login_id: true,
      name: true,
      email: true,
      grade: true,
      student_id: true,
      major_id: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc' // 최근 가입한 순서대로 정렬
    }
  });
};

// 특정 사용자 삭제
const deleteUserById = async (user_id) => {
  return prisma.users.delete({
    where: { user_id: parseInt(user_id) },
  });
};

module.exports = {
  findAdminByLoginId,
  findAdminById,  
  updateAdmin,
  findAllUsers,
  deleteUserById
};