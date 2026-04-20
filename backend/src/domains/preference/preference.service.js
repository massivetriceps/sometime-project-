const preferenceRepository = require('./preference.repository');
const { NoParams } = require('../../errors/customErrors');

const savePreference = async (userId, prefData) => {
  // 1. 필요한 최신 컬럼 데이터만 안전하게 추출
  const {
    avoid_uphill, preferred_time, free_days, credit_intensity,
    minimize_gaps, prioritize_required, prefer_online, max_classes_per_day
  } = prefData;

  // 2. 간단한 유효성 검사
  if (max_classes_per_day && (max_classes_per_day < 1 || max_classes_per_day > 10)) {
    throw new Error('하루 최대 강의 수는 1에서 10 사이여야 합니다.');
  }

  // 3. DB에 저장할 깨끗한 객체 조립
  const dataToSave = {
    avoid_uphill,
    preferred_time,
    free_days,
    credit_intensity,
    minimize_gaps,
    prioritize_required,
    prefer_online,
    max_classes_per_day
  };

  // 4. 레포지토리에 저장 지시
  const preference = await preferenceRepository.upsertPreference(userId, dataToSave);
  
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