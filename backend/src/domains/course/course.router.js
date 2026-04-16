const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/authMiddleware');
const isAdmin   = require('../../middlewares/adminMiddleware');
const {
  handleGetCourses,
  handleGetMyCart,
  handleAddToCart,
  handleRemoveFromCart,
  handleUploadCourses,
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
 *         schema: { type: string }
 *         description: 강의명/강의코드/교수명 검색
 *         example: "알고리즘"
 *       - in: query
 *         name: classification
 *         schema: { type: string }
 *         description: 이수구분 필터 (전공필수, 전공선택, 교양 등)
 *         example: "전공필수"
 *     responses:
 *       200:
 *         description: 강의 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType: { type: string, example: "SUCCESS" }
 *                 error:      { type: object, nullable: true, example: null }
 *                 success:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course_id:      { type: integer, example: 1 }
 *                       course_code:    { type: string,  example: "GE1001" }
 *                       course_name:    { type: string,  example: "알고리즘" }
 *                       classification: { type: string,  example: "전공필수" }
 *                       credits:        { type: integer, example: 3 }
 *                       professor:      { type: string,  example: "홍길동" }
 *                       capacity:       { type: integer, example: 40 }
 *                       cart_count:     { type: integer, example: 12 }
 *                       major:          { type: string,  example: "컴퓨터공학부" }
 *                       college:        { type: string,  example: "IT대학" }
 *                       schedules:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             day_of_week:  { type: string,  example: "월" }
 *                             start_period: { type: integer, example: 1 }
 *                             end_period:   { type: integer, example: 2 }
 *                             room_name:    { type: string,  example: "AI관 101" }
 *                             building:     { type: string,  example: "AI관" }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', isLoggedIn, handleGetCourses);

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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.get('/me/cart',  isLoggedIn, handleGetMyCart);
router.post('/me/cart', isLoggedIn, handleAddToCart);

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
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: 장바구니 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/me/cart/:courseId', isLoggedIn, handleRemoveFromCart);

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
 *                     course_code:    { type: string,  example: "GE1001" }
 *                     course_name:    { type: string,  example: "알고리즘" }
 *                     major_id:       { type: integer, example: 1 }
 *                     classification: { type: string,  example: "전공필수" }
 *                     credits:        { type: integer, example: 3 }
 *                     professor:      { type: string,  example: "홍길동" }
 *                     capacity:       { type: integer, example: 40 }
 *     responses:
 *       200:
 *         description: 강의 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType: { type: string, example: "SUCCESS" }
 *                 error:      { type: object, nullable: true, example: null }
 *                 success:
 *                   type: object
 *                   properties:
 *                     created: { type: integer, example: 5 }
 *                     updated: { type: integer, example: 2 }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/upload', isAdmin, handleUploadCourses);

module.exports = router;
