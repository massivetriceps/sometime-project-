import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    console.log('Signup attempt with:', formData);
    // TODO: 실제 회원가입 API 연동
  };

  // 공통으로 사용할 인풋 스타일 (로그인 페이지와 동일)
  const inputClassName = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all placeholder-gray-400 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
        
        {/* 헤더 */}
        <div className="text-center mb-8 mt-2">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">알</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">계정 생성하기</h1>
          <p className="text-sm text-gray-500 mt-2">알잘딱깔표의 멤버가 되어보세요</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="이름 (실명)"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="studentId"
              placeholder="학번 (예: 21XXXXXX)"
              value={formData.studentId}
              onChange={handleChange}
              autoComplete="off"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="학교 이메일 또는 자주 쓰는 이메일"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (8자 이상)"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={inputClassName}
              required
              minLength={8}
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className={inputClassName}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            >
              가입하기
            </button>
          </div>
        </form>

        {/* 하단 로그인 이동 링크 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            {/* a 태그 대신 React Router의 Link 사용 */}
            <Link to="/login" className="font-semibold text-gray-900 hover:underline">
              로그인
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}