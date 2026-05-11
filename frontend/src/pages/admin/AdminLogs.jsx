import { useState, useEffect } from 'react';
import {
  Search, AlertCircle, RefreshCw,
  ChevronDown, Clock, Hash, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

const ERROR_STYLE = {
  badge:    'bg-red-50 text-red-500 border border-red-100',
  bar:      'border-l-[3px] border-red-400',
  iconBg:   'bg-red-50',
  iconColor:'text-red-500',
  detailBg: 'bg-red-50/40',
  dot:      'bg-red-400',
};

const formatDateTime = (isoStr) => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    const date = d.toLocaleDateString('ko-KR');
    const time = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return isoStr;
  }
};

export default function AdminLogs() {
  const [search, setSearch]       = useState('');
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const [expanded, setExpanded]   = useState(null);

  const PAGE_LIMIT = 20;

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    setExpanded(null);
    try {
      const res = await adminApi.get(`/api/admin/stats/error?page=${page}&limit=${PAGE_LIMIT}`);
      const data = res.data.success.data;
      setLogs(data.content || []);
      setCurrentPage(data.current_page ?? page);
      setTotalPages(data.total_pages ?? 1);
      setTotalCount(data.total_count ?? 0);
    } catch (err) {
      console.error('AdminLogs fetch error:', err);
      setError('데이터를 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const filtered = logs.filter((l) => {
    if (!search) return true;
    return (
      (l.error_message || '').includes(search) ||
      (l.error_type    || '').includes(search)
    );
  });

  const goPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchLogs(page);
  };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">시스템 로그 조회</h1>
          <p className="text-xs text-slate-400 mt-0.5">오류 및 예외 상황을 추적합니다</p>
        </div>
        <button
          onClick={() => fetchLogs(currentPage)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* ── 총 로그 수 카드 ── */}
      <div className="mb-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 inline-flex">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">전체 로그</p>
            <p className="text-xl font-bold text-red-500">
              {loading ? '—' : totalCount.toLocaleString()}건
            </p>
          </div>
        </div>
      </div>

      {/* ── 검색 바 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="메시지 또는 오류 타입으로 검색"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span className="font-semibold text-slate-600">{filtered.length}</span>건 표시 중
          </div>
        </div>
      </div>

      {/* ── 에러 상태 ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={() => fetchLogs(currentPage)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* ── 로딩 상태 ── */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">불러오는 중...</p>
        </div>
      )}

      {/* ── 로그 리스트 ── */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* 테이블 헤더 */}
          <div className="hidden sm:grid grid-cols-[140px_1fr_160px] gap-4 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            <span>코드 (타입)</span>
            <span>메시지</span>
            <span>발생 시각</span>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((log) => {
              const isExpanded = expanded === log.log_id;
              return (
                <div
                  key={log.log_id}
                  className={`${ERROR_STYLE.bar} transition-colors cursor-pointer`}
                  onClick={() => setExpanded(isExpanded ? null : log.log_id)}
                >
                  {/* ── 메인 행 ── */}
                  <div className="px-5 py-3.5 flex items-start gap-4 hover:bg-slate-50/70 transition-colors">

                    {/* 아이콘 */}
                    <div className={`w-7 h-7 rounded-lg ${ERROR_STYLE.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <AlertCircle size={13} className={ERROR_STYLE.iconColor} />
                    </div>

                    {/* 타입 + 메시지 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${ERROR_STYLE.badge}`}>
                          {log.error_type || 'UNKNOWN'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-700 font-medium leading-snug">{log.error_message}</p>
                    </div>

                    {/* 시각 + 펼치기 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        {formatDateTime(log.created_at)}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* ── 펼침 상세 ── */}
                  {isExpanded && (
                    <div className={`px-5 pb-4 ${ERROR_STYLE.detailBg} border-t border-slate-100`}>
                      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* 오류 타입 */}
                        <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                          <Hash size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">오류 타입</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${ERROR_STYLE.badge}`}>
                              {log.error_type || 'UNKNOWN'}
                            </span>
                          </div>
                        </div>

                        {/* 발생 시각 */}
                        <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                          <Clock size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">발생 시각</p>
                            <span className="text-[12px] font-medium text-slate-700">{formatDateTime(log.created_at)}</span>
                          </div>
                        </div>

                        {/* 전체 메시지 */}
                        <div className="sm:col-span-2 flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                          <AlertCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">오류 메시지</p>
                            <p className="text-[12px] text-slate-700 break-words">{log.error_message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 빈 상태 */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">검색 결과가 없습니다</p>
              <p className="text-xs text-slate-400 mt-1">다른 검색어를 입력해보세요</p>
            </div>
          )}

          {/* 하단 페이지네이션 */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                전체 <span className="font-semibold text-slate-600">{totalCount.toLocaleString()}건</span>
                {' · '}
                <span className="font-semibold text-slate-600">{currentPage}</span> / {totalPages} 페이지
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[12px] font-semibold text-slate-600 px-2">
                  {currentPage}
                </span>
                <button
                  onClick={() => goPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </AdminLayout>
  );
}
