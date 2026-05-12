import { useState } from 'react';
import { UserCog, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';
import useAdminStore from '../../store/adminStore';

const TAB = { NAME: 'name', PASSWORD: 'password' };

export default function AdminProfile() {
  const { admin, setAdmin } = useAdminStore();
  const [tab, setTab] = useState(TAB.NAME);

  const [nameForm, setNameForm]   = useState({ name: admin?.name || '', currentPassword: '' });
  const [pwForm,   setPwForm]     = useState({ current: '', next: '', confirm: '' });

  const [nameSaving, setNameSaving] = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);

  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const [toast, setToast] = useState(null); // { type: 'success' | 'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── 이름 수정 ── */
  const handleNameSave = async () => {
    if (!nameForm.name.trim())            return showToast('error', '새 이름을 입력해주세요.');
    if (!nameForm.currentPassword.trim()) return showToast('error', '현재 비밀번호를 입력해주세요.');
    setNameSaving(true);
    try {
      await adminApi.put('/api/admin/me', {
        name:             nameForm.name.trim(),
        current_password: nameForm.currentPassword,
      });
      setAdmin({ ...admin, name: nameForm.name.trim() });
      setNameForm(f => ({ ...f, currentPassword: '' }));
      showToast('success', '이름이 변경되었습니다.');
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      showToast('error', reason || '변경 중 오류가 발생했습니다.');
    } finally {
      setNameSaving(false);
    }
  };

  /* ── 비밀번호 변경 ── */
  const handlePwSave = async () => {
    if (!pwForm.current.trim()) return showToast('error', '현재 비밀번호를 입력해주세요.');
    if (!pwForm.next.trim())    return showToast('error', '새 비밀번호를 입력해주세요.');
    if (pwForm.next.length < 8) return showToast('error', '새 비밀번호는 8자 이상이어야 합니다.');
    if (pwForm.next !== pwForm.confirm) return showToast('error', '새 비밀번호가 일치하지 않습니다.');
    setPwSaving(true);
    try {
      await adminApi.put('/api/admin/me', {
        current_password: pwForm.current,
        new_password:     pwForm.next,
      });
      setPwForm({ current: '', next: '', confirm: '' });
      showToast('success', '비밀번호가 변경되었습니다.');
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      showToast('error', reason || '변경 중 오류가 발생했습니다.');
    } finally {
      setPwSaving(false);
    }
  };

  const togglePw = (key) => setShowPw(s => ({ ...s, [key]: !s[key] }));

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400';

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">계정 설정</h1>
        <p className="text-xs text-slate-400 mt-0.5">관리자 이름 및 비밀번호를 수정할 수 있습니다.</p>
      </div>

      {/* ── 토스트 ── */}
      {toast && (
        <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-5 text-sm font-medium border ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
            : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={15} className="flex-shrink-0" />
            : <AlertCircle  size={15} className="flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── 현재 관리자 정보 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
          <span className="text-[#4F7CF3] text-lg font-bold">
            {(admin?.name || admin?.username || 'A')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{admin?.name || admin?.username || '관리자'}</p>
          <p className="text-[12px] text-slate-400 mt-0.5">Sometime Admin Console</p>
        </div>
      </div>

      {/* ── 탭 ── */}
      <div className="flex gap-2 mb-5">
        {[
          { key: TAB.NAME,     label: '이름 수정',    icon: UserCog },
          { key: TAB.PASSWORD, label: '비밀번호 변경', icon: Lock    },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === key
                ? 'bg-[#4F7CF3] text-white shadow-lg shadow-[#4F7CF3]/25'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── 이름 수정 탭 ── */}
      {tab === TAB.NAME && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
              <UserCog size={14} className="text-[#4F7CF3]" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">이름 수정</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                새 이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder="변경할 이름을 입력하세요"
                value={nameForm.name}
                onChange={e => setNameForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                현재 비밀번호 확인 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw.current ? 'text' : 'password'}
                  className={`${inputCls} pr-10`}
                  placeholder="현재 비밀번호를 입력하세요"
                  value={nameForm.currentPassword}
                  onChange={e => setNameForm(f => ({ ...f, currentPassword: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                />
                <button
                  type="button"
                  onClick={() => togglePw('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw.current ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleNameSave}
            disabled={nameSaving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nameSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                저장 중...
              </>
            ) : (
              <>이름 변경 <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      )}

      {/* ── 비밀번호 변경 탭 ── */}
      {tab === TAB.PASSWORD && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
              <Lock size={14} className="text-[#4F7CF3]" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">비밀번호 변경</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'current', label: '현재 비밀번호', placeholder: '현재 비밀번호를 입력하세요' },
              { key: 'next',    label: '새 비밀번호',   placeholder: '새 비밀번호 (8자 이상)' },
              { key: 'confirm', label: '새 비밀번호 확인', placeholder: '새 비밀번호를 다시 입력하세요' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  {label} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw[key] ? 'text' : 'password'}
                    className={`${inputCls} pr-10 ${
                      key === 'confirm' && pwForm.confirm && pwForm.next !== pwForm.confirm
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                        : ''
                    }`}
                    placeholder={placeholder}
                    value={pwForm[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handlePwSave()}
                  />
                  <button
                    type="button"
                    onClick={() => togglePw(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {key === 'confirm' && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                  <p className="text-[11px] text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handlePwSave}
            disabled={pwSaving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pwSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                변경 중...
              </>
            ) : (
              <>비밀번호 변경 <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      )}

    </AdminLayout>
  );
}
