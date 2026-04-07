const authService = require('../services/authService');

// ✅ [추가됨] 회원가입 컨트롤러
const register = async (req, res) => {
  try {
    // 1. 프론트엔드가 보낸 Body에서 데이터 꺼내기
    const { login_id, password, name, grade, student_id, major_id, email } = req.body;

    // 2. 필수 데이터 누락 확인 방어 로직 (400 에러)
    if (!login_id || !password || !name || !grade || !student_id || !major_id || !email) {
      return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    // 3. 주방(Service)에 회원가입 로직 실행 요청
    const result = await authService.registerUser(req.body);

    // 4. 성공 시 프론트엔드에 응답 (Status 201: Created)
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

// 기존 로그인 컨트롤러 (이전과 동일)
const login = async (req, res) => {
  try {
    const { login_id, password } = req.body;
    if (!login_id || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }
    const result = await authService.loginUser(login_id, password);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};