const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');
const { handleCreateNotice, handleUpdateNotice, handleDeleteNotice } = require('./notice.controller');

/**
 * @swagger
 * tags:
 *   name: Admin Notices
 *   description: 관리자 전용 공지사항 API
 */

/**
 * @swagger
 * /api/admin/notices:
 *   post:
 *     summary: 공지사항 등록
 *     tags: [Admin Notices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "수강신청 안내"
 *               content:
 *                 type: string
 *                 example: "수강신청 기간은..."
 *               attachment_url:
 *                 type: string
 *                 example: "https://gachon.ac.kr/files/..."
 *     responses:
 *       200:
 *         description: 등록 성공
 */
router.post('/', adminMiddleware, handleCreateNotice);

/**
 * @swagger
 * /api/admin/notices/{noticeId}:
 *   put:
 *     summary: 공지사항 수정
 *     tags: [Admin Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 공지사항의 고유 ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "시스템 점검 안내 (시간 변경)"
 *               content:
 *                 type: string
 *                 example: "내일 새벽 3시부터..."
 *               attachment_url:
 *                 type: string
 *                 example: null
 *     responses:
 *       200:
 *         description: 수정 성공
 *   delete:
 *     summary: 공지사항 삭제
 *     tags: [Admin Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 공지사항의 고유 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
router.put('/:noticeId', adminMiddleware, handleUpdateNotice);
router.delete('/:noticeId', adminMiddleware, handleDeleteNotice);

module.exports = router;