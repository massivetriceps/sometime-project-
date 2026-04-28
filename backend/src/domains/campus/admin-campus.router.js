const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');
const { handleUpdateDistances } = require('./admin-campus.controller');

/**
 * @swagger
 * /api/admin/campus/distance:
 *   put:
 *     summary: 동선 데이터 갱신 (관리자)
 *     description: 캠퍼스 건물 간 이동 시간 및 오르막 여부를 일괄 추가하거나 업데이트합니다.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [distances]
 *             properties:
 *               distances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     from_building_id:
 *                       type: integer
 *                       example: 1
 *                       description: "출발 건물 ID"
 *                     to_building_id:
 *                       type: integer
 *                       example: 2
 *                       description: "도착 건물 ID"
 *                     time_minutes:
 *                       type: integer
 *                       example: 10
 *                       description: "이동 소요 시간(분)"
 *                     is_uphill:
 *                       type: boolean
 *                       example: true
 *                       description: "오르막 여부"
 *     responses:
 *       200:
 *         description: 갱신 성공
 */
router.put('/distance', adminMiddleware, handleUpdateDistances);

module.exports = router;