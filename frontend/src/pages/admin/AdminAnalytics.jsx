import { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, PieChart, Pie, Cell,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { TrendingUp, Users, Calendar, BarChart2, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

/* ── mock 데이터 (API 없는 항목) ── */
const FREEYDAY_DATA = [
  { name: '월요일', short: '월', value: 22, color: '#8FA8FF' },
  { name: '화요일', short: '화', value: 15, color: '#8EDDD0' },
  { name: '수요일', short: '수', value: 31, color: '#C3B5FF' },
  { name: '목요일', short: '목', value: 18, color: '#F4AFCF' },
  { name: '금요일', short: '금', value: 44, color: '#F7CFA1' },
];

const PLAN_DATA = [
  { plan: 'Plan A', selected: 420, pct: 42, color: '#4F7CF3' },
  { plan: 'Plan B', selected: 340, pct: 34, color: '#8FA8FF' },
  { plan: 'Plan C', selected: 240, pct: 24, color: '#C3B5FF' },
];

const DEPT_DATA = [
  { dept: '컴퓨터공학과',   short: 'CS',  count: 380, color: '#4F7CF3' },
  { dept: '소프트웨어학과', short: 'SW',  count: 290, color: '#8FA8FF' },
  { dept: 'AI학과',         short: 'AI',  count: 210, color: '#A78BFA' },
  { dept: '정보보안학과',   short: 'SEC', count: 180, color: '#C3B5FF' },
  { dept: '산업경영공학과', short: 'IME', count: 150, color: '#8EDDD0' },
];

/* ratio label 매핑 */
const RATIO_META = [
  { key: 'avoid_uphill_ratio',      label: '오르막 회피', color: '#A78BFA', bg: 'bg-[#F3F0FF]' },
  { key: 'prefer_online_ratio',     label: '온라인 선호', color: '#F7CFA1', bg: 'bg-[#FFFBEA]' },
  { key: 'minimize_gaps_ratio',     label: '연강 회피',   color: '#F4AFCF', bg: 'bg-pink-50'   },
  { key: 'prioritize_required_ratio', label: '전공필수 우선', color: '#4F7CF3', bg: 'bg-[#EEF2FF]' },
];

/* ── 커스텀 툴팁 ── */
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 text-xs">
      {label && <p className="font-semibold text-slate-600 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-700">{p.value}{p.name?.includes('비율') || p.name?.includes('%') ? '%' : '명'}</span>
        </div>
      ))}
    </div>
  );
};

/* ── 커스텀 파이 라벨 ── */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  if (value < 10) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {value}%
    </text>
  );
};

