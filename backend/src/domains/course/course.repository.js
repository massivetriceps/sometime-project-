const prisma = require('../../config/db.config');

const findCourses = async (where) => {
  return prisma.courses.findMany({
    where,
    include: {
      course_schedules: { include: { buildings: true } },
      majors: { select: { major_name: true, college_name: true } },
    },
    orderBy: { course_name: 'asc' },
  });
};

const findCourseById = async (course_id) => {
  return prisma.courses.findUnique({ where: { course_id } });
};

const findCourseByCode = async (course_code) => {
  return prisma.courses.findFirst({ where: { course_code } });
};

const createCourse = async (data) => {
  return prisma.courses.create({ data });
};

const updateCourse = async (course_id, data) => {
  return prisma.courses.update({ where: { course_id }, data });
};

const findCartItems = async (user_id) => {
  return prisma.carts.findMany({
    where: { user_id },
    include: {
      courses: {
        include: { course_schedules: { include: { buildings: true } } },
      },
    },
    orderBy: { created_at: 'desc' },
  });
};

const findCartItem = async (user_id, course_id) => {
  return prisma.carts.findUnique({
    where: { user_id_course_id: { user_id, course_id } },
  });
};

const addToCart = async (user_id, course_id) => {
  return prisma.$transaction([
    prisma.carts.create({ data: { user_id, course_id } }),
    prisma.courses.update({
      where: { course_id },
      data: { cart_count: { increment: 1 } },
    }),
  ]);
};

const removeFromCart = async (user_id, course_id) => {
  return prisma.$transaction([
    prisma.carts.delete({ where: { user_id_course_id: { user_id, course_id } } }),
    prisma.courses.update({
      where: { course_id },
      data: { cart_count: { decrement: 1 } },
    }),
  ]);
};

module.exports = {
  findCourses,
  findCourseById,
  findCourseByCode,
  createCourse,
  updateCourse,
  findCartItems,
  findCartItem,
  addToCart,
  removeFromCart,
};
