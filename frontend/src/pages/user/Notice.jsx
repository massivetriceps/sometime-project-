import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { Bell, Clock, Pin, ChevronRight, ChevronLeft } from 'lucide-react';

const NOTICES = [
  {
    id: 1,
    title: '2025-1학기 수강신청 일정 안내',
    content: `안녕하세요, Sometime 팀입니다.

2025학년도 1학기 수강신청 일정을 안내드립니다.

[수강신청 일정]
- 예비 수강신청: 2025년 2월 10일(월) ~ 2월 14일(금)
- 본 수강신청: 2025년 2월 17일(월) ~ 2월 21일(금)
- 수강정정: 2025년 3월 3일(월) ~ 3월 7일(금)

[주의사항]
- 수강신청 전 Sometime 서비스를 통해 최적 시간표를 미리 준비하세요.
- 장바구니에 담아둔 강의를 우선 배치하여 수강신청에 활용하세요.
- 수강신청 기간 중 시스템 접속이 원활하지 않을 수 있으니 여유 있게 접속하시기 바랍니다.

적극적인 활용 부탁드립니다. 감사합니다.`,
    category: '학사',
    date: '2025.01.15',
    isPinned: true,
    isNew: true,
  },
  {
    id: 2,
    title: 'Sometime 서비스 업데이트 안내 (v2.0)',
    content: `안녕하세요, Sometime 팀입니다.

AI 맞춤형 시간표 추천 기능이 업그레이드되었습니다.

[주요 업데이트 내용]
1. AI 추천 기능 강화
   - Plan A/B/C 3가지 후보군을 동시에 비교할 수 있습니다.
   - 각 플랜에 대한 AI 코멘트 기능이 추가되었습니다.

2. 졸업 요건 대시보드 개선
   - 카테고리별 이수 현황을 시각화하여 확인할 수 있습니다.
   - 이번 학기 권장 학점을 자동으로 계산해 드립니다.

3. 장바구니 기능 추가
   - 관심 강의를 미리 담아두고 시간표 생성 시 우선 반영할 수 있습니다.

업데이트는 자동으로 적용됩니다. 감사합니다.`,
    category: '서비스',
    date: '2025.01.10',
    isPinned: true,
    isNew: true,
  },
  {
    id: 3,
    title: '가천대학교 강의 데이터 업데이트 완료',
    content: `안녕하세요, Sometime 팀입니다.

2025학년도 1학기 개설 강의 데이터가 모두 업데이트되었습니다.

[업데이트 내용]
- 2025-1학기 전체 개설 강의 목록 반영
- 강의실 및 캠퍼스 건물 위치 데이터 갱신
- 교수진 정보 최신화

최신 강의 목록으로 시간표를 구성해보세요.

감사합니다.`,
    category: '서비스',
    date: '2025.01.05',
    isPinned: false,
    isNew: false,
  },
  {
    id: 4,
    title: '개인정보 처리방침 변경 안내',
    content: `안녕하세요, Sometime 팀입니다.

개인정보 처리방침이 일부 변경되었습니다.

[주요 변경 내용]
- 수집 항목 명확화
- 보관 기간 조정
- 제3자 제공 내역 업데이트

[시행일]
2025년 1월 25일부터 시행

변경된 개인정보 처리방침은 홈페이지 하단에서 확인하실 수 있습니다. 반드시 확인해주세요.

감사합니다.`,
    category: '공지',
    date: '2024.12.20',
    isPinned: false,
    isNew: false,
  },
  {
    id: 5,
    title: '서비스 정기 점검 안내 (1/3 새벽 2시~4시)',
    content: `안녕하세요, Sometime 팀입니다.

보다 나은 서비스 제공을 위한 정기 서버 점검을 실시합니다.

[점검 일정]
- 점검 일시: 2025년 1월 3일 (금) 02:00 ~ 04:00 (약 2시간)
- 점검 대상: 전체 서비스

[점검 내용]
- 데이터베이스 최적화
- 보안 패치 적용
- 시스템 성능 개선

점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있습니다.
이용에 불편을 드려 죄송합니다.

감사합니다.`,
    category: '점검',
    date: '2024.12.15',
    isPinned: false,
    isNew: false,
  },
];

