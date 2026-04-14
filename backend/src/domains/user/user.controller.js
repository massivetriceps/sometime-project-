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

module.exports = { handleWithdraw };
