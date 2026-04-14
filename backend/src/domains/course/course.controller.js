const { StatusCodes } = require('http-status-codes');
const courseService = require('./course.service');

const handleGetCourses = async (req, res, next) => {
  try {
    const { keyword, classification } = req.query;
    const result = await courseService.getCourses({ keyword, classification });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleGetMyCart = async (req, res, next) => {
  try {
    const result = await courseService.getMyCart(req.user.user_id);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleAddToCart = async (req, res, next) => {
  try {
    const courseId = parseInt(req.body.course_id);
    const result = await courseService.addToCart(req.user.user_id, courseId);
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    next(error);
  }
};

const handleRemoveFromCart = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const result = await courseService.removeFromCart(req.user.user_id, courseId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleUploadCourses = async (req, res, next) => {
  try {
    const { courses } = req.body;
    const result = await courseService.uploadCourses(courses);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetCourses,
  handleGetMyCart,
  handleAddToCart,
  handleRemoveFromCart,
  handleUploadCourses,
};
