import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { Search, ShoppingCart, Plus, Check, Filter, ArrowLeft } from 'lucide-react';
import useTimetableStore from '../../store/timetableStore';
import api from '../../api/axios';

const TC = {
  '전필': { bg: '#E8F0FF', color: '#4F7CF3' },
  '전선': { bg: '#d1faf5', color: '#2EC4B6' },
  '교필': { bg: '#ede9fe', color: '#A78BFA' },
  '교선': { bg: '#fef9e7', color: '#d4a017' },
  '계교': { bg: '#fef3c7', color: '#d97706' },
  '교직': { bg: '#f0fdf4', color: '#16a34a' },
  '군사': { bg: '#f1f5f9', color: '#64748b' },
};

const FILTER_MAP = {
  '전공필수': '전필',
  '전공선택': '전선',
  '교양필수': '교필',
  '교양선택': '교선',
  '계열교양': '계교',
  '군사학':   '군사',
  '교직':     '교직',
};

export default function Courses() {
  const cart = useTimetableStore((state) => state.cart);
  const addToCart = useTimetableStore((state) => state.addToCart);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [cartItems, setCartItems] = useState([]);        // 장바구니 전체 데이터 (충돌 검사용)
  const [takenCourses, setTakenCourses] = useState([]);  // 기수강 과목
  const [distances, setDistances] = useState([]);        // 건물 간 이동시간
  const [conflictErrors, setConflictErrors] = useState({}); // { [course_id]: { msg, sub } }
  const s = { fontFamily: 'Pretendard, sans-serif' };

  // 장바구니·기수강·이동시간 데이터 초기 로드
  useEffect(() => {
    api.get('/api/users/me/cart')
      .then(r => { if (r.data.resultType === 'SUCCESS') setCartItems(r.data.success); })
      .catch(() => {});
    api.get('/api/graduation/history')
      .then(r => { if (r.data.resultType === 'SUCCESS') setTakenCourses(r.data.success); })
      .catch(() => {});
    api.get('/api/admin/campus/distances')
      .then(r => { if (r.data.resultType === 'SUCCESS') setDistances(r.data.success); })
      .catch(() => {});
  }, []);

  // ── 강한 제약 충돌 사전 검사 (5가지) ──────────────────────────
  const checkHardConflicts = (newCourse) => {
    // 1. 기수강 과목
    const takenCodes = new Set(takenCourses.map(t => t.course_code));
    if (takenCodes.has(newCourse.course_code)) {
      return {
        msg: `⛔ 기수강 과목 — '${newCourse.course_name}'은(는) 이미 수강 완료한 과목이에요.`,
        sub: '이미 이수한 과목은 장바구니에 담을 수 없어요.',
      };
    }

    // 2. 분반 중복
    const newKey = newCourse.course_name.replace(/\s*\(.*?\)/g, '').trim();
    const dup = cartItems.find(c => c.course_name.replace(/\s*\(.*?\)/g, '').trim() === newKey);
    if (dup) {
      return {
        msg: `⛔ 분반 중복 — '${newKey}' 강의가 이미 장바구니에 담겨 있어요. (${dup.course_name})`,
        sub: '기존 분반을 장바구니에서 제거한 뒤 다시 담아주세요.',
      };
    }

    // 3. 시간 충돌
    for (const cartCourse of cartItems) {
      for (const sa of (newCourse.schedules || [])) {
        for (const sb of (cartCourse.schedules || [])) {
          if (sa.day_of_week === sb.day_of_week &&
              sa.start_period <= sb.end_period && sb.start_period <= sa.end_period) {
            return {
              msg: `⛔ 시간 충돌 — '${newCourse.course_name}'과 '${cartCourse.course_name}'이 ${sa.day_of_week} ${Math.max(sa.start_period, sb.start_period)}교시에 겹쳐요.`,
              sub: '이미 담긴 강의와 시간이 겹쳐요. 다른 분반으로 변경하거나 기존 강의를 제거해주세요.',
            };
          }
        }
      }
    }

    // 4. 학점 초과 (21학점 한도)
    const totalCredits = cartItems.reduce((sum, c) => sum + (c.credits || 0), 0) + (newCourse.credits || 0);
    if (totalCredits > 21) {
      return {
        msg: `⛔ 학점 초과 — 담으면 총 학점(${totalCredits}학점)이 최대 이수 학점(21학점)을 초과해요.`,
        sub: '장바구니에서 일부 과목을 제거한 뒤 다시 담아주세요.',
      };
    }

    // 5. 이동시간 10분 초과 (연속 교시)
    const distMap = {};
    distances.forEach(d => { distMap[`${d.from_building_id}_${d.to_building_id}`] = d; });
    for (const cartCourse of cartItems) {
      for (const sa of (newCourse.schedules || [])) {
        for (const sb of (cartCourse.schedules || [])) {
          if (sa.day_of_week !== sb.day_of_week) continue;
          const isConsec = sa.end_period + 1 === sb.start_period || sb.end_period + 1 === sa.start_period;
          if (!isConsec) continue;
          const bidA = sa.building_id, bidB = sb.building_id;
          if (!bidA || !bidB || bidA === bidB) continue;
          const key = sa.end_period + 1 === sb.start_period ? `${bidA}_${bidB}` : `${bidB}_${bidA}`;
          const dist = distMap[key];
          if (dist && dist.time_minutes > 10) {
            return {
              msg: `⛔ 이동 불가 — '${newCourse.course_name}'→'${cartCourse.course_name}' 이동에 ${dist.time_minutes}분이 소요돼 연속 수업이 불가해요.`,
              sub: '같은 건물 분반으로 변경하거나 기존 강의를 제거해주세요.',
            };
          }
        }
      }
    }

    return null; // 충돌 없음
  };

  // API로 강의 목록 가져오기
  const fetchCourses = async (overrideFilter) => {
    const activeFilter = overrideFilter !== undefined ? overrideFilter : filter;
    setLoading(true);
    setFetchError(null);
    try {
      const params = {};
      if (search) params.keyword = search;
      if (activeFilter !== '전체') params.classification = FILTER_MAP[activeFilter] ?? activeFilter;

      const res = await api.get('/api/courses', { params });
      if (res.data.resultType === 'SUCCESS') {
        const data = res.data.success ?? [];
        setCourses(data);
      } else {
        setFetchError('강의 목록을 가져오지 못했습니다.');
      }
    } catch (err) {
      console.error('강의 목록 조회 실패', err);
      const msg = err.response?.status === 401
        ? '로그인이 필요합니다. 다시 로그인해주세요.'
        : '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경 시 재검색 (mount 포함)
  useEffect(() => {
    fetchCourses(filter);
  }, [filter]);

  const isInCart = (id) => cart.some(item => item.courseId === id);

  const handleAdd = async (course) => {
    // ── 강한 제약 충돌 사전 검사 ──
    const conflict = checkHardConflicts(course);
    if (conflict) {
      setConflictErrors(prev => ({ ...prev, [course.course_id]: conflict }));
      // 6초 후 자동 해제
      setTimeout(() => {
        setConflictErrors(prev => {
          const next = { ...prev };
          delete next[course.course_id];
          return next;
        });
      }, 6000);
      return; // 담기 거부
    }

    try {
      await api.post('/api/users/me/cart', { course_id: course.course_id });
      addToCart({ id: course.course_id, name: course.course_name }, 'medium');
      setCartItems(prev => [...prev, course]); // 로컬 동기화
      setConflictErrors(prev => {             // 혹시 남은 에러 제거
        const next = { ...prev };
        delete next[course.course_id];
        return next;
      });
    } catch (err) {
      console.error('장바구니 담기 실패', err);
    }
  };

  // 시간표 포맷 변환
  const formatSchedule = (schedules) => {
    if (!schedules || schedules.length === 0) return '-';
    return schedules.map(s => `${s.day_of_week} ${s.start_period}~${s.end_period}교시`).join(', ');
  };

  const formatRoom = (schedules) => {
    if (!schedules || schedules.length === 0) return '-';
    return schedules[0].room_name || '-';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>개설 교과목 검색</h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>강의를 검색하고 장바구니에 담아보세요. 장바구니 강의는 시간표 생성 시 최우선 반영됩니다.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="강의명, 교수명으로 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchCourses(filter)}
              style={{ flex: 1, borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px 16px 12px 40px', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...s }}
            />
            <button
              onClick={() => fetchCourses(filter)}
              style={{ padding: '12px 18px', borderRadius: 12, background: '#4F7CF3', color: 'white', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', ...s }}
            >
              검색
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={13} color="#9CA3AF" />
            {['전체', '전공필수', '전공선택', '교양필수', '교양선택', '융합교양', '계열교양', '군사학', '교직'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, border: filter === f ? 'none' : '1px solid #E8F0FF', background: filter === f ? '#4F7CF3' : 'white', color: filter === f ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
            {loading ? '검색 중...' : `총 ${courses.length}개 강의`}
          </p>
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4F7CF3', textDecoration: 'none', fontWeight: 600, background: '#E8F0FF', padding: '7px 14px', borderRadius: 999 }}>
            <ShoppingCart size={13} /> 장바구니 ({cart.length})
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fetchError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{fetchError}</p>
              <button onClick={() => fetchCourses(filter)} style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: 8, background: '#DC2626', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', ...s }}>다시 시도</button>
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              <p style={{ margin: 0, fontSize: 14 }}>강의 목록을 불러오는 중...</p>
            </div>
          ) : !fetchError && courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              <Search size={36} color="#BFD4FF" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ margin: 0, fontSize: 14 }}>검색 결과가 없습니다</p>
            </div>
          ) : (
            courses.map(course => {
              const err = conflictErrors[course.course_id];
              return (
                <div key={course.course_id}>
                  <div style={{ background: 'white', borderRadius: err ? '14px 14px 0 0' : 14, border: isInCart(course.course_id) ? '1px solid #BFD4FF' : err ? '1px solid #FECACA' : '1px solid #E8F0FF', borderBottom: err ? 'none' : undefined, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, background: TC[course.classification]?.bg, color: TC[course.classification]?.color }}>{course.classification}</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{course.credits}학점</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{course.major}</span>
                        </div>
                        <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 4px', fontSize: 15 }}>{course.course_name}</p>
                        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 3px' }}>{course.professor} · {formatRoom(course.schedules)}</p>
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{formatSchedule(course.schedules)}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => !isInCart(course.course_id) && handleAdd(course)}
                          disabled={isInCart(course.course_id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, border: 'none', cursor: isInCart(course.course_id) ? 'default' : 'pointer', background: isInCart(course.course_id) ? '#E8F0FF' : '#4F7CF3', color: isInCart(course.course_id) ? '#4F7CF3' : 'white', ...s }}>
                          {isInCart(course.course_id) ? <><Check size={13} />담김</> : <><Plus size={13} />담기</>}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 강한 제약 충돌 오류 — 카드 바로 아래 */}
                  {err && (
                    <div style={{ background: '#FEF2F2', borderRadius: '0 0 14px 14px', border: '1px solid #FECACA', borderTop: 'none', borderLeft: '4px solid #EF4444', padding: '10px 18px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', margin: '0 0 3px' }}>{err.msg}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{err.sub}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}