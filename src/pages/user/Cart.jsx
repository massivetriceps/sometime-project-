import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { ShoppingCart, Trash2, ArrowRight, AlertCircle, User, Clock, MapPin, Users, Star } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';

const PRIORITY_LABEL = { high: '최우선', medium: '우선', low: '보통' };
const PRIORITY_COLOR = {
  high: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  medium: { bg: '#E8F0FF', color: '#4F7CF3', border: '#BFD4FF' },
  low: { bg: '#F5F7FB', color: '#6B7280', border: '#E8F0FF' },
};
const TYPE_COLOR = {
  '전공필수': { bg: '#E8F0FF', color: '#4F7CF3' },
  '전공선택': { bg: '#ede9fe', color: '#A78BFA' },
  '교양필수': { bg: '#d1faf5', color: '#2EC4B6' },
  '교양선택': { bg: '#fef9e7', color: '#d4a017' },
};

const MOCK_DETAIL = {
  c1: { code: 'CS-301', type: '전공필수', professor: '김철수', credits: 3, time: '월/수 10:00-11:30', room: '공학관 301', enrolled: 38, capacity: 40 },
  c2: { code: 'CS-401', type: '전공필수', professor: '이영희', credits: 3, time: '화/목 13:00-14:30', room: 'AI공학관 201', enrolled: 25, capacity: 35 },
  c3: { code: 'CS-302', type: '전공선택', professor: '박민준', credits: 3, time: '월/목 10:00-11:30', room: '공학관 402', enrolled: 20, capacity: 30 },
  c4: { code: 'GE-101', type: '교양필수', professor: 'James Smith', credits: 2, time: '수 14:00-16:00', room: '글로벌센터 201', enrolled: 45, capacity: 50 },
  c5: { code: 'CS-303', type: '전공선택', professor: '최지훈', credits: 3, time: '화/금 09:00-10:30', room: 'AI공학관 305', enrolled: 30, capacity: 30 },
};

