const { StatusCodes } = require('http-status-codes');
const noticeService = require('./notice.service');

const handleGetNotices = async (req, res, next) => {
  try {
    const result = await noticeService.getNotices();
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

const handleCreateNotice = async (req, res, next) => {
  try {
    const adminId = req.admin.admin_id; // adminMiddleware를 통과해야 함
    const result = await noticeService.createNotice(adminId, req.body);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

const handleUpdateNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const result = await noticeService.updateNotice(noticeId, req.body);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

const handleDeleteNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const result = await noticeService.deleteNotice(noticeId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

module.exports = { handleGetNotices, handleCreateNotice, handleUpdateNotice, handleDeleteNotice };