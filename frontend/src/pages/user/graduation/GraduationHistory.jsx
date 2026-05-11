import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, BookOpen, GraduationCap, Award, TrendingUp, Search } from 'lucide-react';
import api from '../../../api/axios';

// 프론트 분류명 → 백엔드 저장코드
const CLASS_MAP = {
  '전공필수':   '전필',
  '전공선택':   '전선',
  '기초교양':   '기교',
  '융합(예술)': '융합(예술)',
  '융합(사회)': '융합(사회)',
  '융합(자연)': '융합(자연)',
  '융합(세계)': '융합(세계)',
  '계열교양':   '계교',
  '교양선택':   '교양선택',
  '자유선택':   '자유선택',
};

// 백엔드 저장코드 / DB classification → 프론트 분류명
const TO_CAT = {
  '전필': '전공필수', '전공필수': '전공필수',
  '전선': '전공선택', '전공선택': '전공선택',
  '기교': '기초교양', '교필': '기초교양', '기초교양': '기초교양', '교양필수': '기초교양',
  '융합(예술)': '융합(예술)',
  '융합(사회)': '융합(사회)',
  '융합(자연)': '융합(자연)',
  '융합(세계)': '융합(세계)',
  '계교': '계열교양', '계열교양': '계열교양',
  '교선': '교양선택', '교양선택': '교양선택',
  '자유선택': '자유선택',
  '군사': '자유선택', '교직': '자유선택',
};

const CAT_COLOR = {
  '전공필수': '#4F7CF3', '전공선택': '#2EC4B6',
  '기초교양': '#A78BFA',
  '융합(예술)': '#F97316', '융합(사회)': '#FB923C', '융합(자연)': '#FBBF24', '융합(세계)': '#F59E0B',
  '계열교양': '#10B981', '교양선택': '#6B7280', '자유선택': '#9CA3AF',
};

const GRADES = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F', 'P', 'NP'];

