import { useState } from 'react';
import {
  Search, AlertCircle, Info, AlertTriangle,
  ChevronDown, RefreshCw, Terminal,
  Clock, User, Globe, Hash, ChevronRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const MOCK_LOGS = [
  { id: 1, level: 'error', code: 'CSP_TIMEOUT',  message: 'CSP 최적화 엔진 응답 시간 초과 (>500ms)',  userId: 'user_2041', path: 'POST /api/users/me/timetables',           time: '14:32:15', date: '2026-04-28' },
  { id: 2, level: 'warn',  code: 'AUTH_FAIL',     message: '로그인 실패 3회 연속 시도',                userId: 'unknown',   path: 'POST /api/auth/login',                  time: '14:18:42', date: '2026-04-28' },
  { id: 3, level: 'info',  code: 'UPLOAD_OK',     message: '강의 데이터 업로드 완료 (480건)',          userId: 'admin',     path: 'POST /api/admin/courses/upload',        time: '14:05:30', date: '2026-04-28' },
  { id: 4, level: 'error', code: 'DB_CONN',       message: '데이터베이스 연결 지연 (120ms)',           userId: 'system',    path: 'GET /api/courses',                      time: '13:55:08', date: '2026-04-28' },
  { id: 5, level: 'warn',  code: 'AI_RETRY',      message: 'AI API 응답 재시도 (2/3)',                 userId: 'user_1892', path: 'GET /api/users/me/timetables/12/comment',time: '13:40:21', date: '2026-04-28' },
  { id: 6, level: 'info',  code: 'USER_REG',      message: '신규 사용자 회원가입',                    userId: 'user_2847', path: 'POST /api/auth/register',               time: '13:25:00', date: '2026-04-28' },
  { id: 7, level: 'error', code: 'CSP_NOSOLN',    message: 'CSP 엔진 해 없음 - 제약조건 충돌',        userId: 'user_1203', path: 'POST /api/users/me/timetables',           time: '12:58:44', date: '2026-04-28' },
  { id: 8, level: 'info',  code: 'NOTICE_UPD',    message: '공지사항 등록 완료 (ID: 42)',             userId: 'admin',     path: 'POST /api/admin/notices',               time: '12:30:15', date: '2026-04-28' },
];

const LEVEL_MAP = {
  error: {
    badge:    'bg-red-50 text-red-500 border border-red-100',
    bar:      'border-l-[3px] border-red-400',
    icon:     AlertCircle,
    iconBg:   'bg-red-50',
    iconColor:'text-red-500',
    detailBg: 'bg-red-50/40',
    label:    'Error',
    dot:      'bg-red-400',
  },
  warn: {
    badge:    'bg-orange-50 text-orange-500 border border-orange-100',
    bar:      'border-l-[3px] border-orange-300',
    icon:     AlertTriangle,
    iconBg:   'bg-orange-50',
    iconColor:'text-orange-500',
    detailBg: 'bg-orange-50/40',
    label:    'Warn',
    dot:      'bg-orange-400',
  },
  info: {
    badge:    'bg-[#EEF2FF] text-[#4F7CF3] border border-[#4F7CF3]/10',
    bar:      '',
    icon:     Info,
    iconBg:   'bg-[#EEF2FF]',
    iconColor:'text-[#4F7CF3]',
    detailBg: 'bg-[#EEF2FF]/40',
    label:    'Info',
    dot:      'bg-[#4F7CF3]',
  },
};

const METHOD_COLOR = {
  POST:   'bg-emerald-50 text-emerald-600',
  GET:    'bg-[#EEF2FF] text-[#4F7CF3]',
  PUT:    'bg-amber-50 text-amber-600',
  DELETE: 'bg-red-50 text-red-500',
  PATCH:  'bg-purple-50 text-purple-500',
};

const parseMethod = (path) => path.split(' ')[0];
const parsePath   = (path) => path.split(' ')[1] || path;

export default function AdminLogs() {
  const [search, setSearch]         = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [expanded, setExpanded]     = useState(null);

  const counts = {
    error: MOCK_LOGS.filter(l => l.level === 'error').length,
    warn:  MOCK_LOGS.filter(l => l.level === 'warn').length,
    info:  MOCK_LOGS.filter(l => l.level === 'info').length,
  };

  const filtered = MOCK_LOGS.filter((l) => {
    const matchSearch = l.message.includes(search) || l.code.includes(search) || l.userId.includes(search) || l.path.includes(search);
    const matchLevel  = levelFilter === 'all' || l.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">시스템 로그 조회</h1>
          <p className="text-xs text-slate-400 mt-0.5">오류 및 예외 상황을 실시간으로 추적합니다</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
          <RefreshCw size={13} />
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* ── 요약 카드 3개 + 레벨 필터 탭 ── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { level: 'error', label: 'Error',   count: counts.error, bg: 'bg-red-50',    iconBg: 'bg-red-100',    ic: 'text-red-500',    vc: 'text-red-500',    active: 'border-red-200'    },
          { level: 'warn',  label: 'Warning', count: counts.warn,  bg: 'bg-orange-50', iconBg: 'bg-orange-100', ic: 'text-orange-500', vc: 'text-orange-500', active: 'border-orange-200' },
          { level: 'info',  label: 'Info',    count: counts.info,  bg: 'bg-[#EEF2FF]', iconBg: 'bg-[#D8E5FF]',  ic: 'text-[#4F7CF3]',  vc: 'text-[#4F7CF3]',  active: 'border-[#4F7CF3]/20'},
        ].map((s) => {
          const Meta = LEVEL_MAP[s.level];
          const isActive = levelFilter === s.level;
          return (
            <button
              key={s.level}
              onClick={() => setLevelFilter(isActive ? 'all' : s.level)}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 text-left transition-all hover:shadow-md ${
                isActive ? `${s.active} ring-2 ring-offset-0 ${s.active.replace('border', 'ring')}` : 'border-slate-100'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Meta.icon size={16} className={s.ic} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
                <p className={`text-xl font-bold ${s.vc}`}>{s.count}</p>
              </div>
              {isActive && (
                <div className={`ml-auto w-2 h-2 rounded-full ${Meta.dot}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 검색 바 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="메시지, 코드, 사용자 ID, 엔드포인트로 검색"
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

      {/* ── 로그 리스트 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* 테이블 헤더 */}
        <div className="hidden sm:grid grid-cols-[80px_120px_1fr_120px_90px] gap-4 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          <span>레벨</span>
          <span>코드</span>
          <span>메시지</span>
          <span>사용자</span>
          <span>시각</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.map((log) => {
            const meta       = LEVEL_MAP[log.level];
            const isExpanded = expanded === log.id;
            const method     = parseMethod(log.path);
            const endpoint   = parsePath(log.path);

            return (
              <div
                key={log.id}
                className={`${meta.bar} transition-colors cursor-pointer`}
                onClick={() => setExpanded(isExpanded ? null : log.id)}
              >
                {/* ── 메인 행 ── */}
                <div className={`px-5 py-3.5 flex items-start gap-4 hover:bg-slate-50/70 transition-colors`}>

                  {/* 레벨 아이콘 */}
                  <div className={`w-7 h-7 rounded-lg ${meta.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <meta.icon size={13} className={meta.iconColor} />
                  </div>

                  {/* 코드 + 메시지 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${meta.badge}`}>
                        {log.code}
                      </span>
                      <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${METHOD_COLOR[method] || 'bg-slate-100 text-slate-500'}`}>
                        {method}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-700 font-medium leading-snug">{log.message}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{endpoint}</p>
                  </div>

                  {/* 사용자 */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
                      <User size={10} className="text-slate-400" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{log.userId}</span>
                  </div>

                  {/* 시각 + 펼치기 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">{log.time}</span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* ── 펼침 상세 ── */}
                {isExpanded && (
                  <div className={`px-5 pb-4 ${meta.detailBg} border-t border-slate-100`}>
                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

                      {/* 엔드포인트 */}
                      <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                        <Globe size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">엔드포인트</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${METHOD_COLOR[method] || 'bg-slate-100 text-slate-500'}`}>
                              {method}
                            </span>
                            <span className="text-[12px] font-mono text-[#4F7CF3] break-all">{endpoint}</span>
                          </div>
                        </div>
                      </div>

                      {/* 사용자 ID */}
                      <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                        <User size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">사용자 ID</p>
                          <span className="text-[12px] font-mono font-bold text-slate-700">{log.userId}</span>
                        </div>
                      </div>

                      {/* 발생 시각 */}
                      <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                        <Clock size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">발생 시각</p>
                          <span className="text-[12px] font-medium text-slate-700">{log.date} {log.time}</span>
                        </div>
                      </div>

                      {/* 로그 코드 */}
                      <div className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                        <Hash size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">로그 코드</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${meta.badge}`}>
                            {log.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 에러 전용 액션 버튼 */}
                    {log.level === 'error' && (
                      <div className="mt-3 flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-100 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                          <Terminal size={12} />
                          스택 트레이스 보기
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                          <ChevronRight size={12} />
                          관련 로그 필터
                        </button>
                      </div>
                    )}
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
            <p className="text-xs text-slate-400 mt-1">다른 검색어를 입력하거나 필터를 변경해보세요</p>
          </div>
        )}

        {/* 하단 페이지 정보 */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              전체 <span className="font-semibold text-slate-600">{MOCK_LOGS.length}건</span> 중{' '}
              <span className="font-semibold text-slate-600">{filtered.length}건</span> 표시
            </p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Error {counts.error}
              </span>
              <span className="flex items-center gap-1 text-orange-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Warn {counts.warn}
              </span>
              <span className="flex items-center gap-1 text-[#4F7CF3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F7CF3]" />
                Info {counts.info}
              </span>
            </div>
          </div>
        )}
      </div>

    </AdminLayout>
  );
}
