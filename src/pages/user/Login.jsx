import { useState } from 'react';
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
    login({ name: '구라진', email: form.email, department: '컴퓨터공학과', studentId: '202336064', grade: '4' });
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
