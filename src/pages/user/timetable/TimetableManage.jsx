import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../../components/ui/GachonLogo';
import { ArrowRight, LayoutDashboard, Trash2, Edit, Plus } from 'lucide-react';

const SAVED = [
  { id: 1, name: '2025-1학기 시간표 Plan A', credits: 14, count: 5, date: '2025.01.15', courses: [
    { id: 1, name: '자료구조', professor: '김교수', day: '월', time: '10:00-12:00', room: '공학관 301', credits: 3 },
    { id: 2, name: '알고리즘', professor: '이교수', day: '화', time: '13:00-15:00', room: 'AI공학관 201', credits: 3 },
    { id: 3, name: '운영체제', professor: '박교수', day: '목', time: '10:00-12:00', room: '공학관 402', credits: 3 },
    { id: 4, name: '영어회화', professor: 'Smith', day: '수', time: '14:00-15:00', room: '글로벌센터 201', credits: 2 },
    { id: 5, name: '프로젝트', professor: '최교수', day: '금', time: '13:00-16:00', room: '공학관 501', credits: 3 },
  ]},
];
const COLORS = ['#4F7CF3', '#2EC4B6', '#A78BFA', '#d4a017', '#ef4444'];

export default function TimetableManage() {
  const [plans, setPlans] = useState(SAVED);
  const [expanded, setExpanded] = useState(1);
  const s = { fontFamily: 'Pretendard, sans-serif' };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/timetable/setup" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#4F7CF3', textDecoration: 'none', fontWeight: 500 }}>
            <Plus size={14} />새 시간표 만들기
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <LayoutDashboard size={26} color="#4F7CF3" /> 시간표 관리 대시보드
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>생성된 시간표를 조회, 수정, 삭제할 수 있어요</p>
        </div>

        {plans.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 15 }}>저장된 시간표가 없습니다</p>
            <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              시간표 만들기 <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 4px', fontSize: 15 }}>{plan.name}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>총 {plan.credits}학점 · {plan.count}과목 · {plan.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to="/timetable/setup" onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: '1px solid #E8F0FF', padding: '7px 12px', fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
                      <Edit size={13} />수정
                    </Link>
                    <button onClick={e => { e.stopPropagation(); setPlans(p => p.filter(x => x.id !== plan.id)); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: '1px solid #fecaca', padding: '7px 12px', fontSize: 13, color: '#ef4444', background: 'white', cursor: 'pointer', ...s }}>
                      <Trash2 size={13} />삭제
                    </button>
                  </div>
                </div>
                {expanded === plan.id && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.courses.map((course, i) => (
                      <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, background: '#F9FAFB', padding: '10px 14px' }}>
                        <div style={{ width: 5, height: 28, borderRadius: 999, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', margin: '0 0 2px' }}>{course.name}</p>
                          <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{course.professor} · {course.room}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 12, fontWeight: 500, color: '#1F2937', margin: '0 0 1px' }}>{course.day}요일 {course.time}</p>
                          <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{course.credits}학점</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
            새 시간표 만들기 <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}