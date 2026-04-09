import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../../components/ui/GachonLogo';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', studentId: '' });

  const handleSubmit = (e) => { e.preventDefault(); navigate('/Login'); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <GachonLogo size={40} />
            <span className="text-2xl font-bold text-[#1F2937]">Sometime</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">회원가입</h1>
          <p className="text-[#6B7280] text-sm">Sometime과 함께 스마트한 시간표를 만들어보세요</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1F2937]">이름</label>
              <input type="text" placeholder="이름을 입력하세요" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-[#E8F0FF] px-4 py-3 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all" />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium text-[#1F2937]">학과</label>
                <input type="text" placeholder="컴퓨터공학과" value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="rounded-xl border border-[#E8F0FF] px-4 py-3 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all" />
              </div>
              <div className="flex flex-col gap-2 w-28">
                <label className="text-sm font-medium text-[#1F2937]">학번</label>
                <input type="text" placeholder="21학번" value={form.studentId}
                  onChange={e => setForm({ ...form, studentId: e.target.value })}
                  className="rounded-xl border border-[#E8F0FF] px-4 py-3 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all" />
              </div>
            </div>
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
            <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#4F7CF3] py-3 text-sm font-semibold text-white hover:bg-[#3a6ce0] transition-all shadow-sm">
              회원가입 <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            이미 계정이 있으신가요?{' '}
            <Link to="/Login" className="text-[#4F7CF3] font-semibold hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
