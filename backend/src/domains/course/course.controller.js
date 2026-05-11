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

const handleExportCourses = async (req, res, next) => {
  try {
    const courses = await courseService.exportCourses();
    const header = '강의코드,강의명,이수구분,영역,학점,담당교수,정원,학과ID,개설조직';
    const rows = courses.map(c =>
      [c.course_code, `"${c.course_name}"`, c.classification, '', c.credits, c.professor, c.capacity, c.major_id, `"${c.organization}"`].join(',')
    );
    const csv = '﻿' + [header, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="courses_export.csv"');
    res.send(csv);
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
  handleExportCourses,
};
