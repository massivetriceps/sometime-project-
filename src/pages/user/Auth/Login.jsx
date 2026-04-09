import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  return (
    // 배경색을 랜딩페이지의 아주 옅은 그레이톤과 일치시킵니다.
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      
      {/* 카드 형태: 곡률을 조금 줄여(rounded-2xl) 랜딩페이지의 카드들과 통일감을 줍니다. */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
        
        {/* 헤더 섹션: 로고를 강조하거나 심플한 텍스트로 처리 */}
        <div className="text-center mb-10 mt-2">
          {/* 로고 '알' 아이콘 삽입 (랜딩페이지 네비게이션바 형태 차용) */}
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">알</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">환영합니다</h1>
          <p className="text-sm text-gray-500 mt-2">알잘딱깔표에 로그인하세요</p>
        </div>

        {/* 폼 섹션 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 인풋창 스타일: 깔끔한 라인과 포커스 시 랜딩페이지 톤에 맞는 짙은 회색 링
              autoComplete="off"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all placeholder-gray-400 text-sm"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all placeholder-gray-400 text-sm"
              required
            />
          </div>

          <div className="flex justify-end pt-1 pb-2">
            <a href="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              비밀번호를 잊어버리셨나요?
            </a>
          </div>

          {/* 메인 로그인 버튼: 랜딩페이지의 '시간표 만들기' 버튼(다크톤)과 완벽히 매치되도록 수정 */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
          >
            이메일로 로그인
          </button>
        </form>

        {/* 하단 구분선 및 SNS 로그인 */}
        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 text-xs">간편 로그인</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {/* 소셜 로그인 버튼들도 너무 튀지 않게 모노톤으로 조정 */}
            <button type="button" className="w-12 h-12 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors">
              <span className="text-lg font-bold text-gray-700">G</span>
            </button>
            <button type="button" className="w-12 h-12 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors">
              <span className="text-lg font-bold text-gray-700">f</span>
            </button>
            <button type="button" className="w-12 h-12 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors pb-1">
              <span className="text-xl font-bold text-gray-700"></span>
            </button>
          </div>

          <p className="text-xs text-gray-500">
  아직 계정이 없으신가요?{' '}
  <Link to="/signup" className="font-semibold text-gray-900 hover:underline">
    계정 생성하기
  </Link>
</p>
        </div>

      </div>
    </div>
  );
}