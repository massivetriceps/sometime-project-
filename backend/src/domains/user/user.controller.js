const { StatusCodes } = require('http-status-codes');
const userService = require('./user.service');

const handleWithdraw = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { password } = req.body;
    const result = await userService.withdrawUser(userId, password);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 정보 수정 컨트롤러
const handleUpdateInfo = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { current_password, new_password, email, grade, student_id, major_id } = req.body;
    
    const updateData = { new_password, email, grade, student_id, major_id };
    
    const result = await userService.updateUserInfo(userId, current_password, updateData);
    
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleWithdraw, handleUpdateInfo };
