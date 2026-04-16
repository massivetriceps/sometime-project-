// 장바구니 페이지 - 관심 강의 담기 및 관리
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Star, AlertCircle } from 'lucide-react';
import useTimetableStore from '../../store/timetableStore';


const PRIORITY_COLOR = {
  high:   { bg: '#fef2f2', color: '#ef4444' },
  medium: { bg: '#E8F0FF', color: '#4F7CF3' },
  low:    { bg: '#F5F7FB', color: '#6B7280' },
};

export default function Cart() {
  const cart = useTimetableStore((state) => state.cart);
  const removeFromCart = useTimetableStore((state) => state.removeFromCart);
  const s = { fontFamily: 'Pretendard, sans-serif' };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <ShoppingCart size={26} color="#4F7CF3" /> 관심 강의 장바구니
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>담아둔 강의는 시간표 생성 시 최우선 제약 조건으로 반영됩니다.</p>
        </div>

        {cart.length > 0 && (
          <div style={{ background: '#E8F0FF', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={15} color="#4F7CF3" />
            <p style={{ fontSize: 13, color: '#4F7CF3', margin: 0 }}>장바구니에 담긴 {cart.length}개 강의가 시간표 생성 시 우선 배치됩니다.</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', padding: '56px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <ShoppingCart size={44} color="#BFD4FF" style={{ margin: '0 auto 14px', display: 'block' }} />
            <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 15 }}>아직 담은 강의가 없습니다</p>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              강의 검색하기 <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cart.map(item => (
              <div key={item.courseId} style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#E8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={18} color="#4F7CF3" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 5px', fontSize: 14 }}>{item.course?.name ?? item.courseId}</p>
                 
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.courseId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 6 }}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/courses" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>← 강의 더 담기</Link>
              <Link to="/timetable/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4F7CF3', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,124,243,0.35)' }}>
                시간표 생성하기 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}