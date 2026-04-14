const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

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
 *     responses:
 *       200:
 *         description: 회원탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: 인증 토큰 없음 또는 만료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/me', authMiddleware, userController.withdraw);

// 나중에 명세서에 있는 PUT /api/users/me (정보 수정) 도 여기에 추가하면 딱 맞습니다!

module.exports = router;