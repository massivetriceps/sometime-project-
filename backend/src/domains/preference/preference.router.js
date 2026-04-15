const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/authMiddleware');
const { handleSavePreference, handleGetPreference } = require('./preference.controller');

/**
 * @swagger
 * /api/users/me/preferences:
 *   get:
 *     summary: 내 시간표 선호 조건 조회
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *   post:
 *     summary: 내 시간표 선호 조건 저장/수정
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avoid_uphill:
 *                 type: boolean
 *                 example: true
 *               preferred_time:
 *                 type: string
 *                 example: "MORNING"
 *               free_days:
 *                 type: string
 *                 example: "FRI"
 *               credit_intensity:
 *                 type: string
 *                 example: "HARD"
 *               minimize_gaps:
 *                 type: boolean
 *                 example: true
 *               prioritize_required:
 *                 type: boolean
 *                 example: true
 *               prefer_online:
 *                 type: boolean
 *                 example: false
 *               max_classes_per_day:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: 저장 성공
 */
router.get('/', isLoggedIn, handleGetPreference);
router.post('/', isLoggedIn, handleSavePreference);

module.exports = router;