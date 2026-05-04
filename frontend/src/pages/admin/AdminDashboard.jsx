import { useState } from 'react';
import {
  Users, Calendar, Activity, TrendingUp,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  AlertCircle, CheckCircle2, UserPlus, Megaphone
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';

const MOCK_LINE = [
  { date: '4/22', users: 180, timetables: 320 },
  { date: '4/23', users: 210, timetables: 380 },
  { date: '4/24', users: 195, timetables: 340 },
  { date: '4/25', users: 260, timetables: 450 },
  { date: '4/26', users: 237, timetables: 420 },
  { date: '4/27', users: 290, timetables: 510 },
  { date: '4/28', users: 237, timetables: 430 },
];

const MOCK_BAR = [
  { day: '월', count: 85 },
  { day: '화', count: 120 },
  { day: '수', count: 95 },
  { day: '목', count: 140 },
  { day: '금', count: 70 },
  { day: '토', count: 30 },
  { day: '일', count: 20 },
];

const BAR_COLORS = ['#8FA8FF','#8FA8FF','#8FA8FF','#4F7CF3','#8FA8FF','#C3B5FF','#C3B5FF'];

const ACTIVITY = [
  { time: '14:32', type: '시간표 생성', user: 'user_2041', detail: 'Plan A/B/C 생성 완료',            icon: Calendar,     bg: 'bg-[#EEF2FF]', iconColor: 'text-[#4F7CF3]' },
  { time: '14:28', type: '강의 업로드', user: 'admin',     detail: '2026-1학기 강의 480건 업로드',    icon: CheckCircle2, bg: 'bg-[#E6FAF8]', iconColor: 'text-[#2EC4B6]' },
  { time: '14:15', type: '오류 발생',   user: 'system',    detail: 'CSP 엔진 타임아웃 (500ms 초과)',  icon: AlertCircle,  bg: 'bg-red-50',    iconColor: 'text-red-400'   },
  { time: '13:57', type: '회원가입',    user: 'user_2847', detail: '신규 사용자 등록',                icon: UserPlus,     bg: 'bg-[#F3F0FF]', iconColor: 'text-[#A78BFA]' },
  { time: '13:40', type: '공지사항',    user: 'admin',     detail: '2026-1학기 시작 안내 게시',       icon: Megaphone,    bg: 'bg-[#FFFBEA]', iconColor: 'text-yellow-500' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, trend, sub, icon: Icon, iconBg, iconColor, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={18} className={iconColor} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
        }`}>
          {trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-[12px] text-slate-500 font-medium mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
    {/* 하단 액센트 바 */}
    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${accent}`} style={{ width: '60%' }} />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const refresh = () => setLastUpdated(new Date());

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">종합 통계 대시보드</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            마지막 업데이트 · {lastUpdated.toLocaleTimeString('ko-KR')}
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* ── 통계 카드 4개 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          title="전체 사용자"
          value="1,284"
          trend={5.2}
          icon={Users}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#4F7CF3]"
          accent="bg-[#4F7CF3]"
        />
        <StatCard
          title="오늘 접속자"
          value="237"
          trend={-2.1}
          icon={Activity}
          iconBg="bg-[#E6FAF8]"
          iconColor="text-[#2EC4B6]"
          accent="bg-[#2EC4B6]"
        />
        <StatCard
          title="시간표 생성수"
          value="4,520"
          trend={8.4}
          icon={Calendar}
          iconBg="bg-[#F3F0FF]"
          iconColor="text-[#A78BFA]"
          accent="bg-[#A78BFA]"
        />
        <StatCard
          title="평균 세션"
          value="12분 34초"
          sub="전일 대비 +1분 23초"
          icon={TrendingUp}
          iconBg="bg-[#FFFBEA]"
          iconColor="text-yellow-500"
          accent="bg-yellow-400"
        />
      </div>

      {/* ── 차트 영역 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* 면적 차트 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">일별 접속자 및 시간표 생성</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">최근 7일 기준</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F7CF3]" />접속자
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6]" />시간표 생성
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={MOCK_LINE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F7CF3" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4F7CF3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTimetables" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2EC4B6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2EC4B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="접속자" stroke="#4F7CF3" strokeWidth={2.5} fill="url(#gUsers)" dot={false} activeDot={{ r: 4, fill: '#4F7CF3' }} />
              <Area type="monotone" dataKey="timetables" name="시간표 생성" stroke="#2EC4B6" strokeWidth={2.5} fill="url(#gTimetables)" dot={false} activeDot={{ r: 4, fill: '#2EC4B6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 막대 차트 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-slate-800">요일별 접속 분포</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">이번 주 기준</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={MOCK_BAR} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="접속자" radius={[6, 6, 0, 0]}>
                {MOCK_BAR.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 최근 활동 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">최근 시스템 활동</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">오늘 기준</p>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {ACTIVITY.length}건
          </span>
        </div>

        <div className="space-y-1">
          {ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {/* 아이콘 */}
              <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon size={14} className={item.iconColor} />
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-700">{item.type}</span>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{item.user}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.detail}</p>
              </div>

              {/* 시간 */}
              <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

    </AdminLayout>
  );
}
