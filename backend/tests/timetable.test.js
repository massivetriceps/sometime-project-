/**
 * 시간표 API 테스트
 * POST   /api/users/me/timetables                       - 시간표 생성
 * GET    /api/users/me/timetables                       - 시간표 목록 조회
 * GET    /api/users/me/timetables/:id/comment           - AI 코멘트 조회
 * PUT    /api/users/me/timetables/:id                   - 시간표 수정
 * DELETE /api/users/me/timetables/:id                   - 시간표 삭제
 */
const request = require('supertest');
const app     = require('../src/app');
const { makeToken } = require('./helpers/token');

jest.mock('../src/config/db', () => ({
  carts:            { findMany: jest.fn() },
  courses:          { findMany: jest.fn() },
  distances:        { findMany: jest.fn() },
  timetables:       { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
  timetableCourses: { createMany: jest.fn(), deleteMany: jest.fn() },
  $transaction:     jest.fn(),
}));
jest.mock('axios', () => ({ post: jest.fn() }));
jest.mock('../src/config/db.config', () => ({
  users:   { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  courses: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  carts:   { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  $transaction: jest.fn(),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn().mockResolvedValue({}) }),
}));
jest.mock('bcrypt', () => ({ hash: jest.fn().mockResolvedValue('hashed'), compare: jest.fn() }));

const prisma = require('../src/config/db');
const axios  = require('axios');
const TOKEN  = makeToken({ user_id: 1, login_id: 'testuser' });

const timetableStub = {
  timetable_id: 1, user_id: 1, plan_type: 'A',
  is_selected: false, optimization_score: 100, total_walk_minutes: 10,
  ai_comment: null, created_at: new Date().toISOString(),
  timetable_courses: [{
    courses: {
      course_id: 1, course_name: '알고리즘', credits: 3, professor: '홍길동',
      course_schedules: [{
        day_of_week: '월', start_period: 1, end_period: 2,
        room_name: 'AI관 101', buildings: { building_name: 'AI관' },
      }],
    },
  }],
};

// ─────────────────────────────────────────────────────────────
// 1. 시간표 생성
// ─────────────────────────────────────────────────────────────
describe('POST /api/users/me/timetables', () => {
  const createBody = {
    dept: '컴퓨터공학부', grade: 2, dormitory: 'DORM',
    free_day_mask: 8, avoid_uphill: true, allow_first: false, prefer_online: false,
  };

  beforeEach(() => {
    prisma.carts.findMany.mockResolvedValue([{ course_id: 1 }, { course_id: 2 }]);
    prisma.courses.findMany.mockResolvedValue([{
      course_id: 1, course_code: 'CS101', course_name: '알고리즘',
      classification: '전공필수', credits: 3, course_schedules: [],
    }]);
    prisma.distances.findMany.mockResolvedValue([]);
    axios.post.mockRejectedValue(new Error('FastAPI not connected'));
    prisma.timetables.create
      .mockResolvedValueOnce({ timetable_id: 1, plan_type: 'A' })
      .mockResolvedValueOnce({ timetable_id: 2, plan_type: 'B' })
      .mockResolvedValueOnce({ timetable_id: 3, plan_type: 'C' });
    prisma.timetableCourses.createMany.mockResolvedValue({});
  });

  test('성공 - 201 및 Plan A/B/C 3개 반환', async () => {
    const res = await request(app).post('/api/users/me/timetables').set('Authorization', TOKEN).send(createBody);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.timetables).toHaveLength(3);
    expect(res.body.data.timetables[0].plan_type).toBe('A');
  });

  test('실패 - 토큰 없으면 401', async () => {
    const res = await request(app).post('/api/users/me/timetables').send(createBody);
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
// 2. 시간표 목록 조회
// ─────────────────────────────────────────────────────────────
describe('GET /api/users/me/timetables', () => {
  test('성공 - 200 및 시간표 배열 반환', async () => {
    prisma.timetables.findMany.mockResolvedValue([timetableStub]);
    const res = await request(app).get('/api/users/me/timetables').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].plan_type).toBe('A');
  });

  test('실패 - 토큰 없으면 401', async () => {
    const res = await request(app).get('/api/users/me/timetables');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. AI 코멘트 조회
// ─────────────────────────────────────────────────────────────
describe('GET /api/users/me/timetables/:id/comment', () => {
  test('성공 - 200 및 ai_comment 반환', async () => {
    prisma.timetables.findUnique.mockResolvedValue({
      timetable_id: 1, user_id: 1, plan_type: 'A', ai_comment: '균형 잡힌 시간표입니다.',
    });
    const res = await request(app).get('/api/users/me/timetables/1/comment').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.data.ai_comment).toBe('균형 잡힌 시간표입니다.');
  });

  test('실패 - 존재하지 않는 시간표 404', async () => {
    prisma.timetables.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/api/users/me/timetables/999/comment').set('Authorization', TOKEN);
    expect(res.status).toBe(404);
  });

  test('실패 - 다른 유저의 시간표 403', async () => {
    prisma.timetables.findUnique.mockResolvedValue({ timetable_id: 2, user_id: 99, plan_type: 'B', ai_comment: null });
    const res = await request(app).get('/api/users/me/timetables/2/comment').set('Authorization', TOKEN);
    expect(res.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────
// 4. 시간표 수정
// ─────────────────────────────────────────────────────────────
describe('PUT /api/users/me/timetables/:id', () => {
  test('성공 - 200 및 수정 메시지', async () => {
    prisma.timetables.findUnique.mockResolvedValue({ timetable_id: 1, user_id: 1, timetable_courses: [] });
    prisma.$transaction.mockResolvedValue([]);
    const res = await request(app).put('/api/users/me/timetables/1').set('Authorization', TOKEN).send({ add: [3], remove: [] });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/수정/);
  });

  test('실패 - 시간 충돌 400', async () => {
    prisma.timetables.findUnique.mockResolvedValue({
      timetable_id: 1, user_id: 1,
      timetable_courses: [{ courses: { course_schedules: [{ day_of_week: '월', start_period: 1, end_period: 2 }] } }],
    });
    prisma.courses.findMany.mockResolvedValue([{
      course_name: '충돌강의',
      course_schedules: [{ day_of_week: '월', start_period: 1, end_period: 2 }],
    }]);
    const res = await request(app).put('/api/users/me/timetables/1').set('Authorization', TOKEN).send({ add: [5], remove: [] });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/충돌/);
  });

  test('실패 - 존재하지 않는 시간표 404', async () => {
    prisma.timetables.findUnique.mockResolvedValue(null);
    const res = await request(app).put('/api/users/me/timetables/999').set('Authorization', TOKEN).send({ add: [], remove: [1] });
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────
// 5. 시간표 삭제
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/users/me/timetables/:id', () => {
  test('성공 - 200 및 삭제 메시지', async () => {
    prisma.timetables.findUnique.mockResolvedValue({ timetable_id: 1, user_id: 1 });
    prisma.$transaction.mockResolvedValue([]);
    const res = await request(app).delete('/api/users/me/timetables/1').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/삭제/);
  });

  test('실패 - 존재하지 않는 시간표 404', async () => {
    prisma.timetables.findUnique.mockResolvedValue(null);
    const res = await request(app).delete('/api/users/me/timetables/999').set('Authorization', TOKEN);
    expect(res.status).toBe(404);
  });

  test('실패 - 다른 유저의 시간표 403', async () => {
    prisma.timetables.findUnique.mockResolvedValue({ timetable_id: 1, user_id: 99 });
    const res = await request(app).delete('/api/users/me/timetables/1').set('Authorization', TOKEN);
    expect(res.status).toBe(403);
  });
});
