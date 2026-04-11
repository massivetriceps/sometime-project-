import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { CheckCircle2, ArrowRight, Download, Share2, RotateCcw, Edit } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';

const COLORS = ['#8FA8FF', '#8EDDD0', '#C3B5FF', '#F7CFA1', '#F4AFCF'];

const INIT_PLANS = {
  A: {
    courses: [
      { id: 1, name: '자료구조', professor: '김교수', day: '월', start: '10:00', end: '12:00', room: '공학관 301', credits: 3 },
      { id: 2, name: '알고리즘', professor: '이교수', day: '화', start: '13:00', end: '15:00', room: 'AI공학관 201', credits: 3 },
      { id: 3, name: '운영체제', professor: '박교수', day: '목', start: '10:00', end: '12:00', room: '공학관 402', credits: 3 },
      { id: 4, name: '영어회화', professor: 'Smith', day: '수', start: '14:00', end: '15:00', room: '글로벌센터 201', credits: 2 },
      { id: 5, name: '프로젝트', professor: '최교수', day: '금', start: '13:00', end: '16:00', room: '공학관 501', credits: 3 },
    ],
    comment: '수요일 공강이 확보되었으며, 부족했던 전공 필수 3학점을 채우고 아침 수업을 피한 완벽한 시간표입니다.',
  },
  B: {
    courses: [
      { id: 1, name: '컴퓨터네트워크', professor: '김교수', day: '월', start: '13:00', end: '15:00', room: 'AI공학관 305', credits: 3 },
      { id: 2, name: '데이터베이스', professor: '정교수', day: '화', start: '10:00', end: '12:00', room: '공학관 201', credits: 3 },
      { id: 3, name: '소프트웨어공학', professor: '한교수', day: '수', start: '10:00', end: '12:00', room: '공학관 501', credits: 3 },
      { id: 4, name: '영어회화', professor: 'Smith', day: '목', start: '14:00', end: '15:00', room: '글로벌센터 201', credits: 2 },
      { id: 5, name: '자료구조', professor: '김교수', day: '금', start: '10:00', end: '12:00', room: '공학관 301', credits: 3 },
    ],
    comment: '화요일과 목요일에 수업이 집중되어 월·수·금 공강에 가까운 일정입니다. 동선이 최소화되어 같은 건물 내 이동이 많습니다.',
  },
  C: {
    courses: [
      { id: 1, name: '알고리즘', professor: '이교수', day: '월', start: '09:00', end: '11:00', room: 'AI공학관 201', credits: 3 },
      { id: 2, name: '운영체제', professor: '박교수', day: '화', start: '13:00', end: '15:00', room: '공학관 402', credits: 3 },
      { id: 3, name: '영어회화', professor: 'Smith', day: '수', start: '14:00', end: '15:00', room: '글로벌센터 201', credits: 2 },
      { id: 4, name: '컴퓨터네트워크', professor: '김교수', day: '목', start: '10:00', end: '12:00', room: 'AI공학관 305', credits: 3 },
      { id: 5, name: '프로젝트', professor: '최교수', day: '금', start: '13:00', end: '16:00', room: '공학관 501', credits: 3 },
    ],
    comment: '전체적으로 오전 수업이 적고, 수업 간 여유 시간이 충분합니다. AI공학관 이동이 일부 포함되지만 연강이 없어 체력 소모가 적은 시간표입니다.',
  },
};

