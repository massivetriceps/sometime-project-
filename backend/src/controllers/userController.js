const authService = require('../services/authService'); 
const userService = require('../services/userService');
// 회원 탈퇴 컨트롤러
const withdraw = async (req, res) => {
  try {
    const userId = req.user.user_id; // 미들웨어가 찾아준 유저 번호
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: '탈퇴를 위해 현재 비밀번호를 입력해주세요.' });
    }

    const result = await authService.withdrawUser(userId, password);
    return res.status(200).json(result);

  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

// 회원 정보수정 컨트롤러
const updateInfo = async (req, res) => {
  try {
    // 1. 보안 요원(Middleware)이 확인해 준 유저 번호 꺼내기
    const userId = req.user.user_id; 
    
    // 2. 명세서에 적힌 데이터들 꺼내기
    const { current_password, new_password, email, grade, student_id, major_id } = req.body;

    // 3. 필수값(현재 비밀번호) 누락 검사 (명세서의 400 에러 처리)
    if (!current_password) {
      return res.status(400).json({ message: '정보 수정을 위해 현재 비밀번호를 입력해주세요.' });
    }

    // 4. 주방으로 보낼 데이터 바구니 만들기
    const updateData = { new_password, email, grade, student_id, major_id };
    
    // 5. 주방에 요리 지시
    const result = await userService.updateUserInfo(userId, current_password, updateData);
    
    // 6. 성공 결과 서빙 (명세서의 200 OK 처리)
    return res.status(200).json(result);

  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  withdraw,
  updateInfo,
};