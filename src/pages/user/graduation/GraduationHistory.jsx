import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GachonLogo } from '../../../components/ui/GachonLogo';
import { ArrowRight, Plus, Trash2, BookOpen, GraduationCap, Award, TrendingUp } from 'lucide-react';

const CATS = ['전공필수', '전공선택', '교양필수', '교양선택', '자유선택'];
const GRADES = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F', 'P', 'NP'];
const CAT_COLOR = { '전공필수': '#4F7CF3', '전공선택': '#2EC4B6', '교양필수': '#A78BFA', '교양선택': '#d4a017', '자유선택': '#6B7280' };

export default function GraduationHistory() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: '자료구조', credits: 3, grade: 'A+', category: '전공필수', year: '2023', semester: '1' },
    { id: 2, name: '알고리즘', credits: 3, grade: 'A0', category: '전공필수', year: '2023', semester: '2' },
    { id: 3, name: '영어회화', credits: 2, grade: 'B+', category: '교양필수', year: '2022', semester: '1' },
    { id: 4, name: '일반물리학', credits: 3, grade: 'B0', category: '전공필수', year: '2022', semester: '2' },
    { id: 5, name: '창의적사고와표현', credits: 2, grade: 'A+', category: '교양필수', year: '2021', semester: '1' },
  ]);
  const [form, setForm] = useState({ name: '', credits: 3, grade: 'A+', category: '전공필수', year: '2024', semester: '1' });
  const [showForm, setShowForm] = useState(false);
  const [studentInfo, setStudentInfo] = useState({ department: '컴퓨터공학과', year: '3', requirements: { majorRequired: 60, majorElective: 30, general: 40 } });
  const [completed, setCompleted] = useState({ majorRequired: 42, majorElective: 18, general: 35 });

  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 10, border: '1px solid #E8F0FF', padding: '9px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', ...s };
  const total = courses.reduce((sum, c) => sum + Number(c.credits), 0);

  const addCourse = () => {
    if (!form.name.trim()) return;
    setCourses([...courses, { ...form, id: Date.now(), credits: Number(form.credits) }]);
    setForm({ name: '', credits: 3, grade: 'A+', category: '전공필수', year: '2024', semester: '1' });
    setShowForm(false);
  };

  // v0 stats
  const STATS = [
    { title: '총 이수 학점', value: total + '학점', pct: Math.round(total / 130 * 100), icon: <GraduationCap size={16} color="white" />, bg: '#4F7CF3' },
    { title: '전공 필수', value: completed.majorRequired + '/' + studentInfo.requirements.majorRequired + '학점', pct: Math.round(completed.majorRequired / studentInfo.requirements.majorRequired * 100), icon: <BookOpen size={16} color="white" />, bg: '#2EC4B6' },
    { title: '전공 선택', value: completed.majorElective + '/' + studentInfo.requirements.majorElective + '학점', pct: Math.round(completed.majorElective / studentInfo.requirements.majorElective * 100), icon: <Award size={16} color="white" />, bg: '#A78BFA' },
    { title: '교양', value: completed.general + '/' + studentInfo.requirements.general + '학점', pct: Math.round(completed.general / studentInfo.requirements.general * 100), icon: <TrendingUp size={16} color="white" />, bg: '#d4a017' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/graduation/dashboard" style={{ fontSize: 14, color: '#4F7CF3', textDecoration: 'none', fontWeight: 500 }}>
            졸업 요건 확인 →
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>기수강 내역 입력</h1>
          <p style={{ fontSize: 16, color: '#6B7280', margin: 0 }}>지금까지 이수한 과목과 학점을 입력하세요</p>
        </div>

        {/* Stats Grid — v0 디자인 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 18px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{stat.title}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>{stat.value}</div>
              <div style={{ height: 5, background: '#F3F4F6', borderRadius: 999, marginBottom: 4 }}>
                <div style={{ height: 5, borderRadius: 999, background: stat.bg, width: Math.min(stat.pct, 100) + '%' }} />
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{stat.pct}% 완료</p>
            </div>
          ))}
        </div>

        {/* 학생 정보 + 졸업 요건 설정 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={15} color="#4F7CF3" /> 학생 정보
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, color: '#6B7280' }}>학과</label>
                <input style={inp} value={studentInfo.department} onChange={e => setStudentInfo({ ...studentInfo, department: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, color: '#6B7280' }}>학년</label>
                <select style={inp} value={studentInfo.year} onChange={e => setStudentInfo({ ...studentInfo, year: e.target.value })}>
                  {['1', '2', '3', '4'].map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={15} color="#4F7CF3" /> 졸업 요건 설정
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: '전공 필수', key: 'majorRequired' },
                { label: '전공 선택', key: 'majorElective' },
                { label: '교양', key: 'general' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</label>
                  <input style={inp} type="number" min="0" value={studentInfo.requirements[item.key]}
                    onChange={e => setStudentInfo({ ...studentInfo, requirements: { ...studentInfo.requirements, [item.key]: Number(e.target.value) } })} />
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>필요 학점</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 이수 학점 입력 카드 */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={15} color="#4F7CF3" /> 이수 학점 입력
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: '전공 필수 이수', key: 'majorRequired', color: '#4F7CF3' },
              { label: '전공 선택 이수', key: 'majorElective', color: '#2EC4B6' },
              { label: '교양 이수', key: 'general', color: '#A78BFA' },
            ].map(item => (
              <div key={item.key} style={{ borderRadius: 10, border: '1px solid #E8F0FF', padding: '14px 16px' }}>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 4px' }}>{item.label}</p>
                <input style={{ ...inp, fontSize: 20, fontWeight: 700, color: item.color, border: 'none', padding: '4px 0', background: 'transparent' }}
                  type="number" min="0" value={completed[item.key]}
                  onChange={e => setCompleted({ ...completed, [item.key]: Number(e.target.value) })} />
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>현재 이수 학점</p>
              </div>
            ))}
          </div>
        </div>

        {/* 과목 추가 폼 */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 20, marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 14 }}>과목 추가</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>과목명 *</label>
                <input style={inp} type="text" placeholder="과목명 입력" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>학점</label>
                <input style={inp} type="number" min="1" max="4" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>성적</label>
                <select style={inp} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>이수 구분</label>
                <select style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>년도</label>
                <select style={inp} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                  {['2021', '2022', '2023', '2024', '2025'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>학기</label>
                <select style={inp} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                  <option value="1">1학기</option>
                  <option value="2">2학기</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, borderRadius: 10, border: '1px solid #E8F0FF', padding: '11px', fontSize: 13, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>취소</button>
              <button onClick={addCourse} style={{ flex: 1, borderRadius: 10, background: '#4F7CF3', padding: '11px', fontSize: 13, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>추가하기</button>
            </div>
          </div>
        )}

        {/* 과목 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
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
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid #E8F0FF', background: 'white', padding: '11px 18px', fontSize: 13, color: '#4F7CF3', fontWeight: 500, cursor: 'pointer', ...s }}>
            <Plus size={15} /> 과목 추가
          </button>
          <button onClick={() => navigate('/graduation/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', ...s }}>
            졸업 요건 확인하기 <ArrowRight size={15} />
          </button>
        </div>
      </main>
    </div>
  );
}