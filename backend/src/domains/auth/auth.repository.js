const prisma = require('../../config/db.config');

const findUserByLoginIdOrEmail = async (login_id, email) => {
  return prisma.users.findFirst({
    where: { OR: [{ login_id }, { email }] },
  });
};

const createUser = async (userData) => {
  return prisma.users.create({ data: userData });
};

const findUserByLoginId = async (login_id) => {
  return prisma.users.findUnique({ where: { login_id } });
};

const findUserByNameAndEmail = async (name, email) => {
  return prisma.users.findFirst({ where: { name, email } });
};

const updateUserPassword = async (user_id, hashedPassword) => {
  return prisma.users.update({
    where: { user_id },
    data: { password: hashedPassword },
  });
};

module.exports = {
  findUserByLoginIdOrEmail,
  createUser,
  findUserByLoginId,
  findUserByNameAndEmail,
  updateUserPassword,
};