export default function Cart() {
  const { cart, removeFromCart, updatePriority } = useTimetable();
  const s = { fontFamily: 'Pretendard, sans-serif' };

  const totalCredits = cart.reduce((sum, item) => {
    const detail = MOCK_DETAIL[item.courseId];
    return sum + (detail?.credits || 0);
  }, 0);

  const typeSummary = cart.reduce((acc, item) => {
    const detail = MOCK_DETAIL[item.courseId];
    if (detail) {
      acc[detail.type] = (acc[detail.type] || 0) + 1;
    }
    return acc;
  }, {});

  const creditStatus = () => {
    if (totalCredits < 12) return { msg: `${12 - totalCredits}학점을 더 추가하여 최소 요건을 충족하세요`, bg: '#fef2f2', color: '#ef4444' };
    if (totalCredits <= 21) return { msg: '권장 학점 범위 내에 있습니다 ✓', bg: '#d1faf5', color: '#0F766E' };
    return { msg: `최대치를 ${totalCredits - 21}학점 초과했습니다`, bg: '#fef2f2', color: '#ef4444' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/courses" style={{ fontSize: 14, color: '#4F7CF3', textDecoration: 'none', fontWeight: 500 }}>강의 검색</Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#1F2937', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingCart size={30} color="#4F7CF3" /> 관심 강의 장바구니
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>관심 강의를 관리하고 시간표 생성을 준비하세요</p>
        </div>

        {cart.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '64px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <ShoppingCart size={48} color="#BFD4FF" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 16, fontWeight: 500 }}>아직 담은 강의가 없습니다</p>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
              강의 검색하기 <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

            {/* 왼쪽: 강의 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cart.map(item => {
                const detail = MOCK_DETAIL[item.courseId] || {};
                const enrollPct = detail.capacity ? Math.round(detail.enrolled / detail.capacity * 100) : 0;
                const isFull = enrollPct >= 100;
                const tc = TYPE_COLOR[detail.type] || TYPE_COLOR['전공선택'];
                const pc = PRIORITY_COLOR[item.priority] || PRIORITY_COLOR['medium'];
                const courseName = item.course?.name || item.courseId;

                return (
                  <div key={item.courseId} style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '20px 22px' }}>
                    {/* 상단 배지 + 삭제 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {detail.code && (
                          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#6B7280', background: '#F5F7FB', border: '1px solid #E8F0FF', borderRadius: 6, padding: '2px 8px' }}>
                            {detail.code}
                          </span>
                        )}
                        {detail.type && (
                          <span style={{ fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color, padding: '3px 10px', borderRadius: 999 }}>
                            {detail.type}
                          </span>
                        )}
                      </div>
                      <button onClick={() => removeFromCart(item.courseId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* 강의명 */}
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#1F2937', margin: '0 0 10px' }}>{courseName}</p>

                    {/* 정보 그리드 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 14 }}>
                      {detail.professor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
                          <User size={13} color="#9CA3AF" /> {detail.professor}
                        </div>
                      )}
                      {detail.credits && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
                          <Star size={13} color="#9CA3AF" /> {detail.credits}학점
                        </div>
                      )}
                      {detail.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
                          <Clock size={13} color="#9CA3AF" /> {detail.time}
                        </div>
                      )}
                      {detail.room && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
                          <MapPin size={13} color="#9CA3AF" /> {detail.room}
                        </div>
                      )}
                    </div>

                    {/* 수강인원 Progress Bar */}
                    {detail.enrolled && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B7280' }}>
                            <Users size={12} color="#9CA3AF" /> 수강인원
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: isFull ? '#ef4444' : '#6B7280' }}>
                            {detail.enrolled}/{detail.capacity}명 {isFull && '(마감)'}
                          </span>
                        </div>
                        <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999 }}>
                          <div style={{ height: 6, borderRadius: 999, width: Math.min(enrollPct, 100) + '%', background: isFull ? '#ef4444' : enrollPct >= 80 ? '#F4D58D' : '#4F7CF3', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )}

                    {/* 우선순위 선택 */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['high', 'medium', 'low'].map(p => {
                        const selected = item.priority === p;
                        const c = PRIORITY_COLOR[p];
                        return (
                          <button key={p} onClick={() => updatePriority?.(item.courseId, p)}
                            style={{ flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${selected ? c.border : '#E8F0FF'}`, background: selected ? c.bg : 'white', color: selected ? c.color : '#9CA3AF', cursor: 'pointer', transition: 'all 0.15s', ...s }}>
                            {PRIORITY_LABEL[p]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <Link to="/courses" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>← 강의 더 담기</Link>
              </div>
            </div>

            {/* 오른쪽: 요약 사이드카드 */}
            <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '22px 22px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 16px' }}>수강신청 요약</h3>

                {/* 총 강의수 / 학점 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#6B7280' }}>총 강의 수</span>
                    <span style={{ fontWeight: 700, color: '#1F2937' }}>{cart.length}개</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#6B7280' }}>총 학점</span>
                    <span style={{ fontWeight: 700, color: '#4F7CF3', fontSize: 18 }}>{totalCredits}학점</span>
                  </div>
                </div>

                <div style={{ height: 1, background: '#F3F4F6', margin: '0 0 16px' }} />

                {/* 유형별 분류 */}
                {Object.keys(typeSummary).length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1F2937', margin: '0 0 10px' }}>유형별 분류</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {Object.entries(typeSummary).map(([type, count]) => {
                        const tc = TYPE_COLOR[type] || TYPE_COLOR['전공선택'];
                        return (
                          <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#6B7280' }}>{type}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, background: tc.bg, color: tc.color, padding: '2px 10px', borderRadius: 999 }}>{count}개</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ height: 1, background: '#F3F4F6', margin: '0 0 16px' }} />

                {/* 학점 가이드 */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1F2937', margin: '0 0 10px' }}>학점 가이드</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[{ label: '최소', val: '12학점' }, { label: '권장', val: '15-18학점' }, { label: '최대', val: '21학점' }].map(g => (
                      <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#9CA3AF' }}>· {g.label}</span>
                        <span style={{ color: '#6B7280', fontWeight: 500 }}>{g.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 상태 메시지 */}
                {totalCredits > 0 && (
                  <div style={{ borderRadius: 10, padding: '10px 14px', fontSize: 13, background: creditStatus().bg, color: creditStatus().color, marginBottom: 16 }}>
                    {creditStatus().msg}
                  </div>
                )}

                {/* 시간표 생성 버튼 */}
                <Link to="/timetable/setup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '13px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
                  시간표 생성하기 <ArrowRight size={15} />
                </Link>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: '8px 0 0' }}>담긴 강의가 시간표에 우선 배치됩니다</p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}