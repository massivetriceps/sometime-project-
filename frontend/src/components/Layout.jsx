import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import api from '../api/axios';

function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    console.error('로그아웃 실패', err);
  } finally {
    logout();
    navigate('/');
    setOpen(false);
  }
}

return (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8F0FF] font-pretendard"
  style={{ paddingTop: 'env(safe-area-inset-top)' }}>
  <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex justify-between items-center h-16 gap-2">
        
        {/* [왼쪽] 로고 영역: shrink-0으로 모바일 압박에도 크기 고정 */}
        {/* [왼쪽] 메뉴 + 로고 영역: 이미지와 텍스트를 shrink-0으로 보호 */}
<div className="flex items-center gap-1 sm:gap-2 shrink-0">
  <button
    className="p-2 bg-transparent border-none cursor-pointer flex items-center justify-center"
    onClick={() => setOpen(!open)}
  >
    {open ? <X className="w-5 h-5 text-[#1F2937]" /> : <Menu className="w-5 h-5 text-[#1F2937]" />}
  </button>
  
  <Link to="/" className="flex items-center gap-1.5 sm:gap-2 no-underline shrink-0">
    {/* 1. 로고 이미지: 경로가 /src/assets/logo.png 인지 꼭 확인하세요! */}
    <img 
      src="/src/assets/sometime-logo.png" 
      alt="Sometime Logo" 
      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" 
    />
    {/* 2. 로고 텍스트 */}
    <span className="font-bold text-lg sm:text-xl text-[#1F2937] whitespace-nowrap">
      Sometime
    </span>
  </Link>
</div>

        {/* [오른쪽] 프로필 및 버튼 영역 */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              {/* 프로필: 모바일에서는 이미지만, sm 이상에서 이름 노출 */}
              <Link to="/mypage" className="flex items-center gap-2 no-underline shrink-0">
                <img
                  src="/src/assets/student-logo.png"
                  alt="프로필"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#E8F0FF]"
                />
              <span className="text-[11px] sm:text-sm font-medium text-[#1F2937] whitespace-nowrap">
                  {user?.name}
                </span>
              </Link>

              {/* 로그아웃 버튼: md 미만에서도 무조건 표시 */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-[#F5F7FB] text-[#6B7280] px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl font-medium text-[11px] sm:text-sm border border-[#E8F0FF] cursor-pointer whitespace-nowrap"
              >
                <LogOut size={14} />
                <span className="hidden xs:block">로그아웃</span>
              </button>
            </>
          ) : (
            /* 로그인 전 */
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/login" className="text-[#1F2937] px-2 py-2 text-xs sm:text-sm font-medium no-underline whitespace-nowrap">
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-[#4F7CF3] text-white px-2.5 py-1.5 sm:px-[18px] sm:py-2 rounded-xl font-semibold text-[11px] sm:text-sm no-underline whitespace-nowrap"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 드롭다운 메뉴 (데스크탑 + 모바일 공통) */}
      <AnimatePresence>
        {open && (
          <>
            {/* 배경 딤처리 */}
<motion.div
  initial={{ x: -280 }}
  animate={{ x: 0 }}
  exit={{ x: -280 }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  className="fixed top-16 left-0 z-50 w-72 h-[calc(100vh-64px)] bg-white border-r border-[#E8F0FF] shadow-xl overflow-y-auto font-pretendard"
>
  <div className="p-4 flex flex-col gap-6 h-full">
    
    {/* 1. 프로필 영역: 로그인 시에만 노출 */}
    {isLoggedIn && (
      <Link 
    to="/mypage" 
    onClick={() => setOpen(false)} // 클릭 시 사이드바 닫힘
    className="flex items-center gap-3 px-3 py-4 bg-[#F9FAFB] rounded-2xl no-underline border border-transparent hover:border-[#E8F0FF] hover:bg-[#F3F7FF] transition-all group"
  >
    <img
      src="/src/assets/student-logo.png"
      alt="프로필"
      className="w-10 h-10 rounded-full object-cover border border-[#E8F0FF] shrink-0"
    />
    <div className="overflow-hidden">
      <p className="text-sm font-bold text-[#1F2937] truncate m-0 group-hover:text-[#4F7CF3]">
        {user?.name}님
      </p>
      <p className="text-xs text-[#6B7280] truncate m-0">
        {user?.department || '컴퓨터공학과'}
      </p>
    </div>
  </Link>
)}

    {/* 2. 공통 메뉴 리스트: 로그인 여부와 상관없이 무조건 노출 */}
    <div className="flex flex-col gap-6">
      {/* Group 1. 서비스 */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-wider px-2 uppercase">서비스</p>
        {[
          { to: '/timetable/setup',  label: '시간표 만들기' },
          { to: '/courses',          label: '강의 검색' },
          { to: '/cart',             label: '장바구니' },
          { to: '/timetable/manage', label: '내 시간표 관리' },
        ].map(item => (
          <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-[#374151] no-underline rounded-xl hover:bg-[#F3F7FF] hover:text-[#4F7CF3] transition-colors">
            {item.label}
          </Link>
        ))}
      </div>

      {/* Group 2. 학업 관리 */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-wider px-2 uppercase">학업 관리</p>
        {[
          { to: '/graduation/history',   label: '수강내역' },
          { to: '/graduation/dashboard', label: '졸업요건 대시보드' },
        ].map(item => (
          <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-[#374151] no-underline rounded-xl hover:bg-[#F3F7FF] hover:text-[#4F7CF3] transition-colors">
            {item.label}
          </Link>
        ))}
      </div>

      {/* Group 3. 운영지원 */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-wider px-2 uppercase">운영지원</p>
        {[
          { to: '/notice', label: '공지사항' },
          { to: '/faq',    label: 'FAQ' },
        ].map(item => (
          <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-[#374151] no-underline rounded-xl hover:bg-[#F3F7FF] hover:text-[#4F7CF3] transition-colors">
            {item.label}
          </Link>
        ))}
      </div>
    </div>

    {/* 3. 하단 버튼 영역: 로그인 상태에 따라 교체 */}
    <div className="mt-auto pt-4 border-t border-[#F3F4F6]">
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm text-[#EF4444] bg-white border border-[#FFE4E4] rounded-2xl font-bold cursor-pointer hover:bg-[#FFF5F5] transition-colors"
        >
          <LogOut size={16} /> 로그아웃
        </button>
      ) : (
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className="w-full flex items-center justify-center py-4 text-sm text-[#4F7CF3] bg-white border border-[#E8F0FF] rounded-2xl font-bold no-underline hover:bg-[#F3F7FF] transition-colors"
        >
          로그인
        </Link>
      )}
    </div>
  </div>
</motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    <main 
  className="pt-16"
  style={{ paddingTop: 'calc(64px + env(safe-area-inset-top))' }}>
        {children || <Outlet />}
      </main>
    </div>
  );
}