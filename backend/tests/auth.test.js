/**
 * 인증 API 테스트
 * POST /api/auth/register      - 회원가입
 * POST /api/auth/login         - 로그인
 * POST /api/auth/logout        - 로그아웃
 * POST /api/auth/findid        - 아이디 찾기
 * POST /api/auth/findpw        - 비밀번호 초기화
 */
const request  = require('supertest');
const app      = require('../src/app');

jest.mock('../src/config/db.config', () => ({
  users: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
}));
jest.mock('bcrypt', () => ({
  hash:    jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn().mockResolvedValue({}) }),
}));

const prisma = require('../src/config/db.config');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────
// 1. 회원가입
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  const validBody = {
    login_id: 'testuser', password: 'Test1234!', name: '홍길동',
    grade: 2, student_id: '202212345', major_id: 1, email: 'test@gachon.ac.kr',
  };

  test('성공 - 201 및 user_id 포함', async () => {
    prisma.users.findFirst.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({ user_id: 1 });

    const res = await request(app).post('/api/auth/register').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.resultType).toBe('SUCCESS');
    expect(res.body.success).toMatchObject({ user_id: 1 });
  });

  test('실패 - 필수 파라미터 누락 400', async () => {
    const { password, ...body } = validBody;
    const res = await request(app).post('/api/auth/register').send(body);
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });

  test('실패 - 중복 아이디/이메일 409', async () => {
    prisma.users.findFirst.mockResolvedValue({ user_id: 99 });
    const res = await request(app).post('/api/auth/register').send(validBody);
    expect(res.status).toBe(409);
    expect(res.body.error.errorCode).toBe('U002');
  });
});

// ─────────────────────────────────────────────────────────────
// 2. 로그인
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  test('성공 - 200 및 access_token 반환', async () => {
    prisma.users.findFirst.mockResolvedValue({ user_id: 1, login_id: 'testuser', password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/auth/login').send({ login_id: 'testuser', password: 'Test1234!' });
    expect(res.status).toBe(200);
    expect(res.body.success).toHaveProperty('access_token');
  });

  test('실패 - 존재하지 않는 아이디 401', async () => {
    prisma.users.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ login_id: 'nobody', password: 'Test1234!' });
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('U003');
  });

  test('실패 - 비밀번호 불일치 401', async () => {
    prisma.users.findFirst.mockResolvedValue({ user_id: 1, login_id: 'testuser', password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app).post('/api/auth/login').send({ login_id: 'testuser', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('U003');
  });

  test('실패 - 필드 누락 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ login_id: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });
});

// ─────────────────────────────────────────────────────────────
// 3. 로그아웃
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/logout', () => {
  test('성공 - 200 및 로그아웃 메시지', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.resultType).toBe('SUCCESS');
    expect(res.body.success.message).toMatch(/로그아웃/);
  });
});

// ─────────────────────────────────────────────────────────────
// 4. 아이디 찾기
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/findid', () => {
  test('성공 - 200 및 마스킹된 아이디 반환', async () => {
    prisma.users.findFirst.mockResolvedValue({ login_id: 'testuser' });
    const res = await request(app).post('/api/auth/findid').send({ name: '홍길동', email: 'test@gachon.ac.kr' });
    expect(res.status).toBe(200);
    expect(res.body.success.login_id).toMatch(/tes\*+/);
  });

  test('실패 - 일치하는 유저 없음 404', async () => {
    prisma.users.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/findid').send({ name: '없는사람', email: 'none@gachon.ac.kr' });
    expect(res.status).toBe(404);
    expect(res.body.error.errorCode).toBe('U001');
  });

  test('실패 - 필드 누락 400', async () => {
    const res = await request(app).post('/api/auth/findid').send({ name: '홍길동' });
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });
});

// ─────────────────────────────────────────────────────────────
// 5. 비밀번호 초기화
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/findpw', () => {
  test('성공 - 200 및 이메일 발송 메시지', async () => {
    prisma.users.findFirst.mockResolvedValue({ user_id: 1, login_id: 'testuser', password: 'hashed_password' });
    prisma.users.update.mockResolvedValue({});
    const res = await request(app).post('/api/auth/findpw').send({ name: '홍길동', email: 'test@gachon.ac.kr' });
    expect(res.status).toBe(200);
    expect(res.body.success.message).toMatch(/임시 비밀번호/);
  });

  test('실패 - 일치하는 유저 없음 404', async () => {
    prisma.users.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/findpw').send({ name: '없는사람', email: 'none@gachon.ac.kr' });
    expect(res.status).toBe(404);
    expect(res.body.error.errorCode).toBe('U001');
  });
});