const CAT_BADGE_CLASS = {
  '학사':   'bg-primary text-white',
  '서비스': 'bg-[#2EC4B6] text-white',
  '공지':   'bg-[#A78BFA] text-white',
  '점검':   'bg-[#F4D58D] text-slate-800',
};

const CAT_BADGE = {
  '학사':  { bg: '#4F7CF3', color: 'white' },
  '서비스': { bg: '#2EC4B6', color: 'white' },
  '공지':  { bg: '#A78BFA', color: 'white' },
  '점검':  { bg: '#F4D58D', color: '#1F2937' },
};

export default function Notice() {
  const [selected, setSelected] = useState(null);

  const pinnedNotices = NOTICES.filter(n => n.isPinned);
  const regularNotices = NOTICES.filter(n => !n.isPinned);

  // --- 공지사항 상세 보기 화면 ---
  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50 font-pretendard">
       

        <main className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 sm:p-8 mb-8">
            {/* 카테고리 배지 & NEW 핀 */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {selected.isPinned && <Pin size={15} className="text-primary fill-primary" />}
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${CAT_BADGE_CLASS[selected.category]}`}>
                {selected.category}
              </span>
              {selected.isNew && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2EC4B6] text-white">NEW</span>
              )}
            </div>

            {/* 제목 및 날짜 */}
            <h2 className="text-2xl font-bold text-slate-800 mb-3 leading-snug">{selected.title}</h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-[13px] mb-6">
              <Clock size={14} />
              <span>{selected.date}</span>
            </div>

            <div className="h-px bg-slate-100 mb-6" />

            {/* 본문 내용 */}
            <div className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selected.content}
            </div>
          </article>

          {/* 하단 추천 공지 섹션 */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 px-1">다른 공지사항</h3>
            <div className="grid gap-2.5">
              {NOTICES.filter(n => n.id !== selected.id).slice(0, 3).map(notice => (
                <div 
                  key={notice.id} 
                  onClick={() => setSelected(notice)}
                  className="bg-white rounded-xl border border-slate-100 p-4 cursor-pointer flex items-center justify-between gap-4 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${CAT_BADGE_CLASS[notice.category]}`}>
                      {notice.category}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 truncate">{notice.title}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{notice.date}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setSelected(null)}
                className="bg-primary text-white px-10 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                전체 목록 보기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- 공지사항 목록 화면 ---
  return (
    <div className="min-h-screen bg-slate-50 font-pretendard">
     

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 📌 고정 공지 섹션 */}
        {pinnedNotices.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-1.5 mb-4 text-primary">
              <Pin size={14} className="fill-primary" />
              <span className="text-sm font-bold">고정 공지</span>
            </div>
            <div className="grid gap-3">
              {pinnedNotices.map(notice => (
                <div 
                  key={notice.id} 
                  onClick={() => setSelected(notice)}
                  className="bg-white rounded-2xl border border-primary/20 shadow-sm shadow-primary/5 p-5 cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_BADGE_CLASS[notice.category]}`}>
                          {notice.category}
                        </span>
                        {notice.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2EC4B6] text-white">NEW</span>}
                      </div>
                      <p className="text-[16px] font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors truncate">{notice.title}</p>
                      <div className="flex items-center gap-1 text-[12px] text-slate-400">
                        <Clock size={12} />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 일반 공지 섹션 */}
        <section>
          <div className="flex items-center gap-1.5 mb-4 text-slate-400">
            <Bell size={14} />
            <span className="text-sm font-bold">전체 공지</span>
          </div>
          <div className="grid gap-3">
            {regularNotices.map(notice => (
              <div 
                key={notice.id} 
                onClick={() => setSelected(notice)}
                className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer hover:border-primary/30 transition-all shadow-sm group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${CAT_BADGE_CLASS[notice.category]}`}>
                      {notice.category}
                    </span>
                    <p className="text-[16px] font-semibold text-slate-800 mb-2 group-hover:text-primary transition-colors truncate">{notice.title}</p>
                    <div className="flex items-center gap-1 text-[12px] text-slate-400">
                      <Clock size={12} />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}