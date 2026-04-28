const { StatusCodes } = require('http-status-codes');
const adminGraduationService = require('./admin-graduation.service');

const handleUpdateRules = async (req, res, next) => {
  try {
    const result = await adminGraduationService.updateGraduationRules(req.body);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

module.exports = { handleUpdateRules };