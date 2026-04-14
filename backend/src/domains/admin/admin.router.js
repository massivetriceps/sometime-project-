const express = require('express');
const router = express.Router();
const { handleLogin, handleLogout } = require('./admin.controller');
const adminMiddleware = require('../../middlewares/adminMiddleware'); // 관리자 전용 미들웨어

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 전용 API
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: 관리자 로그인
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login_id, password]
 *             properties:
 *               login_id:
 *                 type: string
 *                 example: "admin_master"
 *               password:
 *                 type: string
 *                 example: "admin1234!"
 *     responses:
 *       200:
 *         description: 관리자 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: "SUCCESS"
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUz..."
 *                     message:
 *                       type: string
 *                       example: "관리자 로그인에 성공했습니다."
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/login', handleLogin);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: 관리자 로그아웃
 *     tags: [Admin]
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
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/logout', adminMiddleware, handleLogout);

module.exports = router;