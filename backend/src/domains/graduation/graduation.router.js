const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/authMiddleware');
const { handleGetHistory, handleSaveHistory, handleGetDashboard } = require('./graduation.controller');

/**
 * @swagger
 * tags:
 *   name: Graduation
 *   description: 졸업 요건 및 기수강 관리 API
 */

/**
 * @swagger
 * /api/users/me/graduation/history:
 *   post:
 *     summary: 기수강 내역 입력 (일괄 저장)
 *     description: 유저가 지금까지 들었던 모든 강의 내역을 배열 형태로 저장합니다. 기존 내역은 삭제되고 새로 덮어씌워집니다.
 *     tags: [Graduation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courses]
 *             properties:
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [course_code, course_name, classification, credits]
 *                   properties:
 *                     course_code:
 *                       type: string
 *                       example: "CE1004"
 *                     course_name:
 *                       type: string
 *                       example: "자료구조"
 *                     classification:
 *                       type: string
 *                       example: "전필"
 *                     credits:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       200:
 *         description: 저장 성공
 */

router.get('/history', isLoggedIn, handleGetHistory);
router.post('/history', isLoggedIn, handleSaveHistory);


/**
 * @swagger
 * /api/users/me/graduation/dashboard:
 *   get:
 *     summary: 졸업요건 대시보드 조회
 *     tags: [Graduation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/dashboard', isLoggedIn, handleGetDashboard);

module.exports = router;