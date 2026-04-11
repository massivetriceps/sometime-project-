import { Link } from 'react-router-dom';
import { GachonLogo } from '../../../components/ui/GachonLogo';
import { GraduationCap, BookOpen, Award, TrendingUp, ArrowRight, CheckCircle2, AlertCircle, Edit, ArrowLeft } from 'lucide-react';

const REQS = [
  { category: '전공필수', required: 60, completed: 42, color: '#4F7CF3', desc: '핵심 전공 과목 이수' },
  { category: '전공선택', required: 30, completed: 18, color: '#2EC4B6', desc: '전공 선택 과목 이수' },
  { category: '교양필수', required: 21, completed: 21, color: '#A78BFA', desc: '필수 교양 과목 이수' },
  { category: '교양선택', required: 12, completed: 6,  color: '#F4D58D', desc: '선택 교양 과목 이수' },
  { category: '자유선택', required: 15, completed: 12, color: '#6B7280', desc: '자유 이수 학점' },
];

const CREDIT_DATA = {
  major: { required: { completed: 42, total: 60 }, elective: { completed: 18, total: 30 } },
  general: { completed: 35, total: 40 },
  total: { completed: 95, total: 130 },
};

const calcPct = (c, t) => Math.round((c / t) * 100);

export default function GraduationDashboard() {
  const s = { fontFamily: 'Pretendard, sans-serif' };
  const totalReq = REQS.reduce((a, r) => a + r.required, 0);
  const totalCom = REQS.reduce((a, r) => a + r.completed, 0);
  const overallPct = calcPct(totalCom, totalReq);
  const remaining = totalReq - totalCom;

  const STATS = [
    { title: '총 이수 학점', value: `${CREDIT_DATA.total.completed}/${CREDIT_DATA.total.total}`, pct: calcPct(CREDIT_DATA.total.completed, CREDIT_DATA.total.total), icon: <GraduationCap size={16} color="white" />, bg: '#4F7CF3' },
    { title: '전공 필수',   value: `${CREDIT_DATA.major.required.completed}/${CREDIT_DATA.major.required.total}`, pct: calcPct(CREDIT_DATA.major.required.completed, CREDIT_DATA.major.required.total), icon: <BookOpen size={16} color="white" />, bg: '#2EC4B6' },
    { title: '전공 선택',   value: `${CREDIT_DATA.major.elective.completed}/${CREDIT_DATA.major.elective.total}`, pct: calcPct(CREDIT_DATA.major.elective.completed, CREDIT_DATA.major.elective.total), icon: <Award size={16} color="white" />, bg: '#A78BFA' },
    { title: '교양',        value: `${CREDIT_DATA.general.completed}/${CREDIT_DATA.general.total}`, pct: calcPct(CREDIT_DATA.general.completed, CREDIT_DATA.general.total), icon: <TrendingUp size={16} color="white" />, bg: '#F4D58D' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6B7280", textDecoration: "none" }}>
            <ArrowLeft size={14} /> 홈으로
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>졸업 요건 대시보드</h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>현재 학점 이수 현황과 졸업까지 남은 학점을 한눈에 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '20px 20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>{stat.title}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', marginBottom: 10 }}>{stat.value}</div>
              <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, marginBottom: 6 }}>
                <div style={{ height: 6, borderRadius: 999, background: stat.bg, width: stat.pct + '%', transition: 'width 0.8s ease' }} />
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{stat.pct}% 완료</p>
            </div>
          ))}
        </div>

        {/* 전체 진행 배너 */}
        <div style={{ background: 'linear-gradient(135deg, #4F7CF3, #6B95F5)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 6px' }}>전체 이수 현황</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{totalCom}</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>/ {totalReq}학점</span>
              <span style={{ fontSize: 18, fontWeight: 700, marginLeft: 'auto', marginBottom: 4 }}>{overallPct}%</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 999, marginBottom: 8 }}>
              <div style={{ height: 10, background: 'white', borderRadius: 999, width: overallPct + '%', transition: 'width 1s ease' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
              {remaining > 0 ? `졸업까지 ${remaining}학점 남았어요` : '🎉 졸업 요건을 모두 충족했어요!'}
            </p>
          </div>
        </div>

        {/* 이번 학기 권장 학점 */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>이번 학기 이수 권장 학점</h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 16px' }}>졸업 요건을 충족하기 위해 필요한 학점입니다</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: '전공 필수', value: CREDIT_DATA.major.required.total - CREDIT_DATA.major.required.completed, color: '#4F7CF3', bg: '#E8F0FF' },
              { label: '전공 선택', value: CREDIT_DATA.major.elective.total - CREDIT_DATA.major.elective.completed, color: '#2EC4B6', bg: '#d1faf5' },
              { label: '교양',     value: CREDIT_DATA.general.total - CREDIT_DATA.general.completed, color: '#A78BFA', bg: '#ede9fe' },
            ].map((item, i) => (
              <div key={i} style={{ borderRadius: 12, background: item.bg, padding: '16px 18px' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', margin: '0 0 6px' }}>{item.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: item.color, margin: '0 0 2px' }}>{item.value}학점</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>부족한 학점</p>
              </div>
            ))}
          </div>
        </div>

        {/* 카테고리별 Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {REQS.map((req, i) => {
            const p = Math.min(calcPct(req.completed, req.required), 100);
            const done = req.completed >= req.required;
            return (
              <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {done ? <CheckCircle2 size={15} color="#A78BFA" /> : <AlertCircle size={15} color={req.color} />}
                    <span style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{req.category}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{req.desc}</span>
                    {done && <span style={{ fontSize: 10, background: '#ede9fe', color: '#A78BFA', padding: '1px 8px', borderRadius: 999, fontWeight: 600 }}>완료</span>}
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{req.completed}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}> / {req.required}학점</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999 }}>
                  <div style={{ height: 8, borderRadius: 999, width: p + '%', background: req.color, transition: 'width 0.8s ease' }} />
                </div>
                {!done && (
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '6px 0 0' }}>
                    {req.required - req.completed}학점 더 필요 · 현재 {p}% 달성
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* 추천 메시지 */}
        <div style={{ background: '#E8F0FF', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#4F7CF3', margin: '0 0 6px' }}>💡 이번 학기 추천</p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
            전공필수 학점이 {60 - 42}학점 부족합니다. 시간표 생성 시 전공필수 과목을 우선 배치하도록 설정해보세요.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/graduation/history" style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 12, border: '1px solid #E8F0FF', background: 'white', padding: '11px 18px', fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> 홈으로
          </Link>
          <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
            시간표 만들기 <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
