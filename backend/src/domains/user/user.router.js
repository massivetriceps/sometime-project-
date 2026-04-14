const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/authMiddleware');
const { handleWithdraw } = require('./user.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 계정 관리 API
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
router.delete('/me', isLoggedIn, handleWithdraw);

module.exports = router;
