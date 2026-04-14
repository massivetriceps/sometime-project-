const prisma = require('../../config/db');

const getCourses = async ({ keyword, classification }) => {
  const where = {};
  if (keyword) {
    where.OR = [
      { course_name: { contains: keyword } },
      { course_code: { contains: keyword } },
      { professor:   { contains: keyword } },
    ];
  }
  if (classification) where.classification = classification;

  const courses = await prisma.courses.findMany({
    where,
    include: {
      course_schedules: { include: { buildings: true } },
      majors: { select: { major_name: true, college_name: true } },
    },
    orderBy: { course_name: 'asc' },
  });

  return courses.map((c) => ({
    course_id:      c.course_id,
    course_code:    c.course_code,
    course_name:    c.course_name,
    classification: c.classification,
    credits:        c.credits,
    professor:      c.professor,
    capacity:       c.capacity,
    cart_count:     c.cart_count,
    major:          c.majors?.major_name,
    college:        c.majors?.college_name,
    schedules: c.course_schedules.map((s) => ({
      day_of_week:  s.day_of_week,
      start_period: s.start_period,
      end_period:   s.end_period,
      room_name:    s.room_name,
      building:     s.buildings?.building_name ?? '온라인',
    })),
  }));
};

const getMyCart = async (userId) => {
  const carts = await prisma.carts.findMany({
    where: { user_id: userId },
    include: {
      courses: {
        include: {
          course_schedules: { include: { buildings: true } },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return carts.map((cart) => {
    const c = cart.courses;
    return {
      course_id:      c.course_id,
      course_code:    c.course_code,
      course_name:    c.course_name,
      classification: c.classification,
      credits:        c.credits,
      professor:      c.professor,
      added_at:       cart.created_at,
      schedules: c.course_schedules.map((s) => ({
        day_of_week:  s.day_of_week,
        start_period: s.start_period,
        end_period:   s.end_period,
        room_name:    s.room_name,
        building:     s.buildings?.building_name ?? '온라인',
      })),
    };
  });
};

const addToCart = async (userId, courseId) => {
  const course = await prisma.courses.findUnique({ where: { course_id: courseId } });
  if (!course) {
    const err = new Error('존재하지 않는 강의입니다.'); err.status = 404; throw err;
  }
  const existing = await prisma.carts.findUnique({
    where: { user_id_course_id: { user_id: userId, course_id: courseId } },
  });
  if (existing) {
    const err = new Error('이미 장바구니에 담긴 강의입니다.'); err.status = 409; throw err;
  }
  await prisma.$transaction([
    prisma.carts.create({ data: { user_id: userId, course_id: courseId } }),
    prisma.courses.update({ where: { course_id: courseId }, data: { cart_count: { increment: 1 } } }),
  ]);
  return { message: '장바구니에 추가되었습니다.' };
};

const removeFromCart = async (userId, courseId) => {
  const existing = await prisma.carts.findUnique({
    where: { user_id_course_id: { user_id: userId, course_id: courseId } },
  });
  if (!existing) {
    const err = new Error('장바구니에 없는 강의입니다.'); err.status = 404; throw err;
  }
  await prisma.$transaction([
    prisma.carts.delete({ where: { user_id_course_id: { user_id: userId, course_id: courseId } } }),
    prisma.courses.update({ where: { course_id: courseId }, data: { cart_count: { decrement: 1 } } }),
  ]);
  return { message: '장바구니에서 삭제되었습니다.' };
};

const uploadCourses = async (rows) => {
  let created = 0, updated = 0;
  for (const row of rows) {
    const existing = await prisma.courses.findFirst({ where: { course_code: row.course_code } });
    if (existing) {
      await prisma.courses.update({ where: { course_id: existing.course_id }, data: row });
      updated++;
    } else {
      await prisma.courses.create({ data: row });
      created++;
    }
  }
  return { message: '강의 업로드 완료', created, updated };
};

module.exports = { getCourses, getMyCart, addToCart, removeFromCart, uploadCourses };
