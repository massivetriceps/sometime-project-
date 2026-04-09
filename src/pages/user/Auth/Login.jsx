import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../../components/ui/GachonLogo';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e) => { e.preventDefault(); navigate('/'); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <GachonLogo size={40} />
            <span className="text-2xl font-bold text-[#1F2937]">Sometime</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">로그인</h1>
          <p className="text-[#6B7280] text-sm">계정에 로그인하여 시간표를 만들어보세요</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1F2937]">이메일</label>
              <input type="email" placeholder="이메일을 입력하세요" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-[#E8F0FF] px-4 py-3 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1F2937]">비밀번호</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="비밀번호를 입력하세요" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-[#E8F0FF] px-4 py-3 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#6B7280] cursor-pointer">
                <input type="checkbox" className="rounded" /> 로그인 상태 유지
              </label>
              <span className="text-[#4F7CF3] hover:underline cursor-pointer">비밀번호 찾기</span>
            </div>
            <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#4F7CF3] py-3 text-sm font-semibold text-white hover:bg-[#3a6ce0] transition-all shadow-sm">
              로그인 <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            계정이 없으신가요?{' '}
            <Link to="/Signup" className="text-[#4F7CF3] font-semibold hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
