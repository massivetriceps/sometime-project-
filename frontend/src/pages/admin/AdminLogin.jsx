import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import useAdminStore from '../../store/adminStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin, setToken } = useAdminStore();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.username || !form.password) {
    setError('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }
  setLoading(true);
  setError('');

  // ─── 허용된 관리자 계정 목록 ───
  const ADMIN_ACCOUNTS = [
    { username: 'admin',  password: 'admin1234' },
    { username: 'admin2', password: 'admin5678' },
  ];

  const matched = ADMIN_ACCOUNTS.find(
    (a) => a.username === form.username && a.password === form.password
  );

  if (matched) {
    setToken('dev-admin-token');
    setAdmin({ username: form.username });
    navigate('/admin/dashboard');
  } else {
    setError('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-pretendard">

      {/* ── 왼쪽 블루 패널 (md 이상에서만 표시) ── */}
      <div className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#4F7CF3] px-12 py-14">
        {/* 상단 로고 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">Sometime Admin</span>
        </div>

        {/* 중앙 텍스트 */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Shield size={11} />
            관리자 전용 콘솔
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Sometime<br />관리자 콘솔
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            사용자 관리, 강의 데이터, 시간표 알고리즘 설정 등<br />
            서비스 전반을 한 곳에서 관리하세요.
          </p>

          {/* 기능 목록 */}
          <div className="mt-8 space-y-3">
            {[
              '사용자 계정 및 권한 관리',
              '강의 데이터 일괄 업로드',
              'CSP 알고리즘 가중치 조정',
              'AI 프롬프트 관리 및 테스트',
              '실시간 통계 및 로그 조회',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/80 text-[13px]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버전 */}
        <div className="text-white/40 text-xs">
          Sometime Admin Console v1.0 · 가천대학교
        </div>
      </div>

      {/* ── 오른쪽 로그인 폼 ── */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* 모바일 전용 로고 */}
          <div className="md:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 no-underline">
              <GachonLogo size={36} />
              <span className="text-xl font-bold text-slate-800 tracking-tight">Sometime</span>
            </Link>
            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center gap-1.5 bg-[#E8F0FF] text-[#4F7CF3] text-[11px] font-semibold px-3 py-1 rounded-full">
                <Shield size={11} />
                관리자 전용
              </span>
            </div>
          </div>

          {/* 데스크탑 타이틀 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1.5">관리자 로그인</h1>
            <p className="text-sm text-slate-500">인증된 관리자만 접근할 수 있습니다</p>
          </div>

          {/* 로그인 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[13px] text-red-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* 아이디 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-0.5">관리자 아이디</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="아이디를 입력하세요"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-0.5">비밀번호</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-3 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#4F7CF3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    로그인 <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* 구분선 + 사용자 로그인 */}
            <div className="mt-5 pt-5 border-t border-slate-100 text-center">
              <p className="text-[12px] text-slate-400 mb-3">일반 사용자이신가요?</p>
              <Link
                to="/login"
                className="block w-full py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 bg-slate-50/50 hover:bg-slate-100 transition-colors no-underline"
              >
                사용자 로그인으로 이동
              </Link>
            </div>
          </div>

          {/* 홈으로 */}
          <p className="text-center mt-5 text-[12px]">
            <Link to="/" className="text-slate-400 hover:text-slate-600 no-underline transition-colors">
              ← 홈으로 돌아가기
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
