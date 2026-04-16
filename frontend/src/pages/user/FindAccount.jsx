import { useState } from 'react';
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