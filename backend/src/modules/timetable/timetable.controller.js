const { StatusCodes } = require('http-status-codes');
const timetableService = require('./timetable.service');

const createTimetable = async (req, res, next) => {
  try {
    const data = await timetableService.createTimetable(req.user.user_id, req.body);
    res.status(StatusCodes.CREATED).success(data);
  } catch (e) {
    next(e);
  }
};

const getTimetables = async (req, res, next) => {
  try {
    const data = await timetableService.getTimetables(req.user.user_id);
    res.status(StatusCodes.OK).success(data);
  } catch (e) {
    next(e);
  }
};

const getComment = async (req, res, next) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.getComment(req.user.user_id, timetableId);
    res.status(StatusCodes.OK).success(data);
  } catch (e) {
    next(e);
  }
};

const updateTimetable = async (req, res, next) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.updateTimetable(req.user.user_id, timetableId, req.body);
    res.status(StatusCodes.OK).success(data);
  } catch (e) {
    next(e);
  }
};

const deleteTimetable = async (req, res, next) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.deleteTimetable(req.user.user_id, timetableId);
    res.status(StatusCodes.OK).success(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createTimetable, getTimetables, getComment, updateTimetable, deleteTimetable,
};
