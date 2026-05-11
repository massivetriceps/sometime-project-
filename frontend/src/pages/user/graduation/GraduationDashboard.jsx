import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, TrendingUp, Layers, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../api/axios';

const calcPct = (c, t) => (t > 0 ? Math.min(Math.round((c / t) * 100), 100) : 0);

export default function GraduationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const s = { fontFamily: 'Pretendard, sans-serif' };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/users/me/graduation/dashboard');
        if (res.data.resultType === 'SUCCESS') {
          setData(res.data.success);
        }
      } catch (err) {
        const reason = err.response?.data?.error?.reason;
        setError(reason || '졸업 요건 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
        <p style={{ color: '#6B7280', fontSize: 14 }}>졸업 요건을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#EF4444', fontSize: 14, marginBottom: 12 }}>{error || '데이터가 없습니다.'}</p>
          <Link to="/graduation/history" style={{ fontSize: 13, color: '#4F7CF3', textDecoration: 'none' }}>
            수강 내역 입력하러 가기 →
          </Link>
        </div>
      </div>
    );
  }

  const { total_req_credits, total_earned_credits, details } = data;
  const overallPct = calcPct(total_earned_credits, total_req_credits);
  const remaining = total_req_credits - total_earned_credits;
  const conv = details.convergence_lib;

  // 자유교양 = 총학점 - (전공필수 + 전공선택 + 기초교양 + 융합교양 + 계열교양)
  const mandatoryTotal =
    details.major_required.req +
    details.major_elective.req +
    details.basic_liberal.req +
    (conv?.req_credits || 0) +
    (details.area_liberal?.req || 0) +
    (details.free_liberal?.req || 0);
  const freeReq    = Math.max(total_req_credits - mandatoryTotal, 0);
  const freeEarned = Math.max(total_earned_credits -
    details.major_required.earned -
    details.major_elective.earned -
    details.basic_liberal.earned -
    (conv?.earned_credits || 0) -
    (details.area_liberal?.earned || 0), 0);

  const STATS = [
    { title: '총 이수 학점', value: `${total_earned_credits}/${total_req_credits}`,              pct: overallPct,                                                                        icon: <GraduationCap size={15} color="white" />, bg: '#4F7CF3' },
    { title: '전공 필수',    value: `${details.major_required.earned}/${details.major_required.req}`, pct: calcPct(details.major_required.earned, details.major_required.req),          icon: <BookOpen size={15} color="white" />,      bg: '#2EC4B6' },
    { title: '전공 선택',    value: `${details.major_elective.earned}/${details.major_elective.req}`, pct: calcPct(details.major_elective.earned, details.major_elective.req),          icon: <Award size={15} color="white" />,         bg: '#A78BFA' },
    { title: '기초교양',     value: `${details.basic_liberal.earned}/${details.basic_liberal.req}`,   pct: calcPct(details.basic_liberal.earned, details.basic_liberal.req),            icon: <TrendingUp size={15} color="white" />,    bg: '#F4D58D' },
    ...(conv?.req_credits > 0 ? [{
      title: '융합교양',
      value: `${conv.areas_done}/3개 영역`,
      pct: Math.min(Math.round(conv.areas_done / (conv.req_areas || 3) * 100), 100),
      icon: <Layers size={15} color="white" />, bg: '#F97316',
    }] : []),
    ...(details.area_liberal?.req > 0 ? [{
      title: '계열교양',
      value: `${details.area_liberal.earned}/${details.area_liberal.req}`,
      pct: calcPct(details.area_liberal.earned, details.area_liberal.req),
      icon: <TrendingUp size={15} color="white" />, bg: '#10B981',
    }] : []),
    ...(freeReq > 0 ? [{
      title: '자유교양',
      value: `${freeEarned}/${freeReq}`,
      pct: calcPct(freeEarned, freeReq),
      icon: <TrendingUp size={15} color="white" />, bg: '#6B7280',
    }] : []),
  ];

  const AREA_LABELS = { art: '예술', society: '사회', nature: '자연', world: '세계' };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>졸업 요건 대시보드</h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>현재 학점 이수 현황과 졸업까지 남은 학점을 한눈에 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
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
                <div style={{ height: 6, borderRadius: 999, background: stat.bg, width: Math.min(stat.pct, 100) + '%', transition: 'width 0.8s ease' }} />
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
              <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{total_earned_credits}</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>/ {total_req_credits}학점</span>
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

        {/* 카테고리별 Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {/* 일반 항목 */}
          {[
            { category: '전공필수', req: details.major_required.req, earned: details.major_required.earned, color: '#4F7CF3' },
            { category: '전공선택', req: details.major_elective.req, earned: details.major_elective.earned, color: '#2EC4B6' },
            { category: '기초교양', req: details.basic_liberal.req,  earned: details.basic_liberal.earned,  color: '#A78BFA' },
            details.area_liberal?.req > 0 && { category: '계열교양', req: details.area_liberal.req, earned: details.area_liberal.earned, color: '#10B981' },
            details.free_liberal?.req > 0 && { category: '교양선택', req: details.free_liberal.req, earned: details.free_liberal.earned, color: '#F4D58D' },
          ].filter(Boolean).map((req, i) => {
            const p = Math.min(calcPct(req.earned, req.req), 100);
            const done = req.earned >= req.req;
            return (
              <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {done ? <CheckCircle2 size={15} color="#A78BFA" /> : <AlertCircle size={15} color={req.color} />}
                    <span style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{req.category}</span>
                    {done && <span style={{ fontSize: 10, background: '#ede9fe', color: '#A78BFA', padding: '1px 8px', borderRadius: 999, fontWeight: 600 }}>완료</span>}
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{req.earned}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}> / {req.req}학점</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999 }}>
                  <div style={{ height: 8, borderRadius: 999, width: p + '%', background: req.color, transition: 'width 0.8s ease' }} />
                </div>
                {!done && <p style={{ fontSize: 12, color: '#9CA3AF', margin: '6px 0 0' }}>{req.req - req.earned}학점 더 필요 · 현재 {p}% 달성</p>}
              </div>
            );
          })}

          {/* 융합교양 — 영역별 특수 카드 */}
          {conv && conv.req_credits > 0 && (() => {
            const done = conv.areas_done >= conv.req_areas;
            return (
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {done ? <CheckCircle2 size={15} color="#A78BFA" /> : <AlertCircle size={15} color="#F97316" />}
                    <span style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>융합교양</span>
                    {done && <span style={{ fontSize: 10, background: '#ede9fe', color: '#A78BFA', padding: '1px 8px', borderRadius: 999, fontWeight: 600 }}>완료</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#F97316' }}>{conv.areas_done}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}> / {conv.req_areas}개 영역</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block' }}>({conv.earned_credits}/{conv.req_credits}학점)</span>
                  </div>
                </div>
                {/* 영역별 배지 */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {Object.entries(conv.areas).map(([key, val]) => {
                    const label = AREA_LABELS[key];
                    const completed = val.earned > 0;
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: completed ? '#FFF0E6' : '#F3F4F6', color: completed ? '#F97316' : '#9CA3AF', border: `1px solid ${completed ? '#FDBA74' : '#E5E7EB'}` }}>
                        {completed ? '✓' : '○'} {label}
                        {val.earned > 0 && <span style={{ fontSize: 10, marginLeft: 2 }}>({val.earned}학점)</span>}
                      </div>
                    );
                  })}
                </div>
                {!done && (
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                    {conv.req_areas - conv.areas_done}개 영역 더 이수 필요 · 4개 영역 중 {conv.req_areas}개 이상 이수해야 합니다
                  </p>
                )}
              </div>
            );
          })()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/graduation/history" style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 12, border: '1px solid #E8F0FF', background: 'white', padding: '11px 18px', fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> 수강내역 수정
          </Link>
          <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
            시간표 만들기 <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}