import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import useAuthStore from '../../store/authStore'; // ✅ 변경
import api from '../../api/axios';


export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // ✅ 변경
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.email || !form.password) {
    setError('이메일과 비밀번호를 모두 입력해주세요.');
    return;
  }

  try {
    const res = await api.post('/api/auth/login', {
      login_id: form.email,
      password: form.password,
    });

    if (res.data.resultType === 'SUCCESS') {
      const token = res.data.success.access_token;
      login({ email: form.email }, token);
      navigate('/');
    }
  } catch (err) {
    const reason = err.response?.data?.error?.reason;
    setError(reason || '로그인 중 오류가 발생했습니다.');
  }
};
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 font-pretendard">
      <div className="w-full max-w-[440px]">
        {/* 상단 로고 및 타이틀 */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5 no-underline">
            <GachonLogo size={40} />
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Sometime</span>
          </Link>
          <h1 className="text-[22px] font-bold text-slate-800 mb-1.5">로그인</h1>
          <p className="text-sm text-slate-500">계정에 로그인하여 서비스를 이용하세요</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[13px] text-red-500">
                {error}
              </div>
            )}

            {/* 이메일 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-800 ml-1">이메일</label>
              <input 
                type="email" 
                placeholder="이메일을 입력하세요" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-800 ml-1">비밀번호</label>
              <div className="relative">
                <input 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="비밀번호를 입력하세요" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 옵션 링크 */}
            <div className="flex justify-between items-center text-[13px] mt-1">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /> 
                로그인 상태 유지
              </label>
              <Link to="/find-account" className="text-primary font-medium hover:underline">아이디/비밀번호 찾기</Link>
            </div>

            {/* 로그인 버튼 */}
            <button 
              type="submit" 
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              로그인 <ArrowRight size={16} />
            </button>
          </form>

          {/* 하단 회원가입 유도 */}
          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-[13px] text-slate-500 mb-2.5">계정이 없으신가요?</p>
            <Link 
              to="/signup" 
              className="block w-full py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50/50 hover:bg-slate-100 transition-colors no-underline"
            >
              회원가입
            </Link>
          </div>
        </div>

        {/* 하단 링크 */}
        <p className="text-center mt-5 text-[13px]">
          <Link to="/" className="text-slate-400 hover:text-slate-600 no-underline transition-colors">
            ← 홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}