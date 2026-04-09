import { Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';

const NOTICES = [
  { id: 1, title: '2025-1학기 수강신청 일정 안내', date: '2025.01.15', isNew: true },
  { id: 2, title: 'Sometime 서비스 업데이트 안내 (v2.0)', date: '2025.01.10', isNew: true },
  { id: 3, title: '가천대학교 강의 데이터 업데이트 완료', date: '2025.01.05', isNew: false },
  { id: 4, title: '개인정보처리방침 변경 안내', date: '2024.12.20', isNew: false },
  { id: 5, title: '서비스 점검 안내 (1/3 새벽 2시~4시)', date: '2024.12.15', isNew: false },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 border-b border-[#E8F0FF] bg-[#FFFFFF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2"><GachonLogo size={32} /><span className="text-xl font-bold text-[#1F2937]">Sometime</span></Link>
          <Link to="/" className="text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors">← 홈으로</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2 flex items-center gap-3"><Bell className="h-7 w-7 text-[#4F7CF3]" />공지사항</h1>
          <p className="text-[#6B7280]">Sometime의 새로운 소식을 확인하세요</p>
        </div>
        <div className="flex flex-col gap-3">
          {NOTICES.map(notice => (
            <div key={notice.id} className="rounded-2xl bg-[#FFFFFF] border border-[#E8F0FF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between cursor-pointer hover:border-[#BFD4FF] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                {notice.isNew && <span className="rounded-full bg-[#4F7CF3] px-2 py-0.5 text-[10px] font-bold text-white flex-shrink-0">NEW</span>}
                <div>
                  <p className={`text-sm font-medium ${notice.isNew ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>{notice.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{notice.date}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#6B7280] flex-shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
