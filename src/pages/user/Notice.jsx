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

const CAT_COLORS = {
  '학사':  { bg: '#E8F0FF', color: '#4F7CF3' },
  '서비스': { bg: '#d1faf5', color: '#2EC4B6' },
  '공지':  { bg: '#ede9fe', color: '#A78BFA' },
  '점검':  { bg: '#fef9e7', color: '#d4a017' },
};

const CAT_BADGE = {
  '학사':  { bg: '#4F7CF3', color: 'white' },
  '서비스': { bg: '#2EC4B6', color: 'white' },
  '공지':  { bg: '#A78BFA', color: 'white' },
  '점검':  { bg: '#F4D58D', color: '#1F2937' },
};

export default function Notice() {
  const [selected, setSelected] = useState(null);
  const s = { fontFamily: 'Pretendard, sans-serif' };

  const pinnedNotices = NOTICES.filter(n => n.isPinned);
  const regularNotices = NOTICES.filter(n => !n.isPinned);

  if (selected) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
        <header style={{ background: 'white', borderBottom: '1px solid #E8F0FF' }}>
          <div style={{ maxWidth: 896, margin: '0 auto', padding: '16px 24px' }}>
            <button onClick={() => setSelected(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, marginBottom: 16, borderRadius: 999, padding: '6px 12px 6px 8px', ...s }}>
              <ChevronLeft size={18} /> 목록으로
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, background: '#E8F0FF', borderRadius: 12 }}>
                <Bell size={22} color="#4F7CF3" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: 0 }}>공지사항</h1>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>중요한 서비스 소식을 확인하세요</p>
              </div>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 896, margin: '0 auto', padding: '24px 24px' }}>
          <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '28px 28px 24px', marginBottom: 24 }}>
            {/* 배지 + 핀 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {selected.isPinned && <Pin size={15} color="#4F7CF3" />}
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: CAT_BADGE[selected.category]?.bg, color: CAT_BADGE[selected.category]?.color }}>
                {selected.category}
              </span>
              {selected.isNew && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#2EC4B6', color: 'white' }}>NEW</span>
              )}
            </div>

            {/* 제목 */}
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 12px', lineHeight: 1.4 }}>{selected.title}</h2>

            {/* 날짜 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, marginBottom: 20 }}>
              <Clock size={14} />
              <span>{selected.date}</span>
            </div>

            <div style={{ height: 1, background: '#E8F0FF', marginBottom: 20 }} />

            {/* 본문 */}
            <div style={{ fontSize: 14, color: '#1F2937', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {selected.content}
            </div>
          </div>

          {/* 다른 공지사항 */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 14, paddingLeft: 2 }}>다른 공지사항</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NOTICES.filter(n => n.id !== selected.id).slice(0, 3).map(notice => (
                <div key={notice.id} onClick={() => setSelected(notice)}
                  style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: CAT_BADGE[notice.category]?.bg, color: CAT_BADGE[notice.category]?.color }}>
                        {notice.category}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1F2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.title}</p>
                  </div>
                  <span style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{notice.date}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <button onClick={() => setSelected(null)}
                style={{ background: '#4F7CF3', color: 'white', padding: '11px 36px', borderRadius: 999, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,124,243,0.35)', ...s }}>
                전체 목록 보기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ background: 'white', borderBottom: '1px solid #E8F0FF' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, background: '#E8F0FF', borderRadius: 12 }}>
                <Bell size={22} color="#4F7CF3" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: 0 }}>공지사항</h1>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>중요한 서비스 소식을 확인하세요</p>
              </div>
            </div>
            <Link to="/" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>← 홈으로</Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '24px 24px' }}>

        {/* 📌 고정 공지 */}
        {pinnedNotices.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Pin size={14} color="#4F7CF3" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4F7CF3' }}>고정 공지</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pinnedNotices.map(notice => (
                <div key={notice.id} onClick={() => setSelected(notice)}
                  style={{ background: 'white', borderRadius: 14, border: '1px solid #BFD4FF', boxShadow: '0 2px 8px rgba(79,124,243,0.08)', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <Pin size={13} color="#4F7CF3" />
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 999, background: CAT_BADGE[notice.category]?.bg, color: CAT_BADGE[notice.category]?.color }}>
                          {notice.category}
                        </span>
                        {notice.isNew && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#2EC4B6', color: 'white' }}>NEW</span>
                        )}
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280', fontSize: 12 }}>
                        <Clock size={12} />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 일반 공지 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Bell size={14} color="#6B7280" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>전체 공지</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {regularNotices.map(notice => (
              <div key={notice.id} onClick={() => setSelected(notice)}
                style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 999, background: CAT_BADGE[notice.category]?.bg, color: CAT_BADGE[notice.category]?.color }}>
                        {notice.category}
                      </span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: '#1F2937', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9CA3AF', fontSize: 12 }}>
                      <Clock size={12} />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}