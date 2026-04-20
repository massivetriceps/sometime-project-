const { StatusCodes } = require('http-status-codes');
const adminStatsService = require('./admin-stats.service');

const handleGetUsageStats = async (req, res, next) => {
  try {
    const result = await adminStatsService.getUsageStats();
    
    // 팀 프로젝트 공통 응답 포맷 (success, message, data) 사용
    res.status(StatusCodes.OK).success({
      message: '이용 통계 조회 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetPreferenceStats = async (req, res, next) => {
  try {
    const result = await adminStatsService.getPreferenceStats();
    
    res.status(StatusCodes.OK).success({
      message: '선호 조건 통계 조회 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetErrorLogs = async (req, res, next) => {
  try {
    // 쿼리 파라미터는 문자열로 들어오므로 숫자로 변환합니다. 값이 없으면 기본값(1, 20) 사용
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await adminStatsService.getErrorLogs(page, limit);
    
    res.status(StatusCodes.OK).success({
      message: '오류 로그 조회 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetUsageStats,
  handleGetPreferenceStats,
  handleGetErrorLogs,
};