const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController'); 

// DELETE /api/users/me 엔드포인트 연결(회원탈퇴) authMiddleware이 먼저 검사하고 컨트롤러로 보냅니다.
router.delete('/me', authMiddleware, userController.withdraw);
// PUT /api/users/me 정보수정
router.put('/me', authMiddleware, userController.updateInfo);
// 나중에 명세서에 있는 PUT /api/users/me (정보 수정) 도 여기에 추가하면 딱 맞습니다!

module.exports = router;