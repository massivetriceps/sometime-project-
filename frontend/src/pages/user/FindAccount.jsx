import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Lock } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import api from '../../api/axios';

export default function FindAccount() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('id');
  const [form, setForm] = useState({ name: '', email: '' });
  const [done, setDone] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 font-pretendard">
      <div className="w-full max-w-[440px]">

        {/* 상단 로고 및 타이틀 */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5 no-underline">
            <GachonLogo size={38} />
            <span className="text-[22px] font-bold text-slate-800">Sometime</span>
          </Link>
          <h1 className="text-[22px] font-bold text-slate-800 mb-1.5">아이디 / 비밀번호 찾기</h1>
          <p className="text-sm text-slate-500">가입 시 입력한 정보로 계정을 찾을 수 있어요</p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">

          {/* 탭 */}
          <div className="flex gap-2 mb-5">
            {[{ key: 'id', label: '아이디 찾기' }, { key: 'pw', label: '비밀번호 찾기' }].map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => { setTab(t.key); setDone(false); setError(''); setResult(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {!done ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                setLoading(true);
                try {
                  if (tab === 'id') {
                    const res = await api.post('/api/auth/findid', {
                      name: form.name,
                      email: form.email,
                    });
                    if (res.data.resultType === 'SUCCESS') {
                      setResult(res.data.success.login_id);
                      setDone(true);
                    }
                  } else {
                    const res = await api.post('/api/auth/findpw', {
                      name: form.name,
                      email: form.email,
                    });
                    if (res.data.resultType === 'SUCCESS') {
                      setDone(true);
                    }
                  }
                } catch (err) {
                  const reason = err.response?.data?.error?.reason;
                  setError(reason || '오류가 발생했습니다.');
                } finally {
                  setLoading(false);
                }
              }}
              className="flex flex-col gap-3.5"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[13px] text-red-500">
                  {error}
                </div>
              )}

              {tab === 'id' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-800 ml-1">이름</label>
                    <input
                      className={inputClass}
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-800 ml-1">이메일</label>
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="가입한 이메일을 입력하세요"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-800 ml-1">아이디 (이메일)</label>
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="가입한 이메일을 입력하세요"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-800 ml-1">이름</label>
                    <input
                      className={inputClass}
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />처리 중...</>
                ) : (
                  <>{tab === 'id' ? '아이디 찾기' : '인증 메일 발송'} <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {tab === 'id' ? <Mail size={24} className="text-primary" /> : <Lock size={24} className="text-primary" />}
              </div>
              <p className="font-bold text-slate-800 text-base mb-2">
                {tab === 'id' ? '아이디를 찾았어요!' : '인증 메일을 발송했어요!'}
              </p>
              <p className="text-sm text-slate-500 mb-5">
                {tab === 'id' ? `찾은 아이디: ${result}` : '입력한 이메일로 임시 비밀번호를 보냈어요.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
              >
                로그인하러 가기 <ArrowRight size={16} />
              </button>
            </div>
          )}

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-[13px] text-slate-400 hover:text-slate-600 no-underline transition-colors"
            >
              <ArrowLeft size={12} /> 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
