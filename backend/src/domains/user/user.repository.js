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

module.exports = { findUserById, deleteUser, updateUser };
