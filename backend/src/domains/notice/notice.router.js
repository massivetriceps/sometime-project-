const express = require('express');
const router = express.Router();
const { handleGetNotices } = require('./notice.controller');

/**
 * @swagger
 * /api/notices:
 *   get:
 *     summary: 공지사항 목록 조회
 *     tags: [Notices]
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/', handleGetNotices);

module.exports = router;