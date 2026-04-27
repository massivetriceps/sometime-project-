const { StatusCodes } = require('http-status-codes');
const preferenceService = require('./preference.service');

const handleSavePreference = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await preferenceService.savePreference(userId, req.body);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleGetPreference = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await preferenceService.getPreference(userId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSavePreference, handleGetPreference };