const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/register 엔드포인트 연결 (회원가입)
router.post('/register', authController.register);

// POST /api/auth/login 엔드포인트 연결 (로그인)
router.post('/login', authController.login);

// POST /api/auth/logout 엔드포인트 연결 (로그아웃)
router.post('/logout', authController.logout);

// POST /api/auth/findid 엔드포인트 연결 (아이디 찾기)
router.post('/findid', authController.findId);

// POST /api/auth/findpw 엔드포인트 연결
router.post('/findpw', authController.resetPassword);

module.exports = router;