import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GachonLogo } from '../../components/ui/GachonLogo';
import { Bell, ChevronRight, X } from 'lucide-react';

const NOTICES = [
  { id: 1, title: '2025-1학기 수강신청 일정 안내', date: '2025.01.15', isNew: true, category: '학사', content: '2025학년도 1학기 수강신청은 2월 17일(월)부터 시작됩니다. 예비수강신청은 2월 10일(월)부터 가능합니다. 수강신청 기간 중 Sometime 서비스를 적극 활용해 최적 시간표를 미리 준비하세요.' },
  { id: 2, title: 'Sometime 서비스 업데이트 안내 (v2.0)', date: '2025.01.10', isNew: true, category: '서비스', content: 'AI 맞춤형 시간표 추천 기능이 업그레이드되었습니다. Plan A/B/C 3가지 후보군을 동시에 비교할 수 있으며, 각 플랜에 대한 AI 코멘트 기능이 추가되었습니다.' },
  { id: 3, title: '가천대학교 강의 데이터 업데이트 완료', date: '2025.01.05', isNew: false, category: '서비스', content: '2025학년도 1학기 개설 강의 데이터가 모두 업데이트되었습니다. 최신 강의 목록으로 시간표를 구성해보세요.' },
  { id: 4, title: '개인정보처리방침 변경 안내', date: '2024.12.20', isNew: false, category: '공지', content: '개인정보처리방침이 일부 변경되었습니다. 주요 변경 내용은 수집 항목 명확화 및 보관 기간 조정입니다. 반드시 확인해주세요.' },
  { id: 5, title: '서비스 점검 안내 (1/3 새벽 2시~4시)', date: '2024.12.15', isNew: false, category: '공지', content: '서버 안정화를 위한 정기 점검이 예정되어 있습니다. 해당 시간에는 서비스 이용이 제한됩니다.' },
];

const CAT_COLORS = {
  '학사': { bg: '#E8F0FF', color: '#4F7CF3' },
  '서비스': { bg: '#d1faf5', color: '#2EC4B6' },
  '공지': { bg: '#ede9fe', color: '#A78BFA' },
};

export default function Notice() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('전체');
  const s = { fontFamily: 'Pretendard, sans-serif' };
  const filtered = filter === '전체' ? NOTICES : NOTICES.filter(n => n.category === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>← 홈으로</Link>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Bell size={26} color="#4F7CF3" /> 공지사항
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>Sometime의 새로운 소식과 학사 안내를 확인하세요</p>
        </div>

        {!selected ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['전체', '학사', '서비스', '공지'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, border: filter === f ? 'none' : '1px solid #E8F0FF', background: filter === f ? '#4F7CF3' : 'white', color: filter === f ? 'white' : '#6B7280', cursor: 'pointer', ...s }}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(notice => (
                <div key={notice.id} onClick={() => setSelected(notice)}
                  style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, flexShrink: 0, background: CAT_COLORS[notice.category]?.bg, color: CAT_COLORS[notice.category]?.color }}>{notice.category}</span>
                    {notice.isNew && <span style={{ background: '#4F7CF3', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999, flexShrink: 0 }}>NEW</span>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: notice.isNew ? '#1F2937' : '#6B7280', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.title}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{notice.date}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" style={{ flexShrink: 0, marginLeft: 8 }} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, background: CAT_COLORS[selected.category]?.bg, color: CAT_COLORS[selected.category]?.color }}>{selected.category}</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{selected.date}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>{selected.title}</h2>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 20px' }}>{selected.content}</p>
            <button onClick={() => setSelected(null)} style={{ fontSize: 13, color: '#4F7CF3', background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...s }}>
              ← 목록으로
            </button>
          </div>
        )}
      </main>
    </div>
  );
}