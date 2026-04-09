import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';
import { GachonLogo } from '../../components/ui/GachonLogo';

export default function Cart() {
  const { cart, removeFromCart } = useTimetable();
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 border-b border-[#E8F0FF] bg-[#FFFFFF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2"><GachonLogo size={32} /><span className="text-xl font-bold text-[#1F2937]">Sometime</span></Link>
          <Link to="/timetable/setup" className="text-sm text-[#4F7CF3] font-medium hover:underline">시간표 만들기</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2 flex items-center gap-3"><ShoppingCart className="h-7 w-7 text-[#4F7CF3]" />관심 강의 장바구니</h1>
          <p className="text-[#6B7280]">담아둔 강의를 확인하고 시간표 생성에 반영하세요</p>
        </div>
        {cart.length === 0 ? (
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8F0FF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-16 text-center">
            <ShoppingCart className="h-12 w-12 text-[#BFD4FF] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-6">아직 담은 강의가 없습니다</p>
            <Link to="/timetable/setup"><button className="inline-flex items-center gap-2 rounded-full bg-[#4F7CF3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3a6ce0] transition-all shadow-sm">시간표 만들기 <ArrowRight className="h-4 w-4" /></button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map(item => (
              <div key={item.courseId} className="rounded-2xl bg-[#FFFFFF] border border-[#E8F0FF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><Star className="h-5 w-5 text-[#4F7CF3]" /></div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">{item.course?.name ?? item.courseId}</p>
                    <p className="text-sm text-[#6B7280]">우선순위: {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '보통' : '낮음'}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.courseId)} className="text-[#6B7280] hover:text-red-400 transition-colors"><Trash2 className="h-5 w-5" /></button>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <Link to="/timetable/setup"><button className="inline-flex items-center gap-2 rounded-full bg-[#4F7CF3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3a6ce0] transition-all shadow-sm">시간표 생성하기 <ArrowRight className="h-4 w-4" /></button></Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
