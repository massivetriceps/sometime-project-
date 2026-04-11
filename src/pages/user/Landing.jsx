import { Link, useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, CalendarDays, ShoppingCart, GraduationCap, ChevronDown, LogOut, User } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { useAuth } from '../../context/AuthContext';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function TimetableGrid() {
  const slots = [
    { day: '월', start: '09:00', end: '12:00', name: '블록체인개론', room: 'AI관-408', color: '#8FA8FF' },
    { day: '월', start: '12:00', end: '14:00', name: '소프트웨어공학', room: 'AI관-302', color: '#F7CFA1' },
    { day: '화', start: '09:00', end: '12:00', name: '종합프로젝트', room: 'AI관-508', color: '#8EDDD0' },
    { day: '화', start: '15:00', end: '17:00', name: '지성학I', room: '화상강의', color: '#F5E88F' },
    { day: '수', start: '09:00', end: '12:00', name: '디지털미디어', room: '화상강의', color: '#F4AFCF' },
    { day: '목', start: '11:00', end: '13:00', name: '가정과육아', room: '화상강의', color: '#C3B5FF' },
  ];
  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 19;
  const hourHeight = 55;
  const getTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid #E8F0FF', boxShadow: '0 8px 32px rgba(79,124,243,0.12)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(5, 1fr)', marginBottom: 4 }}>
        <div style={{ height: 36 }} />
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#4F7CF3', lineHeight: '36px', background: '#F0F4FF', borderRadius: 8, margin: '0 2px' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(5, 1fr)', position: 'relative', height: (endHour - startHour) * hourHeight }}>
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', top: i * hourHeight - 8, width: 36, fontSize: 11, color: '#9CA3AF', textAlign: 'right', paddingRight: 6 }}>{startHour + i}</div>
            <div style={{ position: 'absolute', top: i * hourHeight, height: 1, left: 40, right: 0, background: '#F3F4F6' }} />
          </React.Fragment>
        ))}
        <div style={{ position: 'absolute', inset: 0, left: 40, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: '100%' }}>
          {days.map(day => (
            <div key={day} style={{ position: 'relative', height: '100%', borderLeft: '1px solid #F3F4F6' }}>
              {slots.filter(s => s.day === day).map((slot, i) => {
                const top = (getTime(slot.start) - startHour) * hourHeight;
                const height = (getTime(slot.end) - getTime(slot.start)) * hourHeight;
                return (
                  <div key={i} style={{ position: 'absolute', left: 3, right: 3, top, height, backgroundColor: slot.color, borderRadius: 8, padding: '6px 8px', overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 2, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{slot.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{slot.room}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #F3F4F6', fontSize: 11, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
        <span>사회봉사1 (P/NP)</span>
        <span>Gachon Univ.</span>
      </div>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const navItems = [{ label: '기능', href: '#features' }, { label: '사용법', href: '#howto' }, { label: 'FAQ', href: '#faq' }];

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E8F0FF', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <GachonLogo size={34} />
          <span style={{ fontWeight: 700, fontSize: 20, color: '#1F2937' }}>Sometime</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {!isLoggedIn && navItems.map(i => (
            <a key={i.href} href={i.href} style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>{i.label}</a>
          ))}

          {isLoggedIn ? (
            <>
              <Link to="/courses" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>강의 검색</Link>
              <Link to="/cart" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>장바구니</Link>
              <Link to="/timetable/manage" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>내 시간표</Link>
              <Link to="/graduation/dashboard" style={{ color: "#6B7280", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>졸업요건</Link><Link to="/graduation/history" style={{ color: "#6B7280", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>수강내역</Link>
              <Link to="/notice" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>공지사항</Link>
              <div style={{ width: 1, height: 18, background: '#E8F0FF' }} />
              <Link to="/mypage" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1F2937', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
                <img
                  src="/src/assets/student-logo.png"
                  alt="프로필"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E8F0FF' }}
                />
                {user?.name || '마이페이지'}
              </Link>
              <button onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F7FB', color: '#6B7280', padding: '8px 16px', borderRadius: 12, fontWeight: 500, fontSize: 14, border: '1px solid #E8F0FF', cursor: 'pointer', fontFamily: 'Pretendard, sans-serif' }}>
                <LogOut size={14} /> 로그아웃
              </button>
              <Link to="/timetable/setup" style={{ background: '#4F7CF3', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                시간표 만들기
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ border: '1px solid #E8F0FF', color: '#1F2937', padding: '8px 16px', borderRadius: 12, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>로그인</Link>
              <Link to="/signup" style={{ border: '1px solid #E8F0FF', color: '#1F2937', padding: '8px 16px', borderRadius: 12, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>회원가입</Link>
              <Link to="/timetable/setup" style={{ background: '#4F7CF3', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                시간표 만들기
              </Link>
            </>
          )}
        </div>

        <button style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
          {open ? <X style={{ width: 24, height: 24, color: '#1F2937' }} /> : <Menu style={{ width: 24, height: 24, color: '#1F2937' }} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ borderTop: '1px solid #E8F0FF', background: 'white', fontFamily: 'Pretendard, sans-serif' }}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {isLoggedIn ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', marginBottom: 4, borderBottom: '1px solid #F3F4F6' }}>
                    <img
                      src="/src/assets/student-logo.png"
                      alt="프로필"
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E8F0FF' }}
                    />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{user?.department}</p>
                    </div>
                  </div>
                  {[
                    { to: '/timetable/setup', label: '시간표 만들기' },
                    { to: '/courses', label: '강의 검색' },
                    { to: '/cart', label: '장바구니' },
                    { to: '/timetable/manage', label: '내 시간표' },
                    { to: '/graduation/dashboard', label: '졸업요건' },
                    { to: '/graduation/history', label: '수강내역' },
                    { to: '/notice', label: '공지사항' },
                    { to: '/mypage', label: '마이페이지' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                      style={{ padding: '11px 8px', fontSize: 14, color: '#1F2937', textDecoration: 'none', borderRadius: 8, display: 'block' }}>
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    style={{ marginTop: 4, padding: '11px 8px', fontSize: 14, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderTop: '1px solid #F3F4F6', fontFamily: 'Pretendard, sans-serif' }}>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  {navItems.map(i => (
                    <a key={i.href} href={i.href} style={{ padding: '11px 8px', fontSize: 14, color: '#6B7280', textDecoration: 'none' }} onClick={() => setOpen(false)}>{i.label}</a>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                    <Link to="/signup" onClick={() => setOpen(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#1F2937', textDecoration: 'none', textAlign: 'center', border: '1px solid #E8F0FF', background: '#F9FAFB' }}>
                      회원가입
                    </Link>
                    <Link to="/login" onClick={() => setOpen(false)}
                      style={{ flex: 1, background: '#4F7CF3', color: 'white', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                      로그인
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const { isLoggedIn, user } = useAuth();
  const width = useWindowWidth();
  const isLg = width >= 1024;

  return (
    <section style={{ paddingTop: 128, paddingBottom: 80, padding: '128px 24px 80px', background: 'linear-gradient(to bottom, #ffffff, #F5F7FB)', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {isLoggedIn ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8F0FF', color: '#4F7CF3', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500, width: 'fit-content' }}>
                <Sparkles style={{ width: 16, height: 16 }} />
                {user?.name}님, 환영합니다!
              </div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#1F2937', lineHeight: 1.2, margin: 0 }}>
                이번 학기 시간표,<br />오늘 바로 완성하세요.
              </h1>
              <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>
                장바구니에 담은 강의와 졸업 요건을 분석해<br />나만의 최적 시간표를 3초 만에 만들어드립니다.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480 }}>
                <Link to="/timetable/setup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
                  시간표 만들기
                </Link>
                <Link to="/timetable/manage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'white', color: '#1F2937', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid #D1D5DB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  내 시간표 보기
                </Link>
                <Link to="/cart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#EDE9FE', color: '#7C3AED', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid #C4B5FD' }}>
                  장바구니
                </Link>
                <Link to="/graduation/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#CCFBF1', color: '#0F766E', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid #99F6E4' }}>
                  졸업요건 확인
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8F0FF', color: '#4F7CF3', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500, width: 'fit-content' }}>
                <Sparkles style={{ width: 16, height: 16 }} />
                가천대학교 스마트 시간표 생성기
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#1F2937', lineHeight: 1.2, margin: 0 }}>
                시간표, 이제<br />고민하지 말고 맡겨.
              </h1>
              <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>
                여러분의 선호 조건을 모두 반영할 수 있습니다<br />
                공강요일, 온라인 강의 선호, 오르막 회피까지 모두 고려한 완벽한 시간표를 만들어드립니다
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <Link to="/login" style={{ background: '#4F7CF3', color: 'white', padding: '16px 32px', borderRadius: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
                  시작하기 <ArrowRight style={{ width: 20, height: 20 }} />
                </Link>
                <Link to="/timetable/setup" style={{ background: 'white', border: '1.5px solid #D1D5DB', color: '#1F2937', padding: '16px 32px', borderRadius: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  지금 시간표 만들기
                </Link>
              </div>
            </>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ position: 'relative' }}>
          <TimetableGrid />
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { iconBg: '#E8F0FF', iconColor: '#4F7CF3', title: '개인선호 맞춤형 조건 반영', desc: '단순한 공강 설정을 넘어섭니다. 선호하는 시간대는 물론, 건물 이동 동선 및 오르막 회피까지 계산해 나만의 최적화된 시간표를 조립합니다.' },
    { iconBg: '#d1faf5', iconColor: '#2EC4B6', title: '직관적인 졸업 요건 대시보드', desc: '복잡한 졸업 규정, 더 이상 헤매지 마세요. 내 수강내역을 분석해 졸업까지 남은 학점과 필수 과목을 한눈에 시각화해 드립니다.' },
    { iconBg: '#ede9fe', iconColor: '#A78BFA', title: '3초 만에 빠른 생성', desc: '아무리 복잡한 조건이라도 문제없습니다. 자체 CSP 엔진이 수백 개의 경우의 수를 즉시 비교하여 가장 완벽한 결과물을 제공합니다.' },
  ];
  return (
    <section id="features" style={{ padding: '80px 24px', background: 'white', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>왜 Sometime인가요?</h2>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#6B7280' }}>수동으로 시간표를 짜던 시대는 끝났습니다.<br />이제 더 스마트하게 준비하세요.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
              style={{ background: 'white', display: 'flex', flexDirection: 'column', gap: 16, padding: 32, borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(79,124,243,0.08)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: f.iconBg, color: f.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays style={{ width: 24, height: 24 }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F2937', fontSize: 15, margin: 0 }}>{f.title}</h3>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightSection() {
  const [active, setActive] = useState(0);
  const steps = [
    { number: 1, title: '기본 정보 입력', desc: '컴퓨터공학과 21학번, 이번 학기 목표는 18학점! Sometime에 나의 기본 학사 정보를 가볍게 셋팅합니다.' },
    { number: 2, title: '맞춤 조건 우선순위 설정', desc: '공강 요일이 가장 중요한가요, 아니면 동선 최소화가 먼저인가요? 나에게 가장 중요한 조건의 순위를 결정하세요.' },
    { number: 3, title: '디테일한 선호 조건 응답', desc: '원하는 시간대부터 피하고 싶은 동선까지 꼼꼼하게 체크합니다.' },
    { number: 4, title: '3초 만에 최적화 시간표 생성', desc: 'CSP 엔진이 클릭 한 번으로 내 조건에 완벽히 부합하는 시간표를 완성합니다.' },
    { number: 5, title: 'AI 맞춤형 코멘트 확인', desc: 'AI가 시간표마다 맞춤 코멘트를 작성해드립니다.' },
  ];
  return (
    <section id="howto" style={{ padding: '80px 24px', background: '#F9FAFB', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: '#E8F0FF', color: '#4F7CF3', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>이렇게 사용해요</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>5단계로 완성하는<br />완벽한 시간표</h2>
          <p style={{ fontSize: 18, color: '#6B7280', margin: 0 }}>복잡한 조건 설정도 직관적으로, 3초 만에 최적의 시간표를 만나보세요</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E8F0FF', overflow: 'hidden' }}>
          <div style={{ padding: '32px 32px 24px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 4, background: '#E5E7EB', borderRadius: 4 }} />
              <div style={{ position: 'absolute', top: 20, left: 0, height: 4, background: '#4F7CF3', borderRadius: 4, transition: 'width 0.5s', width: active === 0 ? '0%' : (active / (steps.length - 1) * 100) + '%' }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                {steps.map((s, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: i <= active ? '#4F7CF3' : 'white', color: i <= active ? 'white' : '#9CA3AF', border: i <= active ? 'none' : '2px solid #D1D5DB', boxShadow: i <= active ? '0 4px 12px rgba(79,124,243,0.4)' : 'none' }}>{s.number}</div>
                    <span style={{ marginTop: 8, fontSize: 12, fontWeight: 500, color: i === active ? '#4F7CF3' : '#9CA3AF' }}>Step {s.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 32px 32px' }}>
            <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minHeight: 120 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', marginBottom: 12 }}>{steps[active].title}</h3>
              <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{steps[active].desc}</p>
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 24, borderTop: '1px solid #F3F4F6' }}>
              <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} style={{ padding: '8px 24px', borderRadius: 12, fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: active === 0 ? 'not-allowed' : 'pointer', color: active === 0 ? '#D1D5DB' : '#6B7280', fontFamily: 'Pretendard, sans-serif' }}>이전</button>
              <div style={{ display: 'flex', gap: 8 }}>
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{ height: 8, borderRadius: 4, background: i === active ? '#4F7CF3' : '#D1D5DB', width: i === active ? 24 : 8, border: 'none', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              {active === steps.length - 1
                ? <Link to="/timetable/setup" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px', borderRadius: 12, background: '#4F7CF3', color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>시작하기 <ArrowRight style={{ width: 16, height: 16 }} /></Link>
                : <button onClick={() => setActive(Math.min(steps.length - 1, active + 1))} style={{ padding: '8px 24px', borderRadius: 12, fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#4F7CF3', fontFamily: 'Pretendard, sans-serif' }}>다음</button>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecondaryFeature() {
  const width = useWindowWidth();
  const isLg = width >= 1024;
  return (
    <section style={{ padding: '80px 24px', background: 'white', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ede9fe', color: '#A78BFA', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, width: 'fit-content' }}>
              <ShoppingCart style={{ width: 16, height: 16 }} />장바구니 기능
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#1F2937', lineHeight: 1.3, margin: 0 }}>절대 포기할 수 없는<br />1순위 과목 사수하기</h2>
            <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>이번 학기에 무조건 들어야 하는 과목이 있나요? 장바구니에 담아 최우선으로 설정하면, 엔진이 해당 과목을 뼈대 삼아 나머지 시간표를 완벽하게 조립합니다.</p>
            <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', width: 'fit-content' }}>
              장바구니 보기 <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: 24, boxShadow: '0 4px 24px rgba(79,124,243,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <ShoppingCart style={{ width: 20, height: 20, color: '#4F7CF3' }} />
              <span style={{ fontWeight: 600, color: '#1F2937' }}>관심 강의 장바구니</span>
            </div>
            {['자료구조 (김교수)', '알고리즘 (이교수)', '영어회화 (Smith)'].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F7CF3' }} />
                  <span style={{ fontSize: 14, color: '#1F2937' }}>{c}</span>
                </div>
                <span style={{ fontSize: 12, background: '#E8F0FF', color: '#4F7CF3', padding: '4px 8px', borderRadius: 999, fontWeight: 500 }}>{i === 0 ? '최우선' : i === 1 ? '우선' : '보통'}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: 24, boxShadow: '0 4px 24px rgba(79,124,243,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <GraduationCap style={{ width: 20, height: 20, color: '#2EC4B6' }} />
              <span style={{ fontWeight: 600, color: '#1F2937' }}>졸업 요건 현황</span>
            </div>
            {[{ label: '전공 필수', c: 36, t: 42, color: '#4F7CF3' }, { label: '교양 필수', c: 18, t: 21, color: '#2EC4B6' }, { label: '자유 선택', c: 12, t: 15, color: '#A78BFA' }].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: '#1F2937', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>{item.c}/{item.t}학점</span>
                </div>
                <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4 }}>
                  <div style={{ height: 8, borderRadius: 4, width: (item.c / item.t * 100) + '%', backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#d1faf5', color: '#2EC4B6', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, width: 'fit-content' }}>
              <GraduationCap style={{ width: 16, height: 16 }} />졸업요건 대시보드
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#1F2937', lineHeight: 1.3, margin: 0 }}>복잡한 졸업 규정?<br />대시보드 하나로 종결.</h2>
            <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>입학년도마다 달라지는 복잡한 요건들, 내 수강내역을 바탕으로 남은 학점을 대시보드에서 직관적으로 트래킹하세요.</p>
            <Link to="/graduation/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2EC4B6', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', width: 'fit-content' }}>
              졸업요건 확인하기 <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    { q: '어떤 학교 학생이 사용할 수 있나요?', a: '현재는 가천대학교 학생을 대상으로 서비스를 제공하고 있습니다.' },
    { q: '시간표 생성에 얼마나 걸리나요?', a: '자체 CSP 엔진을 통해 평균 3초 이내에 최적화된 시간표를 생성합니다.' },
    { q: '공강일이 보장되나요?', a: '원하는 공강일을 설정하면 최대한 반영합니다. 단, 필수 과목이 해당 요일에만 개설된 경우 불가피하게 반영되지 않을 수 있습니다.' },
    { q: '생성된 시간표를 수정할 수 있나요?', a: '결과 화면에서 조건을 재설정하여 새로운 시간표를 생성할 수 있습니다.' },
    { q: '졸업 요건 정보는 어떻게 관리되나요?', a: '학번별로 졸업 요건 데이터가 관리되며, 수강 내역을 입력하면 충족도를 자동으로 계산해드립니다.' },
  ];
  return (
    <section id="faq" style={{ padding: '80px 24px', background: '#F9FAFB', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 768, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>자주 묻는 질문</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>궁금한 점이 있으신가요?</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderRadius: 16, border: '1px solid #E8F0FF', background: 'white', overflow: 'hidden' }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Pretendard, sans-serif' }}>
                <span style={{ fontWeight: 600, color: '#1F2937', fontSize: 15 }}>Q. {f.q}</span>
                <ChevronDown style={{ width: 20, height: 20, color: '#6B7280', flexShrink: 0, marginLeft: 16, transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px 20px', fontSize: 14, color: '#6B7280', lineHeight: 1.6, borderTop: '1px solid #F3F4F6' }}>A. {f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { isLoggedIn } = useAuth();
  return (
    <section style={{ padding: '80px 24px', background: '#4F7CF3', position: 'relative', overflow: 'hidden', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 384, height: 384, background: 'white', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 384, height: 384, background: 'white', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>
      <div style={{ maxWidth: 768, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, color: 'white' }}>지금 바로 시작하세요</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: 'white', lineHeight: 1.2, margin: 0 }}>시간표 고민은 이제 그만,<br />3초면 충분합니다</h2>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', maxWidth: 512, margin: 0 }}>복잡한 시간표 계획을 단 몇 번의 클릭으로 해결하세요.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {!isLoggedIn && (
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#4F7CF3', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                시작하기 <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
            )}
            <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isLoggedIn ? 'white' : 'rgba(255,255,255,0.2)', color: isLoggedIn ? '#4F7CF3' : 'white', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: isLoggedIn ? 'none' : '2px solid rgba(255,255,255,0.5)', boxShadow: isLoggedIn ? '0 8px 32px rgba(0,0,0,0.15)' : 'none' }}>
              지금 시간표 만들기
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    service: [{ label: '시간표 만들기', to: '/timetable/setup' }, { label: '강의 검색', to: '/courses' }, { label: '장바구니', to: '/cart' }, { label: '시간표 관리', to: '/timetable/manage' }],
    graduation: [{ label: '수강내역', to: '/graduation/history' }, { label: '졸업요건 대시보드', to: '/graduation/dashboard' }],
    support: [{ label: '공지사항', to: '/notice' }, { label: 'FAQ', to: '#faq' }],
    account: [{ label: '로그인', to: '/login' }, { label: '회원가입', to: '/signup' }, { label: '마이페이지', to: '/mypage' }],
  };
  return (
    <footer style={{ background: '#F9FAFB', borderTop: '1px solid #E8F0FF', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, textDecoration: 'none' }}>
              <GachonLogo size={30} />
              <span style={{ fontWeight: 700, fontSize: 18, color: '#1F2937' }}>Sometime</span>
            </Link>
            <p style={{ color: '#6B7280', fontSize: 13, margin: 0, lineHeight: 1.6 }}>가천대학교 학생들을 위한<br />스마트 시간표 생성 서비스.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: '#1F2937', marginBottom: 12, fontSize: 13 }}>서비스</h4>
            {links.service.map(l => <Link key={l.to} to={l.to} style={{ display: 'block', color: '#6B7280', fontSize: 13, marginBottom: 6, textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: '#1F2937', marginBottom: 12, fontSize: 13 }}>졸업관리</h4>
            {links.graduation.map(l => <Link key={l.to} to={l.to} style={{ display: 'block', color: '#6B7280', fontSize: 13, marginBottom: 6, textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: '#1F2937', marginBottom: 12, fontSize: 13 }}>운영지원</h4>
            {links.support.map(l => <Link key={l.to} to={l.to} style={{ display: 'block', color: '#6B7280', fontSize: 13, marginBottom: 6, textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: '#1F2937', marginBottom: 12, fontSize: 13 }}>계정</h4>
            {links.account.map(l => <Link key={l.to} to={l.to} style={{ display: 'block', color: '#6B7280', fontSize: 13, marginBottom: 6, textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #E8F0FF', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>2025 Sometime. All rights reserved.</p>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>Made with love for Gachon University</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const { isLoggedIn } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Pretendard, -apple-system, sans-serif' }}>
      <Navbar />
      <HeroSection />
      <Features />
      {!isLoggedIn && <HighlightSection />}
      {!isLoggedIn && <SecondaryFeature />}
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
