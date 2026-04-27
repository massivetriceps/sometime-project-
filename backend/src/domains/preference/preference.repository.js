const prisma = require('../../config/db.config');

const findByUserId = async (user_id) => {
  return prisma.preference.findUnique({ where: { user_id } });
};

const upsertPreference = async (user_id, data) => {
  return prisma.preference.upsert({
    where: { user_id },
    update: data,
    create: { user_id, ...data },
  });
};

module.exports = { findByUserId, upsertPreference };