export default function GraduationHistory() {
  const navigate = useNavigate();
  const [reqs, setReqs]       = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', credits: 3, grade: 'A+', category: '전공필수', year: '2024', semester: '1' });

  // 과목 자동완성
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg]     = useState(false);
  const debounceRef = useRef(null);
  const suggRef     = useRef(null);

  const s   = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 10, border: '1px solid #E8F0FF', padding: '9px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', ...s };

  /* ── 초기 데이터 로드 ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [histRes, reqRes] = await Promise.all([
          api.get('/api/users/me/graduation/history'),
          api.get('/api/users/me/graduation/dashboard'),
        ]);
        if (histRes.data.resultType === 'SUCCESS') {
          setCourses(histRes.data.success.map(c => ({
            id: c.history_id,
            name: c.course_name,
            credits: c.credits,
            grade: 'A+',
            category: TO_CAT[c.classification] ?? c.classification,
            year: '2024', semester: '1',
          })));
        }
        if (reqRes.data.resultType === 'SUCCESS') setReqs(reqRes.data.success);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── 드롭다운 외부 클릭 닫기 ── */
  useEffect(() => {
    const handler = (e) => {
      if (suggRef.current && !suggRef.current.contains(e.target)) setShowSugg(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── 과목 검색 (debounce 300ms) ── */
  const handleQueryChange = useCallback((val) => {
    setQuery(val);
    setForm(f => ({ ...f, name: val }));
    clearTimeout(debounceRef.current);
    if (!val.trim() || val.length < 1) { setSuggestions([]); setShowSugg(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/api/courses?keyword=${encodeURIComponent(val)}`);
        if (res.data.resultType === 'SUCCESS') {
          setSuggestions(res.data.success.slice(0, 8));
          setShowSugg(true);
        }
      } catch { setSuggestions([]); }
    }, 300);
  }, []);

  /* ── 과목 선택 → 자동완성 ── */
  const selectSuggestion = (c) => {
    const cat = TO_CAT[c.classification] ?? '자유선택';
    setForm(f => ({ ...f, name: c.course_name, credits: c.credits, category: cat }));
    setQuery(c.course_name);
    setShowSugg(false);
  };

  /* ── 이수 현황 실시간 계산 ── */
  const earned = {
    total:      courses.reduce((s, c) => s + Number(c.credits), 0),
    major_req:  courses.filter(c => c.category === '전공필수').reduce((s, c) => s + Number(c.credits), 0),
    major_elec: courses.filter(c => c.category === '전공선택').reduce((s, c) => s + Number(c.credits), 0),
    basic_lib:  courses.filter(c => c.category === '기초교양').reduce((s, c) => s + Number(c.credits), 0),
    conv_areas: [...new Set(courses.filter(c => c.category.startsWith('융합(')).map(c => c.category))].length,
    area:       courses.filter(c => c.category === '계열교양').reduce((s, c) => s + Number(c.credits), 0),
    free:       courses.filter(c => ['교양선택', '자유선택'].includes(c.category)).reduce((s, c) => s + Number(c.credits), 0),
  };

  /* ── 졸업요건 기반 표시 카테고리 ── */
  const availableCats = reqs ? [
    reqs.details.major_required.req   > 0 && '전공필수',
    reqs.details.major_elective.req   > 0 && '전공선택',
    reqs.details.basic_liberal.req    > 0 && '기초교양',
    reqs.details.convergence_lib?.req_credits > 0 && '융합(예술)',
    reqs.details.convergence_lib?.req_credits > 0 && '융합(사회)',
    reqs.details.convergence_lib?.req_credits > 0 && '융합(자연)',
    reqs.details.convergence_lib?.req_credits > 0 && '융합(세계)',
    reqs.details.area_liberal?.req    > 0 && '계열교양',
    '교양선택',   // DB 교선 과목 → 항상 포함
    '자유선택',
  ].filter(Boolean) : Object.keys(CLASS_MAP);

  /* ── 상단 통계 카드 ── */
  const STATS = reqs ? [
    { title: '총 이수 학점', value: `${earned.total}/${reqs.total_req_credits}`,              pct: Math.min(Math.round(earned.total      / (reqs.total_req_credits || 1) * 100), 100), icon: <GraduationCap size={15} color="white" />, bg: '#4F7CF3' },
    { title: '전공 필수',    value: `${earned.major_req}/${reqs.details.major_required.req}`,  pct: Math.min(Math.round(earned.major_req  / (reqs.details.major_required.req  || 1) * 100), 100), icon: <BookOpen size={15} color="white" />,      bg: '#2EC4B6' },
    { title: '전공 선택',    value: `${earned.major_elec}/${reqs.details.major_elective.req}`, pct: Math.min(Math.round(earned.major_elec / (reqs.details.major_elective.req  || 1) * 100), 100), icon: <Award size={15} color="white" />,         bg: '#A78BFA' },
    { title: '기초교양',     value: `${earned.basic_lib}/${reqs.details.basic_liberal.req}`,   pct: Math.min(Math.round(earned.basic_lib  / (reqs.details.basic_liberal.req   || 1) * 100), 100), icon: <TrendingUp size={15} color="white" />,    bg: '#F4D58D' },
    ...(reqs.details.convergence_lib?.req_credits > 0 ? [{
      title: '융합교양',
      value: `${earned.conv_areas}/3개 영역`,
      pct: Math.min(Math.round(earned.conv_areas / 3 * 100), 100),
      icon: <TrendingUp size={15} color="white" />, bg: '#F97316',
    }] : []),
    ...(reqs.details.area_liberal?.req > 0 ? [{
      title: '계열교양',
      value: `${earned.area}/${reqs.details.area_liberal.req}`,
      pct: Math.min(Math.round(earned.area / (reqs.details.area_liberal.req || 1) * 100), 100),
      icon: <TrendingUp size={15} color="white" />, bg: '#10B981',
    }] : []),
  ] : [];

  const addCourse = () => {
    if (!form.name.trim()) return;
    setCourses([...courses, { ...form, id: Date.now(), credits: Number(form.credits) }]);
    const firstCat = availableCats[0] || '전공필수';
    setForm({ name: '', credits: 3, grade: 'A+', category: firstCat, year: '2024', semester: '1' });
    setQuery('');
    setShowForm(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
      <p style={{ color: '#6B7280', fontSize: 14 }}>불러오는 중...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>수강내역 입력</h1>
          <p style={{ fontSize: 16, color: '#6B7280', margin: 0 }}>
            {reqs ? `졸업 최소 ${reqs.total_req_credits}학점 기준으로 이수 현황을 입력하세요` : '지금까지 이수한 과목과 학점을 입력하세요'}
          </p>
        </div>

        {/* 통계 카드 */}
        {reqs && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{stat.title}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>{stat.value}</div>
                <div style={{ height: 5, background: '#F3F4F6', borderRadius: 999, marginBottom: 4 }}>
                  <div style={{ height: 5, borderRadius: 999, background: stat.bg, width: stat.pct + '%', transition: 'width 0.4s' }} />
                </div>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{stat.pct}% 완료</p>
              </div>
            ))}
          </div>
        )}

        {!reqs && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#92400E' }}>
            ⚠️ 졸업요건 데이터가 없습니다. 관리자에게 문의하거나 수강내역 저장 후 대시보드에서 확인하세요.
          </div>
        )}

        {/* 과목 추가 폼 */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 20, marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 14 }}>과목 추가</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

              {/* 과목명 — 자동완성 */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 5, position: 'relative' }} ref={suggRef}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>과목명 *</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    style={{ ...inp, paddingLeft: 30 }}
                    type="text"
                    placeholder="과목명 검색 (자동완성)"
                    value={query}
                    onChange={e => handleQueryChange(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                  />
                </div>
                {showSugg && suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'white', border: '1px solid #E8F0FF', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', marginTop: 2 }}>
                    {suggestions.map((c, i) => (
                      <div
                        key={i}
                        onMouseDown={() => selectSuggestion(c)}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #F3F4F6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F0F4FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{c.course_name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>{c.course_code} {c.professor ? `· ${c.professor}` : ''}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                          <span style={{ fontSize: 11, background: CAT_COLOR[TO_CAT[c.classification]] ? '#F0F4FF' : '#F3F4F6', color: CAT_COLOR[TO_CAT[c.classification]] || '#6B7280', padding: '2px 8px', borderRadius: 999 }}>
                            {TO_CAT[c.classification] ?? c.classification}
                          </span>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6B7280' }}>{c.credits}학점</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 학점 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>학점</label>
                <input style={inp} type="number" min="1" max="4" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} />
              </div>

              {/* 성적 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>성적</label>
                <select style={inp} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              {/* 이수 구분 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>이수 구분</label>
                <select style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {availableCats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* 년도 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>년도</label>
                <select style={inp} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                  {['2020','2021','2022','2023','2024','2025'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* 학기 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>학기</label>
                <select style={inp} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                  <option value="1">1학기</option>
                  <option value="2">2학기</option>
                </select>
              </div>
            </div>

            {/* 자동완성으로 채워졌을 때 안내 */}
            {form.name && (
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: '10px 0 0' }}>
                💡 학점·이수구분은 자동완성 시 자동으로 채워집니다. 필요하면 직접 수정하세요.
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => { setShowForm(false); setQuery(''); setShowSugg(false); }} style={{ flex: 1, borderRadius: 10, border: '1px solid #E8F0FF', padding: '11px', fontSize: 13, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>취소</button>
              <button onClick={addCourse} style={{ flex: 1, borderRadius: 10, background: '#4F7CF3', padding: '11px', fontSize: 13, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>추가하기</button>
            </div>
          </div>
        )}

        {/* 과목 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {courses.length === 0 && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E8F0FF', padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              아직 입력된 수강내역이 없습니다. 과목을 추가해주세요.
            </div>
          )}
          {courses.map(c => (
            <div key={c.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #E8F0FF', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 4, height: 32, borderRadius: 999, background: CAT_COLOR[c.category] || '#9CA3AF', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 3px', fontSize: 14 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{c.year}년 {c.semester}학기 · {c.category} · {c.credits}학점</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#4F7CF3' }}>{c.grade}</span>
                <button onClick={() => setCourses(courses.filter(x => x.id !== c.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', padding: 4 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => { setShowForm(true); setQuery(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid #E8F0FF', background: 'white', padding: '11px 18px', fontSize: 13, color: '#4F7CF3', fontWeight: 500, cursor: 'pointer', ...s }}>
            <Plus size={15} /> 과목 추가
          </button>
          <button
            onClick={async () => {
              if (courses.length === 0) { alert('수강내역을 입력해주세요.'); return; }
              try {
                await api.post('/api/users/me/graduation/history', {
                  courses: courses.map(c => ({
                    course_code: c.name.replace(/\s+/g, '_').toUpperCase(),
                    course_name: c.name,
                    classification: CLASS_MAP[c.category] ?? c.category,
                    credits: Number(c.credits),
                  })),
                });
                navigate('/graduation/dashboard');
              } catch (err) {
                alert(err.response?.data?.error?.reason || '저장 중 오류가 발생했습니다.');
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', ...s }}>
            졸업 요건 확인하기 <ArrowRight size={15} />
          </button>
        </div>
      </main>
    </div>
  );
}
