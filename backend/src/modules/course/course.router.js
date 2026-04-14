const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const adminMiddleware = require('../../middlewares/adminMiddleware');
const {
  getCourses, getMyCart, addToCart, removeFromCart, uploadCourses
} = require('./course.controller');

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: 강의 조회 API
 *   - name: Cart
 *     description: 장바구니 API
 *   - name: Admin
 *     description: 관리자 전용 API
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: 강의 목록 조회
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 강의명, 강의코드, 교수명으로 검색
 *         example: "알고리즘"
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *         description: 이수구분 필터 (전공필수, 전공선택, 교양 등)
 *         example: "전공필수"
 *     responses:
 *       200:
 *         description: 강의 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           course_id:      { type: integer, example: 1 }
 *                           course_code:    { type: string, example: "GE1001" }
 *                           course_name:    { type: string, example: "알고리즘" }
 *                           classification: { type: string, example: "전공필수" }
 *                           credits:        { type: integer, example: 3 }
 *                           professor:      { type: string, example: "홍길동" }
 *                           capacity:       { type: integer, example: 40 }
 *                           cart_count:     { type: integer, example: 12 }
 *                           major:          { type: string, example: "컴퓨터공학부" }
 *                           college:        { type: string, example: "IT대학" }
 *                           schedules:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 day_of_week:  { type: string, example: "월" }
 *                                 start_period: { type: integer, example: 1 }
 *                                 end_period:   { type: integer, example: 2 }
 *                                 room_name:    { type: string, example: "AI관 101" }
 *                                 building:     { type: string, example: "AI관" }
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/',                        authMiddleware,  getCourses);

/**
 * @swagger
 * /api/users/me/cart:
 *   get:
 *     summary: 내 장바구니 조회
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           course_id:      { type: integer, example: 1 }
 *                           course_code:    { type: string, example: "GE1001" }
 *                           course_name:    { type: string, example: "알고리즘" }
 *                           classification: { type: string, example: "전공필수" }
 *                           credits:        { type: integer, example: 3 }
 *                           professor:      { type: string, example: "홍길동" }
 *                           added_at:       { type: string, format: date-time }
 *                           schedules:
 *                             type: array
 *                             items:
 *                               type: object
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: 장바구니 담기
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course_id]
 *             properties:
 *               course_id: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: 장바구니 담기 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: 존재하지 않는 강의
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 이미 장바구니에 있는 강의
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me/cart',                 authMiddleware,  getMyCart);
router.post('/me/cart',                authMiddleware,  addToCart);

/**
 * @swagger
 * /api/users/me/cart/{courseId}:
 *   delete:
 *     summary: 장바구니 취소
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 강의 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 장바구니 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: 장바구니에 없는 강의
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/me/cart/:courseId',    authMiddleware,  removeFromCart);

/**
 * @swagger
 * /api/admin/courses/upload:
 *   post:
 *     summary: 강의 일괄 업로드 (관리자 전용)
 *     tags: [Admin]
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
 *                   required: [course_code, course_name, major_id, classification, credits]
 *                   properties:
 *                     course_code:    { type: string, example: "GE1001" }
 *                     course_name:    { type: string, example: "알고리즘" }
 *                     major_id:       { type: integer, example: 1 }
 *                     classification: { type: string, example: "전공필수" }
 *                     credits:        { type: integer, example: 3 }
 *                     professor:      { type: string, example: "홍길동" }
 *                     capacity:       { type: integer, example: 40 }
 *     responses:
 *       200:
 *         description: 강의 업로드 성공
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
 *                         created: { type: integer, example: 5 }
 *                         updated: { type: integer, example: 2 }
 *       400:
 *         description: courses 배열 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 관리자 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 관리자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload',                 adminMiddleware, uploadCourses);

module.exports = router;
