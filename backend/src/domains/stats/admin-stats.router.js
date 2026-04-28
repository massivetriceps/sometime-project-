const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');
const { handleGetUsageStats, handleGetPreferenceStats, handleGetErrorLogs } = require('./admin-stats.controller');

/**
 * @swagger
 * tags:
 *   name: Admin Stats
 *   description: 관리자 전용 시스템 통계 API
 */

/**
 * @swagger
 * /api/admin/stats/usage:
 *   get:
 *     summary: 시스템 이용 통계 조회
 *     description: 일일 활성 유저 수, 누적 생성 시간표 수, 일일 API 호출 수를 반환합니다.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "이용 통계 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     daily_active_users:
 *                       type: integer
 *                       example: 1250
 *                     total_timetables:
 *                       type: integer
 *                       example: 5300
 *                     api_call_counts:
 *                       type: integer
 *                       example: 45000
 */
router.get('/usage', adminMiddleware, handleGetUsageStats);

/**
 * @swagger
 * /api/admin/stats/preferences:
 *   get:
 *     summary: 유저 선호 조건 종합 통계 조회
 *     description: 스키마에 정의된 모든 선호도 설정의 비율 및 인기 값을 추출합니다.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "선호 조건 통계 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_preferences_count:
 *                       type: integer
 *                       example: 1200
 *                     ratios:
 *                       type: object
 *                       properties:
 *                         avoid_uphill_ratio:
 *                           type: number
 *                           example: 85.5
 *                         prefer_online_ratio:
 *                           type: number
 *                           example: 42.0
 *                         minimize_gaps_ratio:
 *                           type: number
 *                           example: 78.2
 *                         prioritize_required_ratio:
 *                           type: number
 *                           example: 91.5
 *                     top_choices:
 *                       type: object
 *                       properties:
 *                         top_preferred_time:
 *                           type: string
 *                           example: "AFTERNOON"
 *                         top_free_day:
 *                           type: string
 *                           example: "FRI"
 *                         top_credit_intensity:
 *                           type: string
 *                           example: "NORMAL"
 *                     averages:
 *                       type: object
 *                       properties:
 *                         avg_max_classes_per_day:
 *                           type: number
 *                           example: 3.5
 */
router.get('/preferences', adminMiddleware, handleGetPreferenceStats);

/**
 * @swagger
 * /api/admin/stats/error:
 *   get:
 *     summary: 오류 로그 목록 조회
 *     description: 시스템에서 발생한 서비스 오류 및 예외 로그 내역을 조회합니다. (페이징 지원)
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 조회할 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 한 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 오류 로그 조회 성공
 */
router.get('/error', adminMiddleware, handleGetErrorLogs);

module.exports = router;