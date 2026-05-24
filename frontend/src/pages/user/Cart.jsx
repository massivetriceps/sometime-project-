import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, AlertCircle, BookOpen, Clock } from 'lucide-react';
import useTimetableStore from '../../store/timetableStore';
import api from '../../api/axios';

const TC = {
  '전필': { bg: '#E8F0FF', color: '#4F7CF3' },
  '전선': { bg: '#d1faf5', color: '#2EC4B6' },
  '교필': { bg: '#ede9fe', color: '#A78BFA' },
  '교선': { bg: '#fef9e7', color: '#d4a017' },
  '융합': { bg: '#fff7ed', color: '#f97316' },
  '융합(예술)': { bg: '#fff7ed', color: '#f97316' },
  '융합(사회)': { bg: '#fff7ed', color: '#f97316' },
  '융합(자연)': { bg: '#fff7ed', color: '#f97316' },
  '융합(세계)': { bg: '#fff7ed', color: '#f97316' },
  '계교': { bg: '#fef3c7', color: '#d97706' },
  '교직': { bg: '#f0fdf4', color: '#16a34a' },
  '군사': { bg: '#f1f5f9', color: '#64748b' },
};

const s = { fontFamily: 'Pretendard, sans-serif' };

// Courses.jsx의 formatSchedule과 동기화 유지
const DAY_SHORT = { '월요일': '월', '화요일': '화', '수요일': '수', '목요일': '목', '금요일': '금', MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금' };
const formatSchedule = (schedules) => {
  if (!schedules || schedules.length === 0) return null;
  return schedules.map(sc => `${DAY_SHORT[sc.day_of_week] ?? sc.day_of_week} ${sc.start_period}~${sc.end_period}교시`).join(' · ');
};

export default function Cart() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState('');
  const [removingIds, setRemovingIds]   = useState(new Set());
  const [removeErrors, setRemoveErrors] = useState({});
  const [takenCourses, setTaken]  = useState([]);
  const [distances, setDistances] = useState([]);
  const removeFromCart = useTimetableStore((state) => state.removeFromCart);
  const setCartFromDB  = useTimetableStore((state) => state.setCartFromDB);
  const cartLoaded     = useTimetableStore((state) => state.cartLoaded);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/api/users/me/cart');
        if (res.data.resultType === 'SUCCESS') {
          const data = res.data.success;
          setItems(data);
          // Layout이 이미 초기화했으면 store 덮어쓰기 생략 (race condition 방지)
          if (!cartLoaded) setCartFromDB(data);
        }
      } catch {
        setLoadError('장바구니를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    api.get('/api/users/me/graduation/history')
      .then(r => { if (r.data.resultType === 'SUCCESS') setTaken(r.data.success); })
      .catch(() => {});
    api.get('/api/admin/campus/distances')
      .then(r => { if (r.data.resultType === 'SUCCESS') setDistances(r.data.success); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 장바구니 충돌 사전 감지 ─────────────────────────────────
  const cartConflicts = useMemo(() => {
    const warns = [];
    if (items.length < 1) return warns;

    // 1. 장바구니 강의끼리 시간 충돌
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        for (const sa of (a.schedules || [])) {
          for (const sb of (b.schedules || [])) {
            if (sa.day_of_week === sb.day_of_week &&
                sa.start_period <= sb.end_period && sb.start_period <= sa.end_period) {
              warns.push({
                type: 'CART_INTERNAL_CONFLICT',
                hard: true,
                msg: `⛔ 시간 충돌 — '${a.course_name}'과 '${b.course_name}'이 ${sa.day_of_week} ${Math.max(sa.start_period, sb.start_period)}교시에 겹쳐요.`,
                sub: '두 강의 중 하나를 장바구니에서 제거하거나 다른 분반으로 변경하세요.',
                ids: [a.course_id, b.course_id],
              });
            }
          }
        }
      }
    }

    // 2. 같은 과목 분반 중복
    const nameMap = {};
    items.forEach(c => {
      const key = c.course_name.replace(/\s*\(.*?\)/g, '').trim();
      nameMap[key] = nameMap[key] || [];
      nameMap[key].push({ id: c.course_id, name: c.course_name });
    });
    Object.entries(nameMap).forEach(([key, list]) => {
      if (list.length >= 2) {
        warns.push({
          type: 'CART_SECTION_DUPLICATE',
          hard: true,
          msg: `⛔ 분반 중복 — '${key}' 강의가 ${list.length}개 분반으로 담겨 있어요. (${list.map(l => l.name).join(', ')})`,
          sub: '한 분반만 남기고 나머지는 장바구니에서 제거하세요.',
          ids: list.map(l => l.id),
        });
      }
    });

    // 3. 기수강 과목
    const takenCodes = new Set(takenCourses.map(t => t.course_code));
    items.forEach(c => {
      if (takenCodes.has(c.course_code)) {
        warns.push({
          type: 'CART_TAKEN_COURSE',
          hard: true,
          msg: `⛔ 기수강 과목 — '${c.course_name}'은(는) 이미 수강 완료한 과목이에요.`,
          sub: '해당 과목을 장바구니에서 제거하세요.',
          ids: [c.course_id],
        });
      }
    });

    // 4. 연속 교시 이동시간 10분 초과
    const distMap = {};
    distances.forEach(d => { distMap[`${d.from_building_id}_${d.to_building_id}`] = d; });
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        for (const sa of (a.schedules || [])) {
          for (const sb of (b.schedules || [])) {
            if (sa.day_of_week !== sb.day_of_week) continue;
            const isConsec = sa.end_period + 1 === sb.start_period || sb.end_period + 1 === sa.start_period;
            if (!isConsec) continue;
            const bidA = sa.building_id, bidB = sb.building_id;
            if (!bidA || !bidB || bidA === bidB) continue;
            const key = sa.end_period + 1 === sb.start_period ? `${bidA}_${bidB}` : `${bidB}_${bidA}`;
            const dist = distMap[key];
            if (dist && dist.time_minutes > 10) {
              warns.push({
                type: 'CART_TRAVEL_TIME_CONFLICT',
                hard: true,
                msg: `⛔ 이동 불가 — '${a.course_name}'→'${b.course_name}' 이동에 ${dist.time_minutes}분이 소요돼 연속 수업이 불가해요.`,
                sub: '두 강의 중 하나를 장바구니에서 제거하거나 같은 건물 분반으로 변경하세요.',
                ids: [a.course_id, b.course_id],
              });
            }
          }
        }
      }
    }

    return warns;
  }, [items, takenCourses, distances]);

  const handleRemove = async (courseId) => {
    setRemovingIds(prev => new Set([...prev, courseId]));
    setRemoveErrors(prev => { const n = { ...prev }; delete n[courseId]; return n; });
    try {
      await api.delete(`/api/users/me/cart/${courseId}`);
      setItems(prev => prev.filter(i => i.course_id !== courseId));
      removeFromCart(courseId);
    } catch (err) {
      const reason = err.response?.data?.error?.reason;
      setRemoveErrors(prev => ({ ...prev, [courseId]: reason || '삭제 중 오류가 발생했습니다.' }));
    } finally {
      setRemovingIds(prev => { const n = new Set(prev); n.delete(courseId); return n; });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <ShoppingCart size={26} color="#4F7CF3" /> 관심 강의 장바구니
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>담아둔 강의는 시간표 생성 시 최우선 제약 조건으로 반영됩니다.</p>
        </div>

        {/* 에러 배너 */}
        {loadError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 13, color: '#DC2626', fontWeight: 500, flex: 1 }}>{loadError}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '6px 12px', borderRadius: 8, background: '#DC2626', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', ...s }}>새로고침</button>
          </div>
        )}

        {/* 로딩 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 14 }}>불러오는 중...</div>
        ) : items.length === 0 ? (
          /* 빈 상태 */
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '56px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <ShoppingCart size={44} color="#BFD4FF" style={{ margin: '0 auto 14px', display: 'block' }} />
            <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 15 }}>아직 담은 강의가 없습니다</p>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              강의 검색하기 <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* 안내 배너 */}
            <div style={{ background: '#E8F0FF', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={15} color="#4F7CF3" />
              <p style={{ fontSize: 13, color: '#4F7CF3', margin: 0 }}>
                장바구니에 담긴 <strong>{items.length}개</strong> 강의가 시간표 생성 시 우선 배치됩니다.
              </p>
            </div>

            {/* 충돌 경고 배너 */}
            {cartConflicts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {cartConflicts.map((w, i) => (
                  <div key={i} style={{ background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA', borderLeft: '4px solid #EF4444', padding: '12px 16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {w.msg}
                    </p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{w.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 강의 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(course => {
                const schedule = formatSchedule(course.schedules);
                return (
                  <div key={course.course_id} style={{ borderRadius: 14, overflow: 'hidden', border: removeErrors[course.course_id] ? '1px solid #FECACA' : '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ background: 'white', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          {/* 뱃지 */}
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600, background: TC[course.classification]?.bg ?? '#F3F4F6', color: TC[course.classification]?.color ?? '#6B7280' }}>
                              {course.classification}
                            </span>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{course.credits}학점</span>
                          </div>

                          {/* 과목명 */}
                          <p style={{ fontWeight: 700, color: '#1F2937', margin: '0 0 4px', fontSize: 15 }}>
                            {course.course_name}
                          </p>

                          {/* 교수 */}
                          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 3px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <BookOpen size={12} color="#9CA3AF" />
                            {course.professor ?? '교수 미정'}
                          </p>

                          {/* 시간 */}
                          {schedule && (
                            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Clock size={12} color="#BFD4FF" />
                              {schedule}
                            </p>
                          )}
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => !removingIds.has(course.course_id) && handleRemove(course.course_id)}
                          disabled={removingIds.has(course.course_id)}
                          style={{ background: 'none', border: 'none', cursor: removingIds.has(course.course_id) ? 'not-allowed' : 'pointer', color: '#9CA3AF', padding: 6, flexShrink: 0, opacity: removingIds.has(course.course_id) ? 0.4 : 1 }}
                          title="장바구니에서 제거"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                    {/* 인라인 삭제 오류 */}
                    {removeErrors[course.course_id] && (
                      <div style={{ background: '#FEF2F2', borderTop: '1px solid #FECACA', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#DC2626', flex: 1 }}>⚠️ {removeErrors[course.course_id]}</span>
                        <button
                          onClick={() => handleRemove(course.course_id)}
                          style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', ...s }}
                        >다시 시도</button>
                        <button
                          onClick={() => setRemoveErrors(prev => { const n = { ...prev }; delete n[course.course_id]; return n; })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14 }}
                        >✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 하단 버튼 */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/courses" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>← 강의 더 담기</Link>
              <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
                시간표 생성하기 <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
