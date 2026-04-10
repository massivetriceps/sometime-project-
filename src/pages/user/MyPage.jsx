import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { User, Lock, Trash2, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '구라진',
    department: user?.department || '컴퓨터공학과',
    studentId: user?.studentId || '21',
    email: user?.email || 'hong@gachon.ac.kr',
    grade: '3',
  });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawPw, setWithdrawPw] = useState('');
  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 12, border: '1px solid #E8F0FF', padding: '11px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', ...s };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>← 홈으로</Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F7FB', border: '1px solid #E8F0FF', borderRadius: 10, padding: '7px 14px', fontSize: 13, color: '#6B7280', cursor: 'pointer', ...s }}>
              <LogOut size={14} /> 로그아웃
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} color="#4F7CF3" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#1F2937', margin: '0 0 4px' }}>{form.name}</p>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{form.department} · {form.studentId}학번 · {form.grade}학년</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ key: 'profile', label: '개인정보 수정' }, { key: 'password', label: '비밀번호 변경' }, { key: 'withdraw', label: '회원탈퇴' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '8px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: tab === t.key ? 'none' : '1px solid #E8F0FF', background: tab === t.key ? '#4F7CF3' : 'white', color: tab === t.key ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 20 }}>개인정보 수정</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이름</label>
                <input style={inp} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>소속 학과</label>
                  <input style={inp} type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>학번</label>
                  <input style={inp} type="text" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>학년</label>
                  <select style={inp} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                    {['1', '2', '3', '4'].map(g => <option key={g} value={g}>{g}학년</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이메일</label>
                <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <button style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>
                저장하기 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={16} color="#4F7CF3" /> 비밀번호 변경
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: '현재 비밀번호', key: 'current' }, { label: '새 비밀번호', key: 'next' }, { label: '새 비밀번호 확인', key: 'confirm' }].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{f.label}</label>
                  <input style={inp} type="password" placeholder={f.label} value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} />
                </div>
              ))}
              <button style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>
                변경하기 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {tab === 'withdraw' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #fecaca', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={16} /> 회원탈퇴
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 1.6 }}>탈퇴 시 모든 시간표, 장바구니, 졸업요건 데이터가 영구 삭제되며 복구가 불가능합니다.</p>
            {!showWithdraw ? (
              <button onClick={() => setShowWithdraw(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2', padding: '12px 20px', fontSize: 14, fontWeight: 600, color: '#ef4444', cursor: 'pointer', ...s }}>
                <Trash2 size={16} /> 회원탈퇴 신청하기
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>비밀번호를 입력하여 탈퇴를 확인하세요</label>
                  <input style={inp} type="password" placeholder="현재 비밀번호" value={withdrawPw} onChange={e => setWithdrawPw(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowWithdraw(false)} style={{ flex: 1, borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px', fontSize: 14, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>취소</button>
                  <button onClick={() => { logout(); navigate('/'); }} style={{ flex: 1, borderRadius: 12, background: '#ef4444', padding: '12px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>탈퇴 확인</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
