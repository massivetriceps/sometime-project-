/**
 * 강의/장바구니 API 테스트
 * GET    /api/courses                   - 강의 목록 조회
 * GET    /api/users/me/cart             - 내 장바구니 조회
 * POST   /api/users/me/cart             - 장바구니 추가
 * DELETE /api/users/me/cart/:courseId   - 장바구니 삭제
 * POST   /api/admin/courses/upload      - 강의 일괄 업로드
 */
const request = require('supertest');
const app     = require('../src/app');
const { makeToken, makeAdminToken } = require('./helpers/token');

jest.mock('../src/config/db.config', () => ({
  users:   { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  courses: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  carts:   { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  $transaction: jest.fn(),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn().mockResolvedValue({}) }),
}));
jest.mock('bcrypt', () => ({
  hash:    jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

const prisma      = require('../src/config/db.config');
const TOKEN       = makeToken({ user_id: 1, login_id: 'testuser' });
const ADMIN_TOKEN = makeAdminToken({ admin_id: 1 });

const courseStub = {
  course_id: 1, course_code: 'CS101', course_name: '알고리즘',
  classification: '전공필수', credits: 3, professor: '홍길동',
  capacity: 40, cart_count: 5,
  majors: { major_name: '컴퓨터공학부', college_name: 'IT대학' },
  course_schedules: [{
    day_of_week: '월', start_period: 1, end_period: 2,
    room_name: 'AI관 101', buildings: { building_name: 'AI관' },
  }],
};

// ─────────────────────────────────────────────────────────────
// 1. 강의 목록 조회
// ─────────────────────────────────────────────────────────────
describe('GET /api/courses', () => {
  test('성공 - 200 및 강의 배열 반환', async () => {
    prisma.courses.findMany.mockResolvedValue([courseStub]);
    const res = await request(app).get('/api/courses').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.resultType).toBe('SUCCESS');
    expect(Array.isArray(res.body.success)).toBe(true);
    expect(res.body.success[0].course_name).toBe('알고리즘');
  });

  test('성공 - 키워드 필터 쿼리', async () => {
    prisma.courses.findMany.mockResolvedValue([courseStub]);
    const res = await request(app).get('/api/courses?keyword=알고리즘').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.success.length).toBeGreaterThan(0);
  });

  test('실패 - 토큰 없으면 401', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('T001');
  });
});

// ─────────────────────────────────────────────────────────────
// 2. 내 장바구니 조회
// ─────────────────────────────────────────────────────────────
describe('GET /api/users/me/cart', () => {
  test('성공 - 200 및 장바구니 배열 반환', async () => {
    prisma.carts.findMany.mockResolvedValue([{
      created_at: new Date().toISOString(),
      courses: courseStub,
    }]);
    const res = await request(app).get('/api/users/me/cart').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.success)).toBe(true);
  });

  test('실패 - 토큰 없으면 401', async () => {
    const res = await request(app).get('/api/users/me/cart');
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('T001');
  });
});

// ─────────────────────────────────────────────────────────────
// 3. 장바구니 추가
// ─────────────────────────────────────────────────────────────
describe('POST /api/users/me/cart', () => {
  test('성공 - 201 및 추가 메시지', async () => {
    prisma.courses.findUnique.mockResolvedValue(courseStub);
    prisma.carts.findUnique.mockResolvedValue(null);
    prisma.$transaction.mockResolvedValue([{}, {}]);
    const res = await request(app).post('/api/users/me/cart').set('Authorization', TOKEN).send({ course_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.success.message).toMatch(/장바구니/);
  });

  test('실패 - course_id 없으면 400', async () => {
    const res = await request(app).post('/api/users/me/cart').set('Authorization', TOKEN).send({});
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });

  test('실패 - 존재하지 않는 강의 404', async () => {
    prisma.courses.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/users/me/cart').set('Authorization', TOKEN).send({ course_id: 9999 });
    expect(res.status).toBe(404);
    expect(res.body.error.errorCode).toBe('C001');
  });

  test('실패 - 이미 담긴 강의 409', async () => {
    prisma.courses.findUnique.mockResolvedValue(courseStub);
    prisma.carts.findUnique.mockResolvedValue({ user_id: 1, course_id: 1 });
    const res = await request(app).post('/api/users/me/cart').set('Authorization', TOKEN).send({ course_id: 1 });
    expect(res.status).toBe(409);
    expect(res.body.error.errorCode).toBe('C002');
  });
});

// ─────────────────────────────────────────────────────────────
// 4. 장바구니 삭제
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/users/me/cart/:courseId', () => {
  test('성공 - 200 및 삭제 메시지', async () => {
    prisma.carts.findUnique.mockResolvedValue({ user_id: 1, course_id: 1 });
    prisma.$transaction.mockResolvedValue([{}, {}]);
    const res = await request(app).delete('/api/users/me/cart/1').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.success.message).toMatch(/삭제/);
  });

  test('실패 - 장바구니에 없는 강의 404', async () => {
    prisma.carts.findUnique.mockResolvedValue(null);
    const res = await request(app).delete('/api/users/me/cart/999').set('Authorization', TOKEN);
    expect(res.status).toBe(404);
    expect(res.body.error.errorCode).toBe('C003');
  });
});

// ─────────────────────────────────────────────────────────────
// 5. 강의 일괄 업로드 (어드민)
// ─────────────────────────────────────────────────────────────
describe('POST /api/admin/courses/upload', () => {
  const uploadBody = {
    courses: [{ course_code: 'CS201', course_name: '운영체제', classification: '전공선택', credits: 3, professor: '김교수', major_id: 1 }],
  };

  test('성공 - 200 및 생성 카운트', async () => {
    prisma.courses.findFirst.mockResolvedValue(null);
    prisma.courses.create.mockResolvedValue({ course_id: 2 });
    const res = await request(app).post('/api/admin/courses/upload').set('Authorization', ADMIN_TOKEN).send(uploadBody);
    expect(res.status).toBe(200);
    expect(res.body.success).toMatchObject({ created: 1, updated: 0 });
  });

  test('성공 - 기존 강의 업데이트', async () => {
    prisma.courses.findFirst.mockResolvedValue({ course_id: 1 });
    prisma.courses.update.mockResolvedValue({});
    const res = await request(app).post('/api/admin/courses/upload').set('Authorization', ADMIN_TOKEN).send(uploadBody);
    expect(res.status).toBe(200);
    expect(res.body.success).toMatchObject({ created: 0, updated: 1 });
  });

  test('실패 - courses 배열 없으면 400', async () => {
    const res = await request(app).post('/api/admin/courses/upload').set('Authorization', ADMIN_TOKEN).send({});
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });

  test('실패 - 어드민 토큰 없으면 401', async () => {
    const res = await request(app).post('/api/admin/courses/upload').send(uploadBody);
    expect(res.status).toBe(401);
  });
});
