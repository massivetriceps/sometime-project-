const express = require('express');
const router = express.Router();
const { handleRegister, handleLogin, handleLogout, handleFindId, handleResetPassword } = require('./auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 API (회원가입, 로그인, 계정 찾기)
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
 *               login_id:   { type: string,  example: "gachon123" }
 *               password:   { type: string,  example: "password1234!" }
 *               name:       { type: string,  example: "홍길동" }
 *               grade:      { type: integer, example: 2 }
 *               student_id: { type: string,  example: "202112345" }
 *               major_id:   { type: integer, example: 1 }
 *               email:      { type: string,  example: "hong@gachon.ac.kr" }
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType: { type: string, example: "SUCCESS" }
 *                 error:      { type: object, nullable: true, example: null }
 *                 success:
 *                   type: object
 *                   properties:
 *                     user_id: { type: integer, example: 1 }
 *                     message: { type: string,  example: "회원가입이 완료되었습니다." }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post('/register', handleRegister);

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
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType: { type: string, example: "SUCCESS" }
 *                 error:      { type: object, nullable: true, example: null }
 *                 success:
 *                   type: object
 *                   properties:
 *                     access_token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/login', handleLogin);

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
 *         description: 로그아웃 성공 (클라이언트에서 토큰 삭제 필요)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/logout', handleLogout);

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
 *         description: 마스킹된 아이디 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType: { type: string, example: "SUCCESS" }
 *                 error:      { type: object, nullable: true, example: null }
 *                 success:
 *                   type: object
 *                   properties:
 *                     login_id: { type: string, example: "gac******" }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/findid', handleFindId);

/**
 * @swagger
 * /api/auth/findpw:
 *   post:
 *     summary: 비밀번호 재설정 (이메일로 임시 비밀번호 발송)
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
 *         description: 임시 비밀번호 이메일 발송 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/findpw', handleResetPassword);

module.exports = router;
