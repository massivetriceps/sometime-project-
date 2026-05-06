/**
 * 사용자 API 테스트
 * DELETE /api/users/me - 회원 탈퇴
 */
const request = require('supertest');
const app     = require('../src/app');
const { makeToken } = require('./helpers/token');

jest.mock('../src/config/db.config', () => ({
  users: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
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

describe('DELETE /api/users/me', () => {
  const TOKEN = makeToken({ user_id: 1, login_id: 'testuser' });

  test('성공 - 200 및 탈퇴 메시지', async () => {
    prisma.users.findUnique.mockResolvedValue({ user_id: 1, password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(true);
    prisma.users.delete.mockResolvedValue({});

    const res = await request(app).delete('/api/users/me').set('Authorization', TOKEN).send({ password: 'Test1234!' });
    expect(res.status).toBe(200);
    expect(res.body.resultType).toBe('SUCCESS');
    expect(res.body.success.message).toMatch(/탈퇴/);
  });

  test('실패 - 비밀번호 없이 요청 400', async () => {
    const res = await request(app).delete('/api/users/me').set('Authorization', TOKEN).send({});
    expect(res.status).toBe(400);
    expect(res.body.error.errorCode).toBe('P001');
  });

  test('실패 - 비밀번호 불일치 401', async () => {
    prisma.users.findUnique.mockResolvedValue({ user_id: 1, password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app).delete('/api/users/me').set('Authorization', TOKEN).send({ password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('U003');
  });

  test('실패 - 토큰 없이 요청 401', async () => {
    const res = await request(app).delete('/api/users/me').send({ password: 'Test1234!' });
    expect(res.status).toBe(401);
    expect(res.body.error.errorCode).toBe('T001');
  });

  test('실패 - 존재하지 않는 유저 404', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    const res = await request(app).delete('/api/users/me').set('Authorization', TOKEN).send({ password: 'Test1234!' });
    expect(res.status).toBe(404);
    expect(res.body.error.errorCode).toBe('U001');
  });
});
