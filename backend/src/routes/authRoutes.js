const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register 엔드포인트 연결 (회원가입)
router.post('/register', authController.register);

// POST /api/auth/login 엔드포인트 연결 (로그인)
router.post('/login', authController.login);

module.exports = router;