const preferenceRepository = require('./preference.repository');
const { NoParams } = require('../../errors/customErrors');

const savePreference = async (userId, prefData) => {
  // 간단한 유효성 검사 (예: 하루 최대 강의 수 범위 등)
  if (prefData.max_classes_per_day && (prefData.max_classes_per_day < 1 || prefData.max_classes_per_day > 10)) {
    throw new Error('하루 최대 강의 수는 1에서 10 사이여야 합니다.');
  }

  const preference = await preferenceRepository.upsertPreference(userId, prefData);
  return { 
    message: '선호 조건이 성공적으로 저장되었습니다.',
    preference 
  };
};

const getPreference = async (userId) => {
  const preference = await preferenceRepository.findByUserId(userId);
  return preference || { message: '설정된 선호 조건이 없습니다.' };
};

module.exports = { savePreference, getPreference };