import { useState, useEffect } from 'react';
import {
  Users, Calendar, Activity, TrendingUp,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  AlertCircle, CheckCircle2, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';
import { fmtTime } from '../../utils/date';

const BAR_COLORS = ['#8FA8FF','#8FA8FF','#8FA8FF','#4F7CF3','#8FA8FF','#C3B5FF','#C3B5FF'];

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
    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${accent}`} style={{ width: '60%' }} />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated]   = useState(new Date());
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState('');
  const [stats, setStats] = useState({
    total_count: null,
    today_new_users: null, today_new_users_trend: null,
    daily_active_users: null, daily_active_users_trend: null,
    total_timetables: null, today_timetables_trend: null,
    api_call_counts: null,   api_call_counts_trend: null,
  });
  const [chartData, setChartData]       = useState([]);
  const [weekdayData, setWeekdayData]   = useState([]);
  const [errorLogs, setErrorLogs]       = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const [usageResult, usersResult, errorResult, dailyResult, weekdayResult] = await Promise.allSettled([
        adminApi.get('/api/admin/stats/usage'),
        adminApi.get('/api/admin/users'),
        adminApi.get('/api/admin/stats/error?page=1&limit=5'),
        adminApi.get('/api/admin/stats/daily?days=7'),
        adminApi.get('/api/admin/stats/weekday'),
      ]);

      const usageData  = usageResult.status  === 'fulfilled' ? usageResult.value.data.success.data   : null;
      const usersData  = usersResult.status  === 'fulfilled' ? usersResult.value.data.success         : null;
      const errorData  = errorResult.status  === 'fulfilled' ? errorResult.value.data.success.data    : null;
      const dailyArr   = dailyResult.status  === 'fulfilled' ? (dailyResult.value.data.success.data   ?? []) : [];
      const weekdayArr = weekdayResult.status === 'fulfilled' ? (weekdayResult.value.data.success.data ?? []) : [];

      const anySuccess = [usageResult, usersResult, errorResult, dailyResult, weekdayResult]
        .some(r => r.status === 'fulfilled');
      if (!anySuccess) {
        setFetchError('통계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }

      setStats({
        total_count:              usersData?.total_count ?? null,
        today_new_users:          usageData?.today_new_users ?? null,
        today_new_users_trend:    usageData?.today_new_users_trend ?? null,
        daily_active_users:       usageData?.daily_active_users ?? null,
        daily_active_users_trend: usageData?.daily_active_users_trend ?? null,
        total_timetables:         usageData?.total_timetables ?? null,
        today_timetables_trend:   usageData?.today_timetables_trend ?? null,
        api_call_counts:          usageData?.api_call_counts ?? null,
        api_call_counts_trend:    usageData?.api_call_counts_trend ?? null,
      });
      setChartData(dailyArr);
      setWeekdayData(weekdayArr);
      setErrorLogs(errorData?.content ?? []);
      setLastUpdated(new Date());
    } catch {
      setFetchError('통계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (val) => (loading || val === null || val === undefined ? '—' : val.toLocaleString());

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
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{loading ? '새로고침 중...' : '새로고침'}</span>
        </button>
      </div>

      {/* ── 오류 배너 ── */}
      {fetchError && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          <AlertTriangle size={14} className="flex-shrink-0" />
          {fetchError}
        </div>
      )}

      {/* ── 통계 카드 4개 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          title="전체 사용자"
          value={fmt(stats.total_count)}
          trend={stats.today_new_users_trend}
          sub={loading ? '' : `오늘 신규 ${fmt(stats.today_new_users)}명`}
          icon={Users}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#4F7CF3]"
          accent="bg-[#4F7CF3]"
        />
        <StatCard
          title="오늘 접속자"
          value={fmt(stats.daily_active_users)}
          trend={stats.daily_active_users_trend}
          sub="전일 대비"
          icon={Activity}
          iconBg="bg-[#E6FAF8]"
          iconColor="text-[#2EC4B6]"
          accent="bg-[#2EC4B6]"
        />
        <StatCard
          title="시간표 생성수"
          value={fmt(stats.total_timetables)}
          trend={stats.today_timetables_trend}
          sub="오늘 생성 전일 대비"
          icon={Calendar}
          iconBg="bg-[#F3F0FF]"
          iconColor="text-[#A78BFA]"
          accent="bg-[#A78BFA]"
        />
        <StatCard
          title="API 호출수"
          value={fmt(stats.api_call_counts)}
          trend={stats.api_call_counts_trend}
          sub="오늘 전일 대비"
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
          {loading ? (
            <div className="h-[210px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
          )}
        </div>

        {/* 막대 차트 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-slate-800">요일별 접속 분포</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">최근 30일 기준</p>
          </div>
          {loading ? (
            <div className="h-[210px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={weekdayData} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="접속자" radius={[6, 6, 0, 0]}>
                {weekdayData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── 최근 오류 로그 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">최근 오류 로그</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">최근 5건 기준</p>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {loading ? '—' : `${errorLogs.length}건`}
          </span>
        </div>

        <div className="space-y-1">
          {loading && (
            <div className="py-8 text-center text-[12px] text-slate-400">불러오는 중...</div>
          )}
          {!loading && errorLogs.length === 0 && (
            <div className="py-8 text-center text-[12px] text-slate-400">
              <CheckCircle2 size={20} className="mx-auto mb-2 text-emerald-400" />
              최근 오류 기록이 없습니다
            </div>
          )}
          {!loading && errorLogs.map((log) => (
            <div
              key={log.log_id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-700">{log.error_type}</span>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">system</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{log.error_message}</p>
              </div>
              <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">{fmtTime(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

    </AdminLayout>
  );
}
