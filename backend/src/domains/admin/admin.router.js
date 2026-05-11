const express = require('express');
const router = express.Router();
const { handleLogin,
    handleLogout,
    handleUpdateInfo,
    handleGetAllUsers,
    handleDeleteUser,
    handleGetMajors,
} = require('./admin.controller');
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

/**
 * @swagger
 * /api/admin/me:
 *   put:
 *     summary: 관리자 정보 수정
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password]
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: "admin1234!"
 *               new_password:
 *                 type: string
 *                 example: "newAdminPass99!"
 *               name:
 *                 type: string
 *                 example: "수정된최고관리자"
 *     responses:
 *       200:
 *         description: 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 관리자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/me', adminMiddleware, handleUpdateInfo);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 전체 사용자 목록 조회 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
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
 *                         total_count:
 *                           type: integer
 *                           example: 10
 *                         users:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               user_id:
 *                                 type: integer
 *                                 example: 1
 *                               login_id:
 *                                 type: string
 *                                 example: "student123"
 *                               name:
 *                                 type: string
 *                                 example: "가천이"
 *                               email:
 *                                 type: string
 *                                 example: "gachon@gachon.ac.kr"
 *                               grade:
 *                                 type: integer
 *                                 example: 4
 *                               student_id:
 *                                 type: string
 *                                 example: "202112345"
 *                               major_id:
 *                                 type: integer
 *                                 example: 2
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 */
router.get('/users', adminMiddleware, handleGetAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: 특정 사용자 계정 삭제 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 사용자의 고유 ID
 *         example: 5
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 관리자 권한 없음
 *       404:
 *         description: 해당 사용자를 찾을 수 없음
 */
router.delete('/users/:userId', adminMiddleware, handleDeleteUser);
router.get('/majors', adminMiddleware, handleGetMajors);

module.exports = router;