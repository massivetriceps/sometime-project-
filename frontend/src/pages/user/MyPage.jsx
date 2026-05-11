import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { Lock, Trash2, ArrowRight, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

export default function MyPage() {
 const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);
const updateUser = useAuthStore((state) => state.updateUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    majorId: String(user?.major_id || ''),
    studentId: user?.student_id || '',
    email: user?.email || '',
    grade: String(user?.grade || '1'),
    currentPassword: '',
  });
  const [majors, setMajors] = useState([]);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawPw, setWithdrawPw] = useState('');

  useEffect(() => {
    api.get('/api/auth/majors').then(r => {
      if (r.data.resultType === 'SUCCESS') setMajors(r.data.success);
    }).catch(() => {});
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 font-pretendard">
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 프로필 요약 카드 */}
        <div className="flex items-center gap-4 mb-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
            {/* 실제 이미지가 있다면 img 태그 사용, 아니면 이름 첫 글자 대체 가능 */}
            <img src="/src/assets/student-logo.png" alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-0.5">{form.name}</h3>
            <p className="text-sm text-slate-500">
              {form.department} · {form.studentId.slice(2, 4)}학번 · {form.grade}학년
            </p>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'profile', label: '개인정보 수정' },
            { key: 'password', label: '비밀번호 변경' },
            { key: 'withdraw', label: '회원탈퇴' }
          ].map(t => (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 컨텐츠 영역 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          
          {/* 1. 개인정보 수정 */}
          {tab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">개인정보 수정</h2>
              <div className="grid gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">이름</label>
                  <input 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 ml-1">소속 학과</label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                      value={form.majorId}
                      onChange={e => setForm({ ...form, majorId: e.target.value })}
                    >
                      {majors.map(m => (
                        <option key={m.major_id} value={m.major_id}>{m.major_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 ml-1">학번</label>
                    <input 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      type="text" value={form.studentId} maxLength={9} onChange={e => setForm({ ...form, studentId: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 ml-1">학년</label>
                    <select 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                      value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
                    >
                      {['1', '2', '3', '4'].map(g => <option key={g} value={g}>{g}학년</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">이메일</label>
                  <input 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
  <label className="text-xs font-semibold text-slate-600 ml-1">현재 비밀번호 확인</label>
  <input
    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    type="password"
    placeholder="정보 수정을 위해 현재 비밀번호를 입력하세요"
    value={form.currentPassword}
    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
  />
</div>

                <button 
  onClick={async () => {
    try {
      await api.put('/api/users/me', {
        current_password: form.currentPassword,
        email: form.email,
        grade: Number(form.grade),
        student_id: form.studentId,
        major_id: Number(form.majorId),
      });
      // 저장 후 최신 유저 정보 다시 불러와서 store + 폼 갱신
      const res = await api.get('/api/users/me');
      if (res.data.resultType === 'SUCCESS') {
        const updated = res.data.success;
        updateUser(updated);
        setForm(f => ({
          ...f,
          name: updated.name || f.name,
          majorId: String(updated.major_id || f.majorId),
          studentId: updated.student_id || f.studentId,
          email: updated.email || f.email,
          grade: String(updated.grade || f.grade),
          currentPassword: '',
        }));
      }
      alert('저장되었습니다!');
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      alert(reason || '저장 중 오류가 발생했습니다.');
    }
  }}
  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
>
  저장하기 <ArrowRight size={16} />
</button>
              </div>
            </div>
          )}

          {/* 2. 비밀번호 변경 */}
          {tab === 'password' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-primary" /> 비밀번호 변경
              </h2>
              <div className="grid gap-5">
                {[
                  { label: '현재 비밀번호', key: 'current' }, 
                  { label: '새 비밀번호', key: 'next' }, 
                  { label: '새 비밀번호 확인', key: 'confirm' }
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 ml-1">{f.label}</label>
                    <input 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      type="password" placeholder={f.label} 
                      value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} 
                    />
                  </div>
                ))}
             <button 
  onClick={async () => {
    if (pwForm.next !== pwForm.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await api.put('/api/users/me', {
        current_password: pwForm.current,
        new_password: pwForm.next,
      });
      alert('비밀번호가 변경되었습니다!');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      alert(reason || '변경 중 오류가 발생했습니다.');
    }
  }}
  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
>
  변경하기 <ArrowRight size={16} />
</button>
              </div>
            </div>
          )}

          {/* 3. 회원탈퇴 */}
          {tab === 'withdraw' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-red-500 mb-4 flex items-center gap-2">
                <Trash2 size={18} /> 회원탈퇴
              </h2>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-600 leading-relaxed">
                  탈퇴 시 모든 시간표, 장바구니, 졸업요건 데이터가 <strong>영구 삭제</strong>되며 복구가 불가능합니다.
                </p>
              </div>

              {!showWithdraw ? (
                <button 
                  onClick={() => setShowWithdraw(true)} 
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} /> 회원탈퇴 신청하기
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">비밀번호 확인</label>
                    <input 
                      className="w-full rounded-xl border border-red-200 bg-red-50/30 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                      type="password" placeholder="현재 비밀번호를 입력하세요" 
                      value={withdrawPw} onChange={e => setWithdrawPw(e.target.value)} 
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowWithdraw(false)} 
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await api.delete('/api/users/me', {
                            data: { password: withdrawPw },
                          });
                          logout();
                          navigate('/');
                        } catch (err) {
                          const reason = err.response?.data?.error?.reason;
                          alert(reason || '탈퇴 처리 중 오류가 발생했습니다.');
                        }
                      }}
                      className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
                    >
                      탈퇴 확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}