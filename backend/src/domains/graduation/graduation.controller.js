const { StatusCodes } = require('http-status-codes');
const graduationService = require('./graduation.service');

const handleGetHistory = async (req, res, next) => {
  try {
    const result = await graduationService.getTakenHistory(req.user.user_id);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

const handleSaveHistory = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // authMiddleware에서 주입됨
    const { courses } = req.body;
    
    const result = await graduationService.saveTakenHistory(userId, courses);
    
    // 준용 님 프로젝트의 공통 응답 포맷 사용
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleGetDashboard = async (req, res, next) => {
  try {
    const result = await graduationService.getDashboard(req.user.user_id);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

module.exports = {
  handleGetHistory,
  handleSaveHistory,
  handleGetDashboard,
};