export default function AdminAnalytics() {
  const [period, setPeriod]   = useState('7d');
  const [loading, setLoading] = useState(true);
  const [prefData, setPrefData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/api/admin/stats/preferences');
      setPrefData(res.data.success.data);
    } catch (err) {
      console.error('Analytics preferences fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ratio 값(0~1) → 퍼센트 변환 */
  const toPercent = (val) =>
    val === undefined || val === null ? 0 : Math.round(val * 100);

  /* 레이더 차트용 데이터 */
  const radarData = RATIO_META.map((m) => ({
    subject: m.label,
    A: prefData ? toPercent(prefData.ratios?.[m.key]) : 0,
  }));

  /* 바 리스트 데이터 */
  const barListData = RATIO_META.map((m) => ({
    ...m,
    val: prefData ? toPercent(prefData.ratios?.[m.key]) : 0,
  }));

  /* 가장 높은 ratio label */
  const topLabel = (() => {
    if (!prefData?.ratios) return '—';
    const best = RATIO_META.reduce((prev, cur) =>
      (prefData.ratios[cur.key] || 0) > (prefData.ratios[prev.key] || 0) ? cur : prev
    );
    return best.label;
  })();

  const topPct = (() => {
    if (!prefData?.ratios) return 0;
    const best = RATIO_META.reduce((prev, cur) =>
      (prefData.ratios[cur.key] || 0) > (prefData.ratios[prev.key] || 0) ? cur : prev
    );
    return toPercent(prefData.ratios[best.key]);
  })();

  const SUMMARY = [
    {
      label: '총 시간표 생성',
      value: '4,520',
      sub: '이번 기간',
      icon: Calendar,
      bg: 'bg-[#EEF2FF]', ic: 'text-[#4F7CF3]', vc: 'text-[#4F7CF3]',
    },
    {
      label: '분석된 선호조건',
      value: loading ? '—' : `${prefData?.total_preferences_count ?? '—'}건`,
      sub: '활성 조건',
      icon: TrendingUp,
      bg: 'bg-[#E6FAF8]', ic: 'text-[#2EC4B6]', vc: 'text-[#2EC4B6]',
    },
    {
      label: '최다 선호 조건',
      value: loading ? '—' : topLabel,
      sub: loading ? '' : `선택률 ${topPct}%`,
      icon: BarChart2,
      bg: 'bg-[#F3F0FF]', ic: 'text-[#A78BFA]', vc: 'text-[#A78BFA]',
    },
    {
      label: '선호 요일',
      value: '금요일',
      sub: '공강 44%',
      icon: Users,
      bg: 'bg-[#FFFBEA]', ic: 'text-yellow-500', vc: 'text-yellow-600',
    },
  ];

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">선호 조건 분석</h1>
          <p className="text-xs text-slate-400 mt-0.5">사용자 시간표 생성 시 선택한 조건 통계</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {[
              { val: '7d',  label: '7일' },
              { val: '30d', label: '30일' },
              { val: 'all', label: '전체' },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setPeriod(p.val)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  period === p.val
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 shadow-sm transition-all"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>

      {/* ── 요약 카드 4개 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.ic} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium truncate">{s.label}</p>
              <p className={`text-lg font-bold ${s.vc}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 1행: 레이더 + 파이 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* 레이더: 선호 조건 인기도 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-1">
            <h3 className="text-sm font-bold text-slate-800">선호 조건 인기도</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">조건별 사용자 선택 비율</p>
          </div>

          {loading ? (
            <div className="h-[210px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                />
                <Radar
                  name="선택률"
                  dataKey="A"
                  stroke="#4F7CF3"
                  fill="#4F7CF3"
                  fillOpacity={0.12}
                  strokeWidth={2.5}
                  dot={{ fill: '#4F7CF3', r: 3 }}
                />
                <Tooltip formatter={(v) => [`${v}%`, '선택률']} />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {/* 조건별 바 리스트 */}
          <div className="space-y-2 mt-1">
            {barListData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-[12px] text-slate-500 w-24 flex-shrink-0">{d.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.val}%`, background: d.color }}
                  />
                </div>
                <span className="text-[12px] font-bold w-9 text-right flex-shrink-0" style={{ color: d.color }}>
                  {loading ? '—' : `${d.val}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 파이: 공강 선호 요일 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-1">
            <h3 className="text-sm font-bold text-slate-800">공강 선호 요일 분포</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">원하는 공강 요일 선택 비율</p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={FREEYDAY_DATA}
                cx="50%" cy="50%"
                innerRadius={52}
                outerRadius={82}
                dataKey="value"
                paddingAngle={3}
                labelLine={false}
                label={<PieLabel />}
              >
                {FREEYDAY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '선택 비율']} />
            </PieChart>
          </ResponsiveContainer>

          {/* 요일 범례 */}
          <div className="grid grid-cols-5 gap-2 mt-2">
            {FREEYDAY_DATA.map((d) => (
              <div key={d.name} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ background: d.color }}
                >
                  {d.short}
                </div>
                <span className="text-[11px] font-bold text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>

          {/* 최다 요일 강조 */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FFFBEA] rounded-xl border border-yellow-100">
            <div className="w-5 h-5 rounded-lg bg-[#F7CFA1] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">금</div>
            <p className="text-[12px] font-semibold text-yellow-700">
              금요일 공강 선호가 44%로 가장 높습니다
            </p>
          </div>
        </div>
      </div>

      {/* ── 2행: Plan 분포 + 학과별 이용 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Plan 선택 분포 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">최종 선택 Plan 분포</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">생성된 3개 시간표 중 최종 선택 비율</p>
          </div>

          <div className="space-y-4 mb-5">
            {PLAN_DATA.map((p) => (
              <div key={p.plan}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: p.color }}
                    >
                      {p.plan.split(' ')[1]}
                    </div>
                    <span className="text-[13px] font-semibold text-slate-700">{p.plan}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-400">{p.selected.toLocaleString()}명</span>
                    <span className="text-[13px] font-bold" style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.pct}%`, background: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[12px] text-slate-500 font-medium">총 선택 횟수</span>
            <span className="text-sm font-bold text-slate-800">
              {PLAN_DATA.reduce((s, p) => s + p.selected, 0).toLocaleString()}명
            </span>
          </div>
        </div>

        {/* 학과별 이용 현황 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">학과별 이용 현황</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">학과별 시간표 생성 사용자 수</p>
          </div>

          <ResponsiveContainer width="100%" height={185}>
            <BarChart
              data={DEPT_DATA}
              barSize={28}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" name="이용자" radius={[6, 6, 0, 0]}>
                {DEPT_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* 학과 범례 */}
          <div className="space-y-1.5 mt-3">
            {DEPT_DATA.map((d) => (
              <div key={d.dept} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[12px] text-slate-500 flex-1">{d.dept}</span>
                <span className="text-[12px] font-bold text-slate-700">{d.count.toLocaleString()}명</span>
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.count / 380) * 100}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
