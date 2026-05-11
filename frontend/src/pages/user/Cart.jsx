import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, AlertCircle, BookOpen, Clock } from 'lucide-react';
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

const s = { fontFamily: 'Pretendard, sans-serif' };

const formatSchedule = (schedules) => {
  if (!schedules || schedules.length === 0) return null;
  return schedules.map(s => `${s.day_of_week} ${s.start_period}~${s.end_period}교시`).join(', ');
};

export default function Cart() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const removeFromCart = useTimetableStore((state) => state.removeFromCart);
  const setCartFromDB  = useTimetableStore((state) => state.setCartFromDB);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/api/users/me/cart');
        if (res.data.resultType === 'SUCCESS') {
          const data = res.data.success;
          setItems(data);
          setCartFromDB(data); // store 동기화 (시간표 생성 시 활용)
        }
      } catch (err) {
        console.error('장바구니 조회 실패', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await api.delete(`/api/users/me/cart/${courseId}`);
      setItems(prev => prev.filter(i => i.course_id !== courseId));
      removeFromCart(courseId);
    } catch (err) {
      console.error('장바구니 삭제 실패', err);
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

            {/* 강의 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(course => {
                const schedule = formatSchedule(course.schedules);
                return (
                  <div key={course.course_id} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px' }}>
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
                        onClick={() => handleRemove(course.course_id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 6, flexShrink: 0 }}
                        title="장바구니에서 제거"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
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
