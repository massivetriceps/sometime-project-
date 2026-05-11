const { StatusCodes } = require('http-status-codes');
const authService = require('./auth.service');

const handleRegister = async (req, res, next) => {
  try {
    const { login_id, password, name, grade, student_id, major_id, email } = req.body;
    const result = await authService.registerUser({ login_id, password, name, grade, student_id, major_id, email });
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { login_id, password } = req.body;
    const result = await authService.loginUser(login_id, password);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).success({
      message: '로그아웃이 완료되었습니다. (클라이언트에서 토큰을 삭제해주세요.)',
    });
  } catch (error) {
    next(error);
  }
};

const handleFindId = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await authService.findLoginId(name, email);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await authService.resetPassword(name, email);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const prisma = require('../../config/db.config');

const handleGetMajors = async (req, res, next) => {
  try {
    const majors = await prisma.majors.findMany({
      select: { major_id: true, major_name: true, college_name: true },
      orderBy: [{ college_name: 'asc' }, { major_name: 'asc' }],
    });
    res.status(StatusCodes.OK).success(majors);
  } catch (error) { next(error); }
};

module.exports = { handleRegister, handleLogin, handleLogout, handleFindId, handleResetPassword, handleGetMajors };
