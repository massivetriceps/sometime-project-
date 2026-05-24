import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [showPw, setShowPw] = useState(false);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    majorId: '',
    studentId: '',
    grade: '1'
  });
  const [error, setError] = useState('');
  const [majorError, setMajorError] = useState('');

  useEffect(() => {
    api.get('/api/auth/majors').then(r => {
      if (r.data.resultType === 'SUCCESS') {
        setMajors(r.data.success);
        if (r.data.success.length > 0) setForm(f => ({ ...f, majorId: String(r.data.success[0].major_id) }));
      }
    }).catch(() => {
      setMajorError('학과 목록을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 학과 목록 로드 실패 시 0/NaN이 서버로 전송되는 것을 방지 (setLoading 전에 검사)
    if (!form.majorId || majors.length === 0) {
      setError('학과를 선택해주세요. 목록 로드에 실패했다면 페이지를 새로고침해주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/register', {
        login_id: form.email,
        password: form.password,
        name: form.name,
        grade: Number(form.grade),
        student_id: form.studentId,
        major_id: Number(form.majorId),
        email: form.email,
      });

      if (res.data.resultType === 'SUCCESS') {
        try {
          const loginRes = await api.post('/api/auth/login', {
            login_id: form.email,
            password: form.password,
          });

          if (loginRes.data.resultType === 'SUCCESS') {
            const { access_token } = loginRes.data.success;
            login({ email: form.email }, access_token);
            try {
              const userRes = await api.get('/api/users/me');
              if (userRes.data.resultType === 'SUCCESS') updateUser(userRes.data.success);
            } catch {}
          }
        } catch {}
        navigate('/');
      }
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      setError(reason || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 font-pretendard">
      <div className="w-full max-w-[480px]">
        {/* 상단 헤더 */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 no-underline">
            <GachonLogo size={38} />
            <span className="text-[22px] font-bold text-slate-800 tracking-tight">Sometime</span>
          </Link>
          <h1 className="text-[22px] font-bold text-slate-800 mb-1.5">회원가입</h1>
          <p className="text-sm text-slate-500">Sometime과 함께 스마트한 시간표를 만들어보세요</p>
        </div>

        {/* 가입 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            
            {/* 이름 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-700 ml-1">이름</label>
              <input 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                type="text" placeholder="이름을 입력하세요" 
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required 
              />
            </div>

            {/* 학과/학번/학년 그리드 레이아웃 */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_85px] gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-1">소속 학과</label>
                <select
                  className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none ${majorError ? 'border-red-300' : 'border-slate-200'}`}
                  value={form.majorId}
                  onChange={e => setForm(f => ({ ...f, majorId: e.target.value }))}
                  required
                >
                  {majors.map(m => (
                    <option key={m.major_id} value={m.major_id}>{m.major_name}</option>
                  ))}
                </select>
                {majorError && (
                  <p className="text-[12px] text-red-500 ml-1">{majorError}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-1">학번</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  type="text" inputMode="numeric" pattern="[0-9]*" placeholder="학번 9자리" required
                  value={form.studentId} maxLength={9} onChange={e => setForm(f => ({ ...f, studentId: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-1">학년</label>
                <select 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                  value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                >
                  {['1', '2', '3', '4'].map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-700 ml-1">이메일</label>
              <input 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                type="email" placeholder="이메일을 입력하세요" 
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required 
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-700 ml-1">비밀번호</label>
              <div className="relative">
                <input 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  type={showPw ? 'text' : 'password'} placeholder="비밀번호 (8자 이상)" 
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} 
                />
                <button 
                  type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />처리 중...</>
              ) : (
                <>회원가입 <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* 하단 로그인 유도 */}
          <p className="mt-5 text-center text-[13px] text-slate-500">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary font-bold no-underline hover:underline ml-1">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}