function TimetableGrid({ courses }) {
  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 19;
  const hourHeight = 48;
  const getTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #E8F0FF', boxShadow: '0 4px 16px rgba(79,124,243,0.08)', marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(5, 1fr)', marginBottom: 4 }}>
        <div style={{ height: 32 }} />
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#4F7CF3', lineHeight: '32px', background: '#F0F4FF', borderRadius: 6, margin: '0 2px' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(5, 1fr)', position: 'relative', height: (endHour - startHour) * hourHeight }}>
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', top: i * hourHeight - 8, width: 32, fontSize: 10, color: '#9CA3AF', textAlign: 'right', paddingRight: 4 }}>{startHour + i}</div>
            <div style={{ position: 'absolute', top: i * hourHeight, height: 1, left: 36, right: 0, background: '#F3F4F6' }} />
          </React.Fragment>
        ))}
        <div style={{ position: 'absolute', inset: 0, left: 36, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: '100%' }}>
          {days.map(day => (
            <div key={day} style={{ position: 'relative', height: '100%', borderLeft: '1px solid #F3F4F6' }}>
              {courses.filter(c => c.day === day).map((course, i) => {
                const top = (getTime(course.start) - startHour) * hourHeight;
                const height = (getTime(course.end) - getTime(course.start)) * hourHeight;
                const color = COLORS[course.id % COLORS.length];
                return (
                  <div key={i} style={{ position: 'absolute', left: 3, right: 3, top, height, backgroundColor: color, borderRadius: 8, padding: '6px 8px', overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 2, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{course.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{course.room}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #F3F4F6', fontSize: 10, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
        <span>사회봉사1 (P/NP)</span>
        <span>Gachon Univ.</span>
      </div>
    </div>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const { confirmPlan } = useTimetable();
  const [plans, setPlans] = useState(INIT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState('A');
  const [deletedPlans, setDeletedPlans] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({});

  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = { borderRadius: 8, border: '1px solid #E8F0FF', padding: '7px 10px', fontSize: 13, outline: 'none', background: '#FAFBFF', width: '100%', boxSizing: 'border-box', ...s };

  const availablePlans = ['A', 'B', 'C'].filter(p => !deletedPlans.includes(p));
  const currentPlan = plans[selectedPlan];
  const courses = currentPlan?.courses || [];
  const total = courses.reduce((sum, c) => sum + c.credits, 0);

  const handleDeletePlan = (plan) => {
    const remaining = availablePlans.filter(p => p !== plan);
    if (remaining.length === 0) return;
    setDeletedPlans([...deletedPlans, plan]);
    if (selectedPlan === plan) setSelectedPlan(remaining[0]);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setEditForm({ ...course });
  };

  const handleSaveEdit = () => {
    setPlans(prev => ({
      ...prev,
      [selectedPlan]: {
        ...prev[selectedPlan],
        courses: prev[selectedPlan].courses.map(c =>
          c.id === editingCourse ? { ...editForm, id: c.id, credits: Number(editForm.credits) } : c
        ),
      },
    }));
    setEditingCourse(null);
  };

  const handleConfirm = () => {
    confirmPlan({
      courses,
      label: selectedPlan,
      name: `2025-1학기 시간표 Plan ${selectedPlan}`,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''),
    });
    navigate('/timetable/manage');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 10, border: '1px solid #E8F0FF', padding: '8px 12px', fontSize: 13, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>
              <Download size={14} /> 저장
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 10, border: '1px solid #E8F0FF', padding: '8px 12px', fontSize: 13, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>
              <Share2 size={14} /> 공유
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>

        {/* 완료 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#d1faf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#2EC4B6" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: 0 }}>최적화 시간표 생성 완료!</h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>조건에 맞는 3개의 플랜을 준비했어요. 가장 마음에 드는 플랜을 선택하세요.</p>
          </div>
        </div>

        {/* Plan 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {availablePlans.map(plan => (
            <div key={plan} style={{ flex: 1, position: 'relative' }}>
              <button onClick={() => setSelectedPlan(plan)}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700, border: selectedPlan === plan ? 'none' : '1px solid #E8F0FF', background: selectedPlan === plan ? '#4F7CF3' : 'white', color: selectedPlan === plan ? 'white' : '#6B7280', cursor: 'pointer', boxShadow: selectedPlan === plan ? '0 4px 12px rgba(79,124,243,0.35)' : 'none', ...s }}>
                Plan {plan}
              </button>
              {availablePlans.length > 1 && (
                <button onClick={() => handleDeletePlan(plan)}
                  style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>×</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* AI 코멘트 */}
        <div style={{ background: '#E8F0FF', borderRadius: 14, border: '1px solid #BFD4FF', padding: 18, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#4F7CF3', marginBottom: 6 }}>✨ AI 맞춤 코멘트 (Plan {selectedPlan})</p>
          <p style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.6, margin: 0 }}>{currentPlan?.comment}</p>
        </div>

        {/* 시간표 그리드 */}
        <TimetableGrid courses={courses} />

        {/* 요약 */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', padding: '14px 18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#6B7280' }}>Plan {selectedPlan} 요약</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>총 {total}학점 · {courses.length}과목</span>
        </div>

        {/* 강의 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {courses.map((course, i) => (
            <div key={course.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px' }}>
              {editingCourse === course.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>강의명</label>
                      <input style={inp} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>교수</label>
                      <input style={inp} value={editForm.professor} onChange={e => setEditForm({ ...editForm, professor: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>강의실</label>
                      <input style={inp} value={editForm.room} onChange={e => setEditForm({ ...editForm, room: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>학점</label>
                      <input style={inp} type="number" value={editForm.credits} onChange={e => setEditForm({ ...editForm, credits: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>요일</label>
                      <select style={inp} value={editForm.day} onChange={e => setEditForm({ ...editForm, day: e.target.value })}>
                        {['월', '화', '수', '목', '금'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#6B7280' }}>시간</label>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <input style={inp} value={editForm.start} onChange={e => setEditForm({ ...editForm, start: e.target.value })} placeholder="09:00" />
                        <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>~</span>
                        <input style={inp} value={editForm.end} onChange={e => setEditForm({ ...editForm, end: e.target.value })} placeholder="11:00" />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingCourse(null)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #E8F0FF', background: 'white', fontSize: 13, color: '#6B7280', cursor: 'pointer', ...s }}>취소</button>
                    <button onClick={handleSaveEdit} style={{ padding: '7px 14px', borderRadius: 8, background: '#4F7CF3', border: 'none', fontSize: 13, color: 'white', fontWeight: 600, cursor: 'pointer', ...s }}>저장</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 5, height: 36, borderRadius: 999, background: COLORS[course.id % COLORS.length], flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 3px', fontSize: 14 }}>{course.name}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{course.professor} · {course.room}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', margin: '0 0 2px' }}>{course.day}요일 {course.start}-{course.end}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{course.credits}학점</p>
                    </div>
                    <button onClick={() => handleEditCourse(course)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                      <Edit size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/timetable/setup" style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 12, border: '1px solid #E8F0FF', background: 'white', padding: '11px 18px', fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
            <RotateCcw size={14} /> 조건 다시 설정
          </Link>
          <button onClick={handleConfirm}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', fontFamily: 'Pretendard, sans-serif' }}>
            Plan {selectedPlan}으로 확정 <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}