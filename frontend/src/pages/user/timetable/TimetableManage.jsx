import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, Trash2, Check, X, MessageSquare, Loader, Plus, Search } from 'lucide-react';
import api from '../../../api/axios';

const COLORS = ['#8FA8FF', '#8EDDD0', '#C3B5FF', '#F7CFA1', '#F4AFCF'];

// 교시 → 시간 변환 (1교시=09:00, 2교시=10:00, ...)
const periodToTime = (period) => `${String(8 + period).padStart(2, '0')}:00`;
const periodToEndTime = (period) => `${String(8 + period).padStart(2, '0')}:50`;

// API 코스 데이터 → 그리드용 코스 배열 변환
const toGridCourses = (courses) =>
  courses.flatMap((c, idx) =>
    (c.schedules || []).map((s) => ({
      id: c.course_id,
      colorIdx: idx,
      name: c.course_name,
      professor: c.professor,
      credits: c.credits,
      day: s.day_of_week,
      start: periodToTime(s.start_period),
      end: periodToEndTime(s.end_period),
      room: s.room_name || s.building || '',
    }))
  );

function TimetableGrid({ courses }) {
  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 24;
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
                const height = Math.max((getTime(course.end) - getTime(course.start)) * hourHeight, 24);
                const color = COLORS[course.colorIdx % COLORS.length];
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
    </div>
  );
}

