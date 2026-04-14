const prisma = require('../../config/db.config');

const findUserById = async (user_id) => {
  return prisma.users.findUnique({ where: { user_id } });
};

const deleteUser = async (user_id) => {
  return prisma.users.delete({ where: { user_id } });
};

module.exports = { findUserById, deleteUser };
