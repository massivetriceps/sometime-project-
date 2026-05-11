const prisma = require('../../config/db.config');

/**
 * 기수강 내역 일괄 저장
 */
const createTakenCourses = async (userId, courses) => {
  // 전달받은 강의 배열에 user_id를 각각 주입합니다.
  const dataWithUserId = courses.map(course => ({
    user_id: userId,
    course_code: course.course_code,
    course_name: course.course_name,
    classification: course.classification,
    credits: course.credits
  }));

  return prisma.takenCourses.createMany({
    data: dataWithUserId,
    skipDuplicates: true, // 중복된 학수번호 입력 시 에러 방지 (선택 사항)
  });
};

/**
 * 기존 기수강 내역 삭제 (초기화 후 재입력 시 사용)
 */
const deleteTakenCoursesByUserId = async (userId) => {
  return prisma.takenCourses.deleteMany({
    where: { user_id: userId }
  });
};

const findTakenCoursesByUserId = async (userId) => {
  return prisma.takenCourses.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' },
  });
};

module.exports = {
  createTakenCourses,
  deleteTakenCoursesByUserId,
  findTakenCoursesByUserId,
};