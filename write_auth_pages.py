import os

# ── Login.jsx ──
with open('src/pages/user/Login.jsx', 'w', encoding='utf-8') as f:
    f.write("""import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const s = { fontFamily: 'Pretendard, sans-serif' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    login({ name: '홍길동', email: form.email, department: '컴퓨터공학과', studentId: '21', grade: '3' });
    navigate('/');
  };

  const inp = { width: '100%', borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFBFF', ...s };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', ...s }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, textDecoration: 'none' }}>
            <GachonLogo size={40} />
            <span style={{ fontSize: 24, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>로그인</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>계정에 로그인하여 서비스를 이용하세요</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #E8F0FF', padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이메일</label>
              <input style={inp} type="email" placeholder="이메일을 입력하세요" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp, paddingRight: 44 }} type={showPw ? 'text' : 'password'} placeholder="비밀번호를 입력하세요" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', cursor: 'pointer' }}>
                <input type="checkbox" /> 로그인 상태 유지
              </label>
              <Link to="/find-account" style={{ color: '#4F7CF3', textDecoration: 'none', fontWeight: 500 }}>아이디/비밀번호 찾기</Link>
            </div>
            <button type="submit" style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', ...s }}>
              로그인 <ArrowRight size={16} />
            </button>
          </form>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', margin: '0 0 10px' }}>계정이 없으신가요?</p>
            <Link to="/signup" style={{ display: 'block', textAlign: 'center', borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px', fontSize: 14, fontWeight: 600, color: '#1F2937', textDecoration: 'none', background: '#F9FAFB' }}>
              회원가입
            </Link>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9CA3AF' }}>
          <Link to="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>← 홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
""")
print('Login.jsx 완료')

# ── Signup.jsx ──
with open('src/pages/user/Signup.jsx', 'w', encoding='utf-8') as f:
    f.write("""import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', studentId: '', grade: '1' });
  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 12, border: '1px solid #E8F0FF', padding: '11px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#FAFBFF', ...s };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: form.name, email: form.email, department: form.department, studentId: form.studentId, grade: form.grade });
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', ...s }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, textDecoration: 'none' }}>
            <GachonLogo size={38} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>회원가입</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Sometime과 함께 스마트한 시간표를 만들어보세요</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E8F0FF', padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이름</label>
              <input style={inp} type="text" placeholder="이름을 입력하세요" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>소속 학과</label>
                <input style={inp} type="text" placeholder="컴퓨터공학과" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>학번</label>
                <input style={inp} type="text" placeholder="21학번" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} />
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
              <input style={inp} type="email" placeholder="이메일을 입력하세요" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp, paddingRight: 44 }} type={showPw ? 'text' : 'password'} placeholder="비밀번호 (8자 이상)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', ...s }}>
              회원가입 <ArrowRight size={16} />
            </button>
          </form>
          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#4F7CF3', fontWeight: 600, textDecoration: 'none' }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
""")
print('Signup.jsx 완료')

# ── FindAccount.jsx ──
with open('src/pages/user/FindAccount.jsx', 'w', encoding='utf-8') as f:
    f.write("""import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Lock } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';

export default function FindAccount() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('id');
  const [form, setForm] = useState({ name: '', email: '', userId: '' });
  const [done, setDone] = useState(false);
  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px 16px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#FAFBFF', ...s };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', ...s }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, textDecoration: 'none' }}>
            <GachonLogo size={38} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>아이디 / 비밀번호 찾기</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>가입 시 입력한 정보로 계정을 찾을 수 있어요</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E8F0FF', padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[{ key: 'id', label: '아이디 찾기' }, { key: 'pw', label: '비밀번호 찾기' }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setDone(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: tab === t.key ? '#4F7CF3' : '#F5F7FB', color: tab === t.key ? 'white' : '#6B7280', ...s }}>
                {t.label}
              </button>
            ))}
          </div>
          {!done ? (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tab === 'id' ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이름</label>
                    <input style={inp} type="text" placeholder="이름을 입력하세요" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이메일</label>
                    <input style={inp} type="email" placeholder="가입한 이메일을 입력하세요" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>아이디 (이메일)</label>
                    <input style={inp} type="email" placeholder="가입한 이메일을 입력하세요" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>이름</label>
                    <input style={inp} type="text" placeholder="이름을 입력하세요" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </>
              )}
              <button type="submit" style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>
                {tab === 'id' ? '아이디 찾기' : '인증 메일 발송'} <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                {tab === 'id' ? <Mail size={24} color="#4F7CF3" /> : <Lock size={24} color="#4F7CF3" />}
              </div>
              <p style={{ fontWeight: 700, color: '#1F2937', marginBottom: 8, fontSize: 16 }}>{tab === 'id' ? '아이디를 찾았어요!' : '인증 메일을 발송했어요!'}</p>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>{tab === 'id' ? '가입된 이메일: h***@gachon.ac.kr' : '입력한 이메일로 비밀번호 재설정 링크를 보냈어요.'}</p>
              <button onClick={() => navigate('/login')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: '#4F7CF3', padding: '13px', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>
                로그인하러 가기 <ArrowRight size={16} />
              </button>
            </div>
          )}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
              <ArrowLeft size={12} /> 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
""")
print('FindAccount.jsx 완료')

print('모든 파일 완료!')