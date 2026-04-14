const { StatusCodes } = require('http-status-codes');
const adminService = require('./admin.service');

const handleLogin = async (req, res, next) => {
  try {
    const { login_id, password } = req.body;
    const result = await adminService.loginAdmin(login_id, password);
    
    // index.js에서 주입한 res.success 사용
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    // 글로벌 에러 핸들러로 전달
    next(error);
  }
};

// 관리자 로그아웃
const handleLogout = async (req, res, next) => {
  try {
    // JWT는 서버에 상태가 저장되지 않으므로, 성공 메시지를 보내 클라이언트가 토큰을 삭제하도록 유도합니다.
    res.status(StatusCodes.OK).success({
      message: '관리자 로그아웃이 완료되었습니다. (클라이언트에서 토큰을 삭제해주세요.)',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout
};