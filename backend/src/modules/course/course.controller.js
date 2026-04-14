const courseService = require('./course.service');
const { success, fail } = require('../../utils/response');

const getCourses = async (req, res) => {
  try {
    const { keyword, classification } = req.query;
    const data = await courseService.getCourses({ keyword, classification });
    return success(res, data, '강의 목록 조회 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const getMyCart = async (req, res) => {
  try {
    const data = await courseService.getMyCart(req.user.user_id);
    return success(res, data, '장바구니 조회 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const addToCart = async (req, res) => {
  try {
    const courseId = parseInt(req.body.course_id);
    if (!courseId) return fail(res, 'course_id가 필요합니다.', 400);
    const data = await courseService.addToCart(req.user.user_id, courseId);
    return success(res, data, '장바구니 담기 성공', 201);
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const removeFromCart = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const data = await courseService.removeFromCart(req.user.user_id, courseId);
    return success(res, data, '장바구니 취소 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

const uploadCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    if (!courses || !Array.isArray(courses))
      return fail(res, 'courses 배열이 필요합니다.', 400);
    const data = await courseService.uploadCourses(courses);
    return success(res, data, '강의 업로드 성공');
  } catch (e) { return fail(res, e.message, e.status || 500); }
};

module.exports = { getCourses, getMyCart, addToCart, removeFromCart, uploadCourses };
