const prisma = require('../../config/db.config');

// 로그인 ID로 관리자 찾기
const findAdminByLoginId = async (login_id) => {
  return prisma.admin.findUnique({
    where: { login_id },
  });
};

module.exports = {
  findAdminByLoginId,
};