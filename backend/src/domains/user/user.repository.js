const prisma = require('../../config/db.config');

const findUserById = async (user_id) => {
  return prisma.users.findUnique({ where: { user_id } });
};

const deleteUser = async (user_id) => {
  return prisma.users.delete({ where: { user_id } });
};

const updateUser = async (user_id, data) => {
  return prisma.users.update({ where: { user_id }, data });
};

// 프론트엔드 전달용 안전한 프로필 조회 (비밀번호 제외)
const getUserProfile = async (user_id) => {
  const user = await prisma.users.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      login_id: true,
      name: true,
      email: true,
      grade: true,
      student_id: true,
      major_id: true,
      status: true,          
      is_push_noti: true,    
      is_email_noti: true,   
      is_sms_noti: true,     
      created_at: true
    }
  });

  if (!user) return null;

  // 2. 유저의 major_id를 이용해 Majors 테이블에서 학과 정보를 따로 검색합니다.
  const majorInfo = await prisma.majors.findUnique({
    where: { major_id: user.major_id }
  });

  // 3. 유저 정보와 학과 정보를 합쳐서(조립해서) 반환합니다.
  return {
    ...user,
    // 학과 정보가 있으면 이름을 빼오고, 아직 데이터가 없으면 '미지정'으로 처리합니다.
    college_name: majorInfo ? majorInfo.college_name : "미지정(데이터 준비중)",
    major_name: majorInfo ? majorInfo.major_name : "미지정(데이터 준비중)",
  };
};

module.exports = { findUserById, deleteUser, updateUser, getUserProfile };
