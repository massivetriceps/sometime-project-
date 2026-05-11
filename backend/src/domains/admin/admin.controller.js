const { StatusCodes } = require('http-status-codes');
const adminService = require('./admin.service');
const prisma = require('../../config/db.config');

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

// 관리자 정보 수정 컨트롤러
const handleUpdateInfo = async (req, res, next) => {
  try {
    // adminMiddleware가 검증하고 넘겨준 admin 객체에서 id를 꺼냅니다.
    const adminId = req.admin.admin_id; 
    const { current_password, new_password, name } = req.body;
    
    const updateData = { new_password, name };
    
    const result = await adminService.updateAdminInfo(adminId, current_password, updateData);
    
    // 팀장님 스타일 응답
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 전체 사용자 목록 조회 컨트롤러
const handleGetAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers();
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 사용자 삭제 컨트롤러
const handleDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await adminService.deleteUserByAdmin(userId);
    
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const handleGetMajors = async (req, res, next) => {
  try {
    const majors = await prisma.majors.findMany({
      select: { major_id: true, major_name: true, college_name: true },
      orderBy: [{ college_name: 'asc' }, { major_name: 'asc' }],
    });
    res.status(StatusCodes.OK).success(majors);
  } catch (error) { next(error); }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleUpdateInfo,
  handleGetAllUsers,
  handleDeleteUser,
  handleGetMajors,
};