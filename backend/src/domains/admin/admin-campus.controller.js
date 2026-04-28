const { StatusCodes } = require('http-status-codes');
const adminCampusService = require('./admin-campus.service');

const handleUpdateDistances = async (req, res, next) => {
  try {
    // 바디가 비어있는지 체크
    if (!req.body || !req.body.distances) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "distances 배열 데이터가 필요합니다.",
      });
    }

    const { distances } = req.body;
    const result = await adminCampusService.updateDistances(distances);
    
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleUpdateDistances };