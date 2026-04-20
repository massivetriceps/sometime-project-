const timetableService = require('./timetable.service');
const { success, fail } = require('../../utils/response');

const createTimetable = async (req, res) => {
  try {
    const data = await timetableService.createTimetable(req.user.user_id, req.body);
    return success(res, data, '시간표 생성 성공', 201);
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const getTimetables = async (req, res) => {
  try {
    const data = await timetableService.getTimetables(req.user.user_id);
    return success(res, data, '시간표 조회 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const getComment = async (req, res) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.getComment(req.user.user_id, timetableId);
    return success(res, data, 'AI 코멘트 조회 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const updateTimetable = async (req, res) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.updateTimetable(
      req.user.user_id, timetableId, req.body
    );
    return success(res, data, '시간표 수정 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const deleteTimetable = async (req, res) => {
  try {
    const timetableId = parseInt(req.params.timetable_id);
    const data = await timetableService.deleteTimetable(req.user.user_id, timetableId);
    return success(res, data, '시간표 삭제 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

module.exports = {
  createTimetable, getTimetables, getComment, updateTimetable, deleteTimetable,
};
