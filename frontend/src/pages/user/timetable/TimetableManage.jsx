import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../../components/ui/GachonLogo';
import { ArrowRight, ArrowLeft, LayoutDashboard, Trash2, Edit, Check, X } from 'lucide-react';
import useTimetableStore from '../../../store/timetableStore';

const COLORS = ['#8FA8FF', '#8EDDD0', '#C3B5FF', '#F7CFA1', '#F4AFCF'];

function TimetableGrid({ courses }) {
  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 22;
  const hourHeight = 48;
  const getTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #E8F0FF', boxShadow: '0 4px 16px rgba(79,124,243,0.08)', marginBottom: 20 }}>
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

export default function TimetableManage() {
  const confirmedPlans = useTimetableStore((state) => state.confirmedPlans);
  const updateConfirmedPlan = useTimetableStore((state) => state.updateConfirmedPlan);
  const deleteConfirmedPlan = useTimetableStore((state) => state.deleteConfirmedPlan);
  const [selectedId, setSelectedId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const s = { fontFamily: 'Pretendard, sans-serif' };
  const inp = {
    borderRadius: 8,
    border: '1px solid #E8F0FF',
    padding: '8px 11px',
    fontSize: 13,
    outline: 'none',
    background: '#FAFBFF',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'Pretendard, sans-serif',
  };

  const activePlan = confirmedPlans.find(p => p.id === selectedId) || confirmedPlans[0] || null;
  const courses = activePlan?.courses || [];
  const total = courses.reduce((sum, c) => sum + Number(c.credits), 0);

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setEditForm({ ...course });
  };

  const handleSaveEdit = () => {
    updateConfirmedPlan(
      activePlan.id,
      courses.map(c =>
        c.id === editingCourse
          ? { ...editForm, id: c.id, credits: Number(editForm.credits) }
          : c
      )
    );
    setEditingCourse(null);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditForm({});
  };

  const handleDeletePlan = () => {
    deleteConfirmedPlan(activePlan.id);
    setDeleteConfirm(false);
    setSelectedId(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>


      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>

        {/* 페이지 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <LayoutDashboard size={26} color="#4F7CF3" /> 시간표 관리 대시보드
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>생성된 시간표를 조회, 수정, 삭제할 수 있어요</p>
        </div>

        {/* 시간표 없을 때 */}
        {confirmedPlans.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '80px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <LayoutDashboard size={48} color="#BFD4FF" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#6B7280', marginBottom: 8, fontSize: 15, fontWeight: 500 }}>아직 확정된 시간표가 없습니다</p>
            <p style={{ color: '#9CA3AF', margin: 0, fontSize: 13 }}>시간표를 생성하고 플랜을 확정하면 여기서 관리할 수 있어요</p>
          </div>
        ) : (
          <>
            {/* 시간표 탭 */}
            {confirmedPlans.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {confirmedPlans.map((plan) => {
                  const isActive = activePlan?.id === plan.id;
                  return (
                    <button key={plan.id} onClick={() => { setSelectedId(plan.id); setEditingCourse(null); }}
                      style={{ padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: isActive ? 'none' : '1px solid #E8F0FF', background: isActive ? '#4F7CF3' : 'white', color: isActive ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
                      {plan.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 시간표 그리드 */}
            <TimetableGrid courses={courses} />

            {/* 시간표 카드 */}
            {activePlan && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                {/* 카드 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #F3F4F6', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1F2937', margin: '0 0 4px', fontSize: 16 }}>{activePlan.name}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>총 {total}학점 · {courses.length}과목 · {activePlan.date || '2025.01.15'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {deleteConfirm ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>정말 삭제할까요?</span>
                        <button onClick={handleDeletePlan}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 8, background: '#ef4444', padding: '7px 12px', fontSize: 12, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', ...s }}>
                          <Check size={12} /> 확인
                        </button>
                        <button onClick={() => setDeleteConfirm(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 8, border: '1px solid #E8F0FF', padding: '7px 12px', fontSize: 12, color: '#6B7280', background: 'white', cursor: 'pointer', ...s }}>
                          <X size={12} /> 취소
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: '1px solid #fecaca', padding: '8px 14px', fontSize: 13, color: '#ef4444', background: 'white', cursor: 'pointer', ...s }}>
                        <Trash2 size={13} /> 삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* 강의 목록 */}
                <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {courses.map((course) => (
                    <div key={course.id} style={{ borderRadius: 12, background: editingCourse === course.id ? '#F0F4FF' : '#F9FAFB', border: `1px solid ${editingCourse === course.id ? '#BFD4FF' : '#F0F0F0'}`, padding: '14px 16px', transition: 'all 0.15s' }}>

                      {/* 수정 폼 */}
                      {editingCourse === course.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#4F7CF3', marginBottom: 2 }}>강의 정보 수정</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>강의명</label>
                              <input style={inp} value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>담당 교수</label>
                              <input style={inp} value={editForm.professor || ''} onChange={e => setEditForm({ ...editForm, professor: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>강의실</label>
                              <input style={inp} value={editForm.room || ''} onChange={e => setEditForm({ ...editForm, room: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>학점</label>
                              <input style={inp} type="number" min="1" max="6" value={editForm.credits || ''} onChange={e => setEditForm({ ...editForm, credits: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>요일</label>
                              <select style={inp} value={editForm.day || '월'} onChange={e => setEditForm({ ...editForm, day: e.target.value })}>
                                {['월', '화', '수', '목', '금'].map(d => <option key={d} value={d}>{d}요일</option>)}
                              </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>수업 시간</label>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input style={{ ...inp, textAlign: 'center' }} value={editForm.start || ''} onChange={e => setEditForm({ ...editForm, start: e.target.value })} placeholder="09:00" />
                                <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>~</span>
                                <input style={{ ...inp, textAlign: 'center' }} value={editForm.end || ''} onChange={e => setEditForm({ ...editForm, end: e.target.value })} placeholder="11:00" />
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
                            <button onClick={handleCancelEdit}
                              style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #E8F0FF', background: 'white', fontSize: 13, color: '#6B7280', cursor: 'pointer', ...s }}>
                              취소
                            </button>
                            <button onClick={handleSaveEdit}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#4F7CF3', border: 'none', fontSize: 13, color: 'white', fontWeight: 600, cursor: 'pointer', ...s }}>
                              <Check size={14} /> 저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* 강의 정보 표시 */
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 5, height: 36, borderRadius: 999, background: COLORS[course.id % COLORS.length], flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', margin: '0 0 3px' }}>{course.name}</p>
                              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{course.professor} · {course.room}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', margin: '0 0 2px' }}>{course.day}요일 {course.start}-{course.end}</p>
                              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{course.credits}학점</p>
                            </div>
                            <button onClick={() => handleEditCourse(course)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="수정">
                              <Edit size={15} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
            새 시간표 만들기 <ArrowRight size={16} />
          </Link>
        </div>

      </main>
    </div>
  );
}