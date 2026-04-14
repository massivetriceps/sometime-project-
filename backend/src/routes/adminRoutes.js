const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST /api/admin/login 엔드포인트 연결 (관리자 로그인)
router.post('/login', adminController.login);

module.exports = router;