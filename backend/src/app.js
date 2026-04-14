const express = require('express');
const cors = require('cors');
require('dotenv').config(); // .env 파일의 환경 변수를 불러옵니다.

// 방금 만든 인증 라우터 불러오기
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 8080; // 기본 포트는 8080으로 설정

// --- 공통 미들웨어 세팅 ---
// 1. CORS 허용 (프론트엔드와 통신하기 위해 필수)
app.use(cors()); 

// 2. JSON 파싱 미들웨어 (이게 없으면 req.body 안의 데이터를 읽지 못합니다!)
app.use(express.json()); 

// --- 라우터 연결 ---
app.use('/api/auth', authRoutes); // 인증 관련 주소
app.use('/api/users', userRoutes); // 계정 관리 관련 주소
app.use('/api/admin', adminRoutes); // 관리자 관련 주소

// 기본 접속 테스트용 라우트
app.get('/', (req, res) => {
  res.send('Sometime API Server is running! 🚀');
});

// --- 서버 실행 ---
app.listen(PORT, () => {
  console.log(`✅ 서버가 성공적으로 실행되었습니다! (http://localhost:${PORT})`);
});