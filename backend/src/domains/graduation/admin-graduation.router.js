const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');
const { handleGetRules, handleUpdateRules } = require('./admin-graduation.controller');

/**
 * @swagger
 * /api/admin/graduation/rules:
 *   get:
 *     summary: 전체 졸업요건 조회 (관리자)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/rules', adminMiddleware, handleGetRules);

/**
 * @swagger
 * /api/admin/graduation/rules:
 *   put:
 *     summary: 학과별 졸업요건 갱신 (관리자)
 *     description: 관리자가 특정 학과와 학번의 졸업 필수 요건을 갱신합니다.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [major_id, apply_year, total_credits, major_required, major_elective, basic_liberal]
 *             properties:
 *               major_id:
 *                 type: integer
 *                 example: 101
 *                 description: "학과 ID"
 *               apply_year:
 *                 type: string
 *                 example: "2026"
 *                 description: "적용 학번"
 *               total_credits:
 *                 type: integer
 *                 example: 130
 *                 description: "총 필수 이수 학점"
 *               major_required:
 *                 type: integer
 *                 example: 30
 *                 description: "전필 필수 이수 학점"
 *               major_elective:
 *                 type: integer
 *                 example: 30
 *                 description: "전선 필수 이수 학점"
 *               basic_liberal:
 *                 type: integer
 *                 example: 15
 *                 description: "기초 교양 이수 학점"
 *               convergence_art:
 *                 type: integer
 *                 example: 3
 *                 description: "융합 교양(예술)"
 *               convergence_society:
 *                 type: integer
 *                 example: 3
 *                 description: "융합 교양(사회)"
 *               convergence_nature:
 *                 type: integer
 *                 example: 3
 *                 description: "융합 교양(자연)"
 *               convergence_world:
 *                 type: integer
 *                 example: 3
 *                 description: "융합 교양(세계)"
 *               free_liberal:
 *                 type: integer
 *                 example: 3
 *                 description: "자유 교양"
 *               area_liberal:
 *                 type: integer
 *                 example: 3
 *                 description: "영역 교양"
 *     responses:
 *       200:
 *         description: 갱신 성공
 */
router.put('/rules', adminMiddleware, handleUpdateRules);

module.exports = router;