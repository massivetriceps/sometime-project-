const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

/**
 * 테스트용 JWT 토큰 생성
 * @param {object} payload - { user_id, login_id }
 * @returns {string} Bearer 토큰 문자열
 */
const makeToken = (payload = { user_id: 1, login_id: 'testuser' }) =>
  `Bearer ${jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })}`;

/**
 * 테스트용 어드민 JWT 토큰 생성
 * @param {object} payload - { admin_id }
 * @returns {string} Bearer 토큰 문자열
 */
const makeAdminToken = (payload = { admin_id: 1 }) =>
  `Bearer ${jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })}`;

module.exports = { makeToken, makeAdminToken };
