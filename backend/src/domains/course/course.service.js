const courseRepository = require('./course.repository');
const {
  NoParams,
  CourseNotFoundError,
  DuplicateCartError,
  CartNotFoundError,
} = require('../../errors/customErrors');

// 프론트 → DB 약칭 매핑 (COURSES.classification 실제 저장값 기준)
const CLASS_MAP = {
  '전공필수': '전필',
  '전공선택': '전선',
  '기초교양': '기교',
  '교양필수': '교필',
  '교양선택': '교선',
  '계열교양': '계교',
  '자유교양': '자선',
  '자유선택': '자선',
};

const getCourses = async ({ keyword, classification }) => {
  const where = {};
  if (keyword) {
    where.OR = [
      { course_name: { contains: keyword } },
      { course_code: { contains: keyword } },
      { professor:   { contains: keyword } },
    ];
  }
  if (classification) {
    const mapped = CLASS_MAP[classification];
    if (mapped) {
      // 매핑된 약칭으로 정확 일치
      where.classification = mapped;
    } else if (classification === '융합교양') {
      // 융합교양은 서브타입(융인·융사·융자·융세 등)을 포함
      where.classification = { contains: '융합' };
    } else {
      // 이미 약칭이거나 알 수 없는 값 → 그대로 사용
      where.classification = classification;
    }
  }

  const courses = await courseRepository.findCourses(where);

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
  const carts = await courseRepository.findCartItems(userId);

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
  if (!courseId) throw new NoParams('course_id가 필요합니다.', { courseId });

  const course = await courseRepository.findCourseById(courseId);
  if (!course)
    throw new CourseNotFoundError('존재하지 않는 강의입니다.', { courseId });

  const existing = await courseRepository.findCartItem(userId, courseId);
  if (existing)
    throw new DuplicateCartError('이미 장바구니에 담긴 강의입니다.', { userId, courseId });

  await courseRepository.addToCart(userId, courseId);
  return { message: '장바구니에 추가되었습니다.' };
};

const removeFromCart = async (userId, courseId) => {
  const existing = await courseRepository.findCartItem(userId, courseId);
  if (!existing)
    throw new CartNotFoundError('장바구니에 없는 강의입니다.', { userId, courseId });

  await courseRepository.removeFromCart(userId, courseId);
  return { message: '장바구니에서 삭제되었습니다.' };
};

const uploadCourses = async (rows) => {
  if (!rows || !Array.isArray(rows))
    throw new NoParams('courses 배열이 필요합니다.', {});

  let created = 0, updated = 0;
  for (const row of rows) {
    const existing = await courseRepository.findCourseByCode(row.course_code);
    if (existing) {
      await courseRepository.updateCourse(existing.course_id, row);
      updated++;
    } else {
      await courseRepository.createCourse(row);
      created++;
    }
  }
  return { message: '강의 업로드 완료', created, updated };
};

module.exports = { getCourses, getMyCart, addToCart, removeFromCart, uploadCourses };
