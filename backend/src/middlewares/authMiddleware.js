// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

const authenticateToken = (req, res, next) => {
  // 1. 프론트엔드가 헤더에 가져온 출입증(토큰) 꺼내기
  // 보통 "Bearer eyJhbGciOi..." 형태로 들어옵니다.
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer" 글자 떼고 실제 토큰만 추출

  // 2. 출입증이 아예 없으면 문전박대 (401 Unauthorized)
  if (!token) {
    return res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
  }

  // 3. 출입증 위조/만료 검사
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
    }

    // 4. 검사 통과! 토큰 안에 있던 유저 정보(user_id 등)를 req 객체에 몰래 끼워 넣기
    req.user = user; 
    
    // 5. 다음 직원(Controller)에게 안내!
    next(); 
  });
};

module.exports = authenticateToken;