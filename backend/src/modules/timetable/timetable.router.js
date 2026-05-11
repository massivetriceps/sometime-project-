const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {
  createTimetable,
  getTimetables,
  getComment,
  updateTimetable,
  deleteTimetable,
  confirmTimetable,
} = require('./timetable.controller');

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: 시간표 생성 및 관리 API
 */

/**
 * @swagger
 * /api/users/me/timetables:
 *   post:
 *     summary: 시간표 생성
 *     description: |
 *       장바구니 강의 + 선호도 조건을 CSP 엔진에 전달하여
 *       Plan A / B / C 3개의 최적 시간표를 생성합니다.
 *       FastAPI 미연결 시 Mock으로 자동 fallback,
 *       OPENAI_API_KEY 없으면 ai_comment = null로 저장됩니다.
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dept:          { type: string,  example: "컴퓨터공학부" }
 *               grade:         { type: integer, example: 2 }
 *               dormitory:     { type: string,  example: "DORM", description: "DORM | COMMUTE | NEAR" }
 *               free_day_mask: { type: integer, example: 8,     description: "비트마스크 (월=1 화=2 수=4 목=8 금=16)" }
 *               avoid_uphill:  { type: boolean, example: true }
 *               allow_first:   { type: boolean, example: false, description: "1교시 수업 허용 여부" }
 *               prefer_online: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: 시간표 생성 성공 (Plan A/B/C)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: "시간표 생성 성공" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     timetables:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           timetable_id: { type: integer, example: 1 }
 *                           plan_type:    { type: string,  example: "A" }
 *                           score:        { type: number,  example: 100 }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: 시간표 목록 조회
 *     description: 로그인한 사용자의 저장된 시간표 후보군(Plan A/B/C)을 모두 조회합니다.
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 시간표 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: "시간표 조회 성공" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timetable_id:       { type: integer, example: 1 }
 *                       plan_type:          { type: string,  example: "A" }
 *                       is_selected:        { type: boolean, example: false }
 *                       optimization_score: { type: number,  example: 100 }
 *                       total_walk_minutes: { type: integer, example: 12 }
 *                       created_at:         { type: string,  format: date-time }
 *                       courses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             course_id:   { type: integer, example: 1 }
 *                             course_name: { type: string,  example: "알고리즘" }
 *                             credits:     { type: integer, example: 3 }
 *                             professor:   { type: string,  example: "홍길동" }
 *                             schedules:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   day_of_week:  { type: string,  example: "월" }
 *                                   start_period: { type: integer, example: 1 }
 *                                   end_period:   { type: integer, example: 2 }
 *                                   room_name:    { type: string,  example: "AI관 101" }
 *                                   building:     { type: string,  example: "AI관" }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', authMiddleware, createTimetable);
router.get('/',  authMiddleware, getTimetables);

/**
 * @swagger
 * /api/users/me/timetables/{timetable_id}/comment:
 *   get:
 *     summary: AI 코멘트 조회
 *     description: 특정 시간표에 대한 AI(LLM) 맞춤형 분석 코멘트를 조회합니다. 생성 시 저장된 값을 반환합니다.
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timetable_id
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: AI 코멘트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: "AI 코멘트 조회 성공" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     timetable_id: { type: integer, example: 1 }
 *                     plan_type:    { type: string,  example: "A" }
 *                     ai_comment:   { type: string,  nullable: true, example: "전공필수 3과목이 모두 포함되어 있으며 목요일에 공강이 확보된 균형 잡힌 시간표입니다." }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:timetable_id/comment', authMiddleware, getComment);

/**
 * @swagger
 * /api/users/me/timetables/{timetable_id}:
 *   put:
 *     summary: 시간표 수정
 *     description: |
 *       생성된 시간표에서 강의를 직접 추가하거나 제거합니다.
 *       추가 시 기존 강의와 시간 충돌 여부를 자동으로 검사합니다.
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timetable_id
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               add:
 *                 type: array
 *                 description: 추가할 course_id 목록
 *                 items: { type: integer }
 *                 example: [5, 8]
 *               remove:
 *                 type: array
 *                 description: 제거할 course_id 목록
 *                 items: { type: integer }
 *                 example: [3]
 *     responses:
 *       200:
 *         description: 시간표 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:      { type: boolean, example: true }
 *                 message:      { type: string,  example: "시간표 수정 성공" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     timetable_id: { type: integer, example: 1 }
 *                     message:      { type: string,  example: "시간표가 수정되었습니다." }
 *       400:
 *         description: 시간 충돌 발생
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string,  example: "알고리즘 강의가 기존 시간표와 충돌합니다." }
 *                 data:    { type: object,  nullable: true, example: null }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: 시간표 삭제
 *     description: 특정 시간표 데이터를 삭제합니다. 연결된 TIMETABLE_COURSES도 함께 삭제됩니다.
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timetable_id
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: 시간표 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: "시간표 삭제 성공" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { type: string, example: "시간표가 삭제되었습니다." }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:timetable_id',             authMiddleware, updateTimetable);
router.delete('/:timetable_id',          authMiddleware, deleteTimetable);
router.post('/:timetable_id/confirm',    authMiddleware, confirmTimetable);

module.exports = router;