export default function TimetableManage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [aiComment, setAiComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [removingCourseId, setRemovingCourseId] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingCourseId, setAddingCourseId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const searchRef = useRef(null);

  const s = { fontFamily: 'Pretendard, sans-serif' };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/me/timetables');
      if (res.data.resultType === 'SUCCESS') {
        const data = res.data.success;
        setTimetables(data);
        if (data.length > 0) setSelectedId(data[0].timetable_id);
      }
    } catch (err) {
      console.error('시간표 조회 실패', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!activePlan) return;
    try {
      await api.delete(`/api/users/me/timetables/${activePlan.timetable_id}`);
      const updated = timetables.filter(t => t.timetable_id !== activePlan.timetable_id);
      setTimetables(updated);
      setSelectedId(updated[0]?.timetable_id ?? null);
      setDeleteConfirm(false);
      setAiComment('');
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      alert(reason || '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveCourse = async (courseId) => {
    if (!activePlan) return;
    setRemovingCourseId(courseId);
    try {
      await api.put(`/api/users/me/timetables/${activePlan.timetable_id}`, {
        remove: [courseId],
      });
      setTimetables(prev =>
        prev.map(t =>
          t.timetable_id === activePlan.timetable_id
            ? { ...t, courses: t.courses.filter(c => c.course_id !== courseId) }
            : t
        )
      );
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      alert(reason || '강의 제거 중 오류가 발생했습니다.');
    } finally {
      setRemovingCourseId(null);
    }
  };

  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/api/courses?keyword=${encodeURIComponent(keyword)}`);
      if (res.data.resultType === 'SUCCESS') setSearchResults(res.data.success.slice(0, 20));
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  const handleAddCourse = async (courseId) => {
    if (!activePlan) return;
    setAddingCourseId(courseId);
    try {
      await api.put(`/api/users/me/timetables/${activePlan.timetable_id}`, { add: [courseId] });
      const res = await api.get('/api/users/me/timetables');
      if (res.data.resultType === 'SUCCESS') setTimetables(res.data.success);
      setSearchResults(prev => prev.filter(c => c.course_id !== courseId));
    } catch (err) {
      alert(err.response?.data?.error?.reason || '추가 중 오류가 발생했습니다.');
    } finally {
      setAddingCourseId(null);
    }
  };

  const handleConfirm = async () => {
    if (!activePlan) return;
    setConfirming(true);
    try {
      const res = await api.post(`/api/users/me/timetables/${activePlan.timetable_id}/confirm`);
      if (res.data.resultType === 'SUCCESS') {
        const { added_count } = res.data.success;
        alert(`이번 학기 시간표로 확정되었습니다.\n수강내역에 ${added_count}개 과목이 추가되었습니다.`);
        setTimetables(prev => prev.map(t => ({
          ...t,
          is_selected: t.timetable_id === activePlan.timetable_id,
        })));
      }
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      alert(reason || '확정 중 오류가 발생했습니다.');
    } finally {
      setConfirming(false);
    }
  };

  const handleLoadComment = async () => {
    if (!activePlan) return;
    setLoadingComment(true);
    try {
      const res = await api.get(`/api/users/me/timetables/${activePlan.timetable_id}/comment`);
      if (res.data.resultType === 'SUCCESS') {
        setAiComment(res.data.success.ai_comment || '아직 AI 코멘트가 없습니다.');
      }
    } catch (err) {
      console.error('AI 코멘트 조회 실패', err);
    } finally {
      setLoadingComment(false);
    }
  };

  const activePlan = timetables.find(t => t.timetable_id === selectedId) || timetables[0] || null;
  const gridCourses = activePlan ? toGridCourses(activePlan.courses) : [];
  const total = activePlan?.courses.reduce((sum, c) => sum + Number(c.credits), 0) ?? 0;
  // 시간 미배정 과목 (스케줄 없는 과목 — 사회봉사 등)
  const noScheduleCourses = activePlan?.courses.filter(c => !c.schedules || c.schedules.length === 0) ?? [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
        <p style={{ color: '#6B7280', fontSize: 14 }}>시간표를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <LayoutDashboard size={26} color="#4F7CF3" /> 시간표 관리 대시보드
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>생성된 시간표를 조회, 수정, 삭제할 수 있어요</p>
        </div>

        {timetables.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '80px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <LayoutDashboard size={48} color="#BFD4FF" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#6B7280', marginBottom: 8, fontSize: 15, fontWeight: 500 }}>아직 생성된 시간표가 없습니다</p>
            <p style={{ color: '#9CA3AF', margin: 0, fontSize: 13 }}>시간표를 생성하면 여기서 관리할 수 있어요</p>
          </div>
        ) : (
          <>
            {/* 플랜 탭 */}
            {timetables.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {timetables.map((t) => {
                  const isActive = activePlan?.timetable_id === t.timetable_id;
                  return (
                    <button key={t.timetable_id}
                      onClick={() => { setSelectedId(t.timetable_id); setDeleteConfirm(false); setAiComment(''); }}
                      style={{ padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: isActive ? 'none' : '1px solid #E8F0FF', background: isActive ? '#4F7CF3' : 'white', color: isActive ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
                      플랜 {t.plan_type}
                      {t.grade && t.semester && (
                        <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.85 }}>({t.grade}학년 {t.semester}학기)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <TimetableGrid courses={gridCourses} />

            {noScheduleCourses.length > 0 && (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', margin: '0 0 10px' }}>시간 미배정 과목</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {noScheduleCourses.map(c => (
                    <div key={c.course_id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#F3F4F6', borderRadius: 20, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#374151' }}>{c.course_name}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 11 }}>{c.credits}학점</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePlan && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                {/* 카드 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #F3F4F6', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1F2937', margin: '0 0 4px', fontSize: 16 }}>
                      플랜 {activePlan.plan_type}
                      {activePlan.grade && activePlan.semester && (
                        <span style={{ marginLeft: 8, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                          {activePlan.grade}학년 {activePlan.semester}학기
                        </span>
                      )}
                      {activePlan.optimization_score != null && (
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#4F7CF3', background: '#E8F0FF', padding: '2px 8px', borderRadius: 999 }}>
                          점수 {activePlan.optimization_score}
                        </span>
                      )}
                    </p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                      총 {total}학점 · {activePlan.courses.length}과목
                      {activePlan.total_walk_minutes > 0 && ` · 이동 ${activePlan.total_walk_minutes}분`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => { setShowAddPanel(v => !v); setSearchKeyword(''); setSearchResults([]); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: '1px solid #E8F0FF', padding: '8px 14px', fontSize: 13, color: showAddPanel ? 'white' : '#4F7CF3', background: showAddPanel ? '#4F7CF3' : 'white', cursor: 'pointer', ...s }}>
                      <Plus size={13} /> 과목 추가
                    </button>
                    <button onClick={handleLoadComment} disabled={loadingComment}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: '1px solid #E8F0FF', padding: '8px 14px', fontSize: 13, color: '#4F7CF3', background: 'white', cursor: 'pointer', ...s }}>
                      {loadingComment ? <Loader size={13} className="animate-spin" /> : <MessageSquare size={13} />}
                      AI 코멘트
                    </button>
                    <button onClick={handleConfirm} disabled={confirming || activePlan.is_selected}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, border: activePlan.is_selected ? '1px solid #bbf7d0' : '1px solid #86efac', padding: '8px 14px', fontSize: 13, fontWeight: 600, color: activePlan.is_selected ? '#6B7280' : '#16a34a', background: activePlan.is_selected ? '#f0fdf4' : 'white', cursor: activePlan.is_selected ? 'default' : 'pointer', ...s }}>
                      {confirming ? <Loader size={13} /> : <Check size={13} />}
                      {activePlan.is_selected ? '확정됨' : '이번 학기 시간표로 확정'}
                    </button>
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

                {/* AI 코멘트 */}
                {aiComment && (
                  <div style={{ padding: '14px 22px', background: '#EFF6FF', borderBottom: '1px solid #E8F0FF' }}>
                    <p style={{ fontSize: 13, color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                      💡 {aiComment}
                    </p>
                  </div>
                )}

                {/* 이수구분별 학점 요약 */}
                {(() => {
                  const byClass = activePlan.courses.reduce((acc, c) => {
                    const key = c.classification || '기타';
                    acc[key] = (acc[key] || 0) + Number(c.credits);
                    return acc;
                  }, {});
                  return (
                    <div style={{ padding: '12px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(byClass).map(([cls, cr]) => (
                        <span key={cls} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: '#F0F4FF', color: '#4F7CF3' }}>
                          {cls} {cr}학점
                        </span>
                      ))}
                    </div>
                  );
                })()}

                {/* 과목 추가 검색 패널 */}
                {showAddPanel && (
                  <div style={{ padding: '16px 22px', borderBottom: '1px solid #F3F4F6', background: '#FAFBFF' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', background: 'white' }}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                          ref={searchRef}
                          autoFocus
                          value={searchKeyword}
                          onChange={e => handleSearch(e.target.value)}
                          placeholder="과목명, 교수명, 과목코드로 검색"
                          style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, color: '#1F2937' }}
                        />
                        {searching && <Loader size={13} color="#9CA3AF" />}
                      </div>
                    </div>
                    {searchResults.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
                        {searchResults.map(c => {
                          const alreadyIn = activePlan.courses.some(ac => ac.course_id === c.course_id);
                          return (
                            <div key={c.course_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'white', borderRadius: 10, border: '1px solid #E8F0FF' }}>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#1F2937', margin: '0 0 2px' }}>{c.course_name}</p>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>
                                  {c.professor} · {c.credits}학점
                                  {c.schedules?.[0] && ` · ${c.schedules[0].day_of_week}요일 ${c.schedules[0].start_period}~${c.schedules[0].end_period}교시`}
                                  {c.classification && <span style={{ marginLeft: 6, color: '#4F7CF3' }}>{c.classification}</span>}
                                </p>
                              </div>
                              <button
                                onClick={() => !alreadyIn && handleAddCourse(c.course_id)}
                                disabled={alreadyIn || addingCourseId === c.course_id}
                                style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: alreadyIn ? 'default' : 'pointer', background: alreadyIn ? '#F3F4F6' : '#4F7CF3', color: alreadyIn ? '#9CA3AF' : 'white', ...s }}
                              >
                                {addingCourseId === c.course_id ? <Loader size={11} /> : alreadyIn ? '이미 추가됨' : '+ 추가'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {searchKeyword && !searching && searchResults.length === 0 && (
                      <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>검색 결과가 없습니다</p>
                    )}
                  </div>
                )}

                {/* 강의 목록 */}
                <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activePlan.courses.map((course, idx) => (
                    <div key={course.course_id}
                      style={{ borderRadius: 12, background: '#F9FAFB', border: '1px solid #F0F0F0', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 5, height: 36, borderRadius: 999, background: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', margin: '0 0 3px' }}>{course.course_name}</p>
                            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                              {course.professor || '교수 미정'} · {course.credits}학점
                              {course.schedules?.[0] && ` · ${course.schedules[0].day_of_week}요일 ${course.schedules[0].start_period}~${course.schedules[0].end_period}교시`}
                            </p>
                            {course.classification && (
                              <span style={{ fontSize: 11, color: '#4F7CF3', background: '#EEF2FF', padding: '2px 7px', borderRadius: 999, marginTop: 4, display: 'inline-block' }}>
                                {course.classification}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveCourse(course.course_id)}
                          disabled={removingCourseId === course.course_id}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 6, opacity: removingCourseId === course.course_id ? 0.4 : 1 }}
                          title="시간표에서 제거"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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