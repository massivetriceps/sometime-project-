const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API (회원가입, 로그인, 로그아웃, 계정 찾기)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login_id, password, name, grade, student_id, major_id, email]
 *             properties:
 *               login_id:   { type: string, example: "gachon123" }
 *               password:   { type: string, example: "password1234!" }
 *               name:       { type: string, example: "홍길동" }
 *               grade:      { type: integer, example: 2 }
 *               student_id: { type: string, example: "202112345" }
 *               major_id:   { type: integer, example: 1 }
 *               email:      { type: string, example: "hong@gachon.ac.kr" }
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 입력값 오류 또는 중복
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login_id, password]
 *             properties:
 *               login_id: { type: string, example: "gachon123" }
 *               password: { type: string, example: "password1234!" }
 *     responses:
 *       200:
 *         description: 로그인 성공 (JWT 토큰 반환)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *       401:
 *         description: 아이디 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: 인증 토큰 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/findid:
 *   post:
 *     summary: 아이디 찾기
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:  { type: string, example: "홍길동" }
 *               email: { type: string, example: "hong@gachon.ac.kr" }
 *     responses:
 *       200:
 *         description: 아이디 찾기 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: 일치하는 사용자 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/findid', authController.findId);

/**
 * @swagger
 * /api/auth/findpw:
 *   post:
 *     summary: 비밀번호 재설정
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login_id, email]
 *             properties:
 *               login_id: { type: string, example: "gachon123" }
 *               email:    { type: string, example: "hong@gachon.ac.kr" }
 *     responses:
 *       200:
 *         description: 임시 비밀번호 이메일 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: 일치하는 사용자 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/findpw', authController.resetPassword);

module.exports = router;