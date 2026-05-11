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
  '융합교양': '교선',   // DB상 교선이지만 과목명 키워드로 추가 필터
  '계열교양': '계교',
  '군사학':   '군사',
  '교직':     '교직',
};

// 융합교양 판별: 가천리버럴아츠칼리지(GLAC) 개설 교선 과목
const isGLAC = (c) => c.organization?.includes('가천리버럴아츠칼리지');

export default function Courses() {
  const cart = useTimetableStore((state) => state.cart);
  const addToCart = useTimetableStore((state) => state.addToCart);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const s = { fontFamily: 'Pretendard, sans-serif' };

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
        let data = res.data.success ?? [];
        // 융합교양: 교선 중 가천리버럴아츠칼리지(GLAC) 개설 과목만
        if (activeFilter === '융합교양') {
          data = data.filter(isGLAC);
        }
        // 교양선택: 교선 중 GLAC 아닌 과목만
        if (activeFilter === '교양선택') {
          data = data.filter(c => !isGLAC(c));
        }
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
    try {
    await api.post('/api/users/me/cart', {
      course_id: course.course_id,
    });
    addToCart({ id: course.course_id, name: course.course_name }, 'medium');
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
            courses.map(course => (
              <div key={course.course_id} style={{ background: 'white', borderRadius: 14, border: isInCart(course.course_id) ? '1px solid #BFD4FF' : '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px' }}>
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
            ))
          )}
        </div>
      </main>
    </div>
  );
}