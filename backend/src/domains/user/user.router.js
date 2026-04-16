const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/authMiddleware');
const { handleWithdraw, handleUpdateInfo } = require('./user.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 계정 관리 API
 */

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: 회원 정보 수정
 *     tags: [Users]
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
 *                 example: "password1234!"
 *               new_password:
 *                 type: string
 *                 example: "newPassword123!"
 *               email:
 *                 type: string
 *                 example: "new_email@gachon.ac.kr"
 *               grade:
 *                 type: integer
 *                 example: 3
 *               student_id:
 *                 type: string
 *                 example: "202112345"
 *               major_id:
 *                 type: integer
 *                 example: 2
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: 회원탈퇴
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, example: "password1234!" }
 *     responses:
 *       200:
 *         description: 회원탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/me', isLoggedIn, handleUpdateInfo);
router.delete('/me', isLoggedIn, handleWithdraw);

module.exports = router;
