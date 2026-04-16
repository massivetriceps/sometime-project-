// 강의 검색 페이지 - 개설 교과목 검색 및 장바구니 담기
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { Search, ShoppingCart, Plus, Check, Filter, ArrowLeft } from 'lucide-react';
import useTimetableStore from '../../store/timetableStore';

const COURSES = [
  { id: 'c1', name: '자료구조', professor: '김철수', credits: 3, day: '월/수', time: '10:00-11:30', room: '공학관 301', type: '전공필수', dept: '컴퓨터공학과' },
  { id: 'c2', name: '알고리즘', professor: '이영희', credits: 3, day: '화/목', time: '13:00-14:30', room: 'AI공학관 201', type: '전공필수', dept: '컴퓨터공학과' },
  { id: 'c3', name: '운영체제', professor: '박민준', credits: 3, day: '월/목', time: '10:00-11:30', room: '공학관 402', type: '전공선택', dept: '컴퓨터공학과' },
  { id: 'c4', name: '영어회화', professor: 'James Smith', credits: 2, day: '수', time: '14:00-16:00', room: '글로벌센터 201', type: '교양필수', dept: '교양' },
  { id: 'c5', name: '컴퓨터네트워크', professor: '최지훈', credits: 3, day: '화/금', time: '09:00-10:30', room: 'AI공학관 305', type: '전공선택', dept: '컴퓨터공학과' },
  { id: 'c6', name: '데이터베이스', professor: '정수연', credits: 3, day: '월/수', time: '13:00-14:30', room: '공학관 201', type: '전공필수', dept: '컴퓨터공학과' },
  { id: 'c7', name: '소프트웨어공학', professor: '한동훈', credits: 3, day: '화/목', time: '10:00-11:30', room: '공학관 501', type: '전공선택', dept: '컴퓨터공학과' },
  { id: 'c8', name: '창의적사고와표현', professor: '오미래', credits: 2, day: '금', time: '13:00-15:00', room: '인문관 201', type: '교양필수', dept: '교양' },
  { id: 'c9', name: '인공지능개론', professor: '김지수', credits: 3, day: '월/수', time: '15:00-16:30', room: 'AI공학관 101', type: '전공선택', dept: '컴퓨터공학과' },
  { id: 'c10', name: '빅데이터프로그래밍', professor: '이준호', credits: 3, day: '화/목', time: '15:00-16:30', room: 'AI공학관 302', type: '전공선택', dept: '컴퓨터공학과' },
];

const TC = {
  '전공필수': { bg: '#E8F0FF', color: '#4F7CF3' },
  '전공선택': { bg: '#d1faf5', color: '#2EC4B6' },
  '교양필수': { bg: '#ede9fe', color: '#A78BFA' },
  '교양선택': { bg: '#fef9e7', color: '#d4a017' },
};

export default function Courses() {
 const cart = useTimetableStore((state) => state.cart);
  const addToCart = useTimetableStore((state) => state.addToCart);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [priority] = useState({});
  const s = { fontFamily: 'Pretendard, sans-serif' };

  const filtered = COURSES.filter(c =>
    (filter === '전체' || c.type === filter) &&
    (c.name.includes(search) || c.professor.includes(search) || c.dept.includes(search))
  );

  const isInCart = (id) => cart.some(item => item.courseId === id);

  const handleAdd = (course) => {
    const p = priority[course.id] || 'medium';
    addToCart({ id: course.id, name: course.name }, p);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
 

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>개설 교과목 검색</h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>강의를 검색하고 장바구니에 담아보세요. 장바구니 강의는 시간표 생성 시 최우선 반영됩니다.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="강의명, 교수명, 학과명으로 검색" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', borderRadius: 12, border: '1px solid #E8F0FF', padding: '12px 16px 12px 40px', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...s }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={13} color="#9CA3AF" />
            {['전체', '전공필수', '전공선택', '교양필수', '교양선택'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, border: filter === f ? 'none' : '1px solid #E8F0FF', background: filter === f ? '#4F7CF3' : 'white', color: filter === f ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>총 {filtered.length}개 강의</p>
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4F7CF3', textDecoration: 'none', fontWeight: 600, background: '#E8F0FF', padding: '7px 14px', borderRadius: 999 }}>
            <ShoppingCart size={13} /> 장바구니 ({cart.length})
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(course => (
            <div key={course.id} style={{ background: 'white', borderRadius: 14, border: isInCart(course.id) ? '1px solid #BFD4FF' : '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, background: TC[course.type]?.bg, color: TC[course.type]?.color }}>{course.type}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{course.credits}학점</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{course.dept}</span>
                  </div>
                  <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 4px', fontSize: 15 }}>{course.name}</p>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 3px' }}>{course.professor} · {course.room}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{course.day} {course.time}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
      
                  <button onClick={() => !isInCart(course.id) && handleAdd(course)} disabled={isInCart(course.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, border: 'none', cursor: isInCart(course.id) ? 'default' : 'pointer', background: isInCart(course.id) ? '#E8F0FF' : '#4F7CF3', color: isInCart(course.id) ? '#4F7CF3' : 'white', ...s }}>
                    {isInCart(course.id) ? <><Check size={13} />담김</> : <><Plus size={13} />담기</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              <Search size={36} color="#BFD4FF" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ margin: 0, fontSize: 14 }}>검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
