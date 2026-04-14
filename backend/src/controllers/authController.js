const authService = require('../services/authService');

// 회원가입 컨트롤러
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

// 로그인 컨트롤러 
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

// 로그아웃 컨트롤러
const logout = async (req, res) => {
  try {
    // 현재는 프론트엔드에서 토큰을 삭제하도록 유도하는 성공 메시지만 반환
    return res.status(200).json({ 
      message: "로그아웃이 성공적으로 완료되었습니다. (클라이언트에서 토큰을 삭제해주세요.)" 
    });
  } catch (error) {
    return res.status(500).json({ message: "로그아웃 처리 중 오류가 발생했습니다." });
  }
};

// 아이디 찾기 컨트롤러
const findId = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. 필수값 확인
    if (!name || !email) {
      return res.status(400).json({ message: '이름과 이메일을 모두 입력해주세요.' });
    }

    // 2. 주방(Service)에 아이디 찾기 요청
    const result = await authService.findLoginId(name, email);

    // 3. 성공 시 마스킹된 아이디 반환
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

// 비밀번호 초기화 (임시 비밀번호 발송) 컨트롤러
const resetPassword = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: '이름과 이메일을 모두 입력해주세요.' });
    }

    const result = await authService.resetPassword(name, email);
    return res.status(200).json(result);

  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  findId,
  resetPassword,
};