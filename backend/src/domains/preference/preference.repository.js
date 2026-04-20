const prisma = require('../../config/db.config');

const findByUserId = async (user_id) => {
  return prisma.preferences.findFirst({ where: { user_id } });
};

const upsertPreference = async (user_id, data) => {
  // 1. 기존 선호도가 있는지 먼저 확인
  const existing = await prisma.preferences.findFirst({ where: { user_id } });

  if (existing) {
    // 2. 있으면 기존 데이터의 pref_id를 기준으로 업데이트
    return prisma.preferences.update({
      where: { pref_id: existing.pref_id },
      data,
    });
  } else {
    // 3. 없으면 새로 생성
    return prisma.preferences.create({
      data: { user_id, ...data },
    });
  }
};

module.exports = { findByUserId, upsertPreference };