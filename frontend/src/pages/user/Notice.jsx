import { useState, useEffect } from 'react';
import { Bell, Clock, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import { formatDate } from '../../utils/date';

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchNotices = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await api.get('/api/notices');
        if (!cancelled && res.data.resultType === 'SUCCESS') {
          const data = res.data.success;
          // 페이지네이션 응답({ content: [] })과 배열 응답 모두 허용
          setNotices(Array.isArray(data) ? data : (data?.content ?? []));
        }
      } catch {
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchNotices();
    return () => { cancelled = true; };
  }, [retryCount]);

  const normalizeContent = (text) => (text || '').replace(/\\n/g, '\n');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-pretendard">
        <p className="text-slate-400 text-sm">공지사항을 불러오는 중...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-pretendard">
        <div className="text-center">
          <Bell size={40} className="mx-auto mb-4 text-red-300" />
          <p className="text-slate-700 font-semibold mb-1">공지사항을 불러올 수 없습니다</p>
          <p className="text-sm text-slate-400 mb-5">네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.</p>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50 font-pretendard">
        <main className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-3 leading-snug">{selected.title}</h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-[13px] mb-6">
              <Clock size={14} />
              <span>{formatDate(selected.created_at)}</span>
            </div>
            <div className="h-px bg-slate-100 mb-6" />
            <div className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {normalizeContent(selected.content)}
            </div>
            {selected.attachment_url && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={selected.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  첨부파일 보기
                </a>
              </div>
            )}
          </article>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 px-1">다른 공지사항</h3>
            <div className="grid gap-2.5">
              {notices.filter(n => n.notice_id !== selected.notice_id).slice(0, 3).map(notice => (
                <div
                  key={notice.notice_id}
                  onClick={() => setSelected(notice)}
                  className="bg-white rounded-xl border border-slate-100 p-4 cursor-pointer flex items-center justify-between gap-4 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{notice.title}</p>
                    <span className="text-xs text-slate-400">{formatDate(notice.created_at)}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
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

  return (
    <div className="min-h-screen bg-slate-50 font-pretendard">
      <main className="max-w-4xl mx-auto px-6 py-8">
        {notices.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Bell size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <section>
            <div className="flex items-center gap-1.5 mb-4 text-slate-400">
              <Bell size={14} />
              <span className="text-sm font-bold">전체 공지</span>
            </div>
            <div className="grid gap-3">
              {notices.map(notice => (
                <div
                  key={notice.notice_id}
                  onClick={() => setSelected(notice)}
                  className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer hover:border-primary/30 transition-all shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-slate-800 mb-2 group-hover:text-primary transition-colors truncate">
                        {notice.title}
                      </p>
                      <div className="flex items-center gap-1 text-[12px] text-slate-400">
                        <Clock size={12} />
                        <span>{formatDate(notice.created_at)}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}