const authService = require('../services/authService'); 

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

module.exports = {
  withdraw,
};