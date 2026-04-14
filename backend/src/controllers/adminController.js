const adminService = require('../services/adminService');

const login = async (req, res) => {
  try {
    const { login_id, password } = req.body;

    // 빈칸 검사
    if (!login_id || !password) {
      return res.status(400).json({ message: '관리자 아이디와 비밀번호를 모두 입력해주세요.' });
    }

    const result = await adminService.loginAdmin(login_id, password);
    
    return res.status(200).json(result);

  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  login,
};