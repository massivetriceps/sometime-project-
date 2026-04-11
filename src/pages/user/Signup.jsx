import { useState } from 'react';
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>소속 학과</label>
                <input style={inp} type="text" placeholder="학과명을 입력하세요" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>학번</label>
                <input style={inp} type="text" placeholder="학번을 입력하세요" value={form.studentId} maxLength={9} onChange={e => setForm({ ...form, studentId: e.target.value })} />
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
