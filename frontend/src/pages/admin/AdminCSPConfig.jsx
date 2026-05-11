import { useState } from 'react';
import {
  Save, CheckCircle2, RotateCcw, Info,
  Lock, Sliders, Zap, Clock, BookOpen,
  TrendingUp, Sun, Wifi, LayoutList, Navigation, Calendar
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const INIT_CONFIG = {
  maxSolutions: 3,
  timeLimit: 500,
  maxCredits: 21,
  minCredits: 12,
  weights: {
    slopeAvoidance:   8,
    freeDay:          9,
    morningAvoid:     7,
    onlinePreference: 5,
    consecutiveAvoid: 6,
    distanceMinimize: 8,
  },
  hardConstraints: {
    timeConflict:  true,
    creditLimit:   true,
    majorRequired: true,
  },
  softConstraints: {
    slopeAvoid:   true,
    freeDayPref:  true,
    morningAvoid: true,
    onlinePref:   false,
  },
};

const WEIGHT_META = [
  { key: 'slopeAvoidance',   label: '경사 회피',    desc: '오르막 구간 최소화',      icon: TrendingUp, color: '#4F7CF3' },
  { key: 'freeDay',          label: '공강 확보',    desc: '공강 요일 생성 우선순위',  icon: Calendar,   color: '#2EC4B6' },
  { key: 'morningAvoid',     label: '아침 회피',    desc: '1·2교시 배정 최소화',     icon: Sun,        color: '#F4D58D' },
  { key: 'onlinePreference', label: '온라인 선호',  desc: '온라인 강의 가산점',       icon: Wifi,       color: '#A78BFA' },
  { key: 'consecutiveAvoid', label: '연강 회피',    desc: '연속 강의 최소화',         icon: LayoutList, color: '#F4AFCF' },
  { key: 'distanceMinimize', label: '이동 최소화',  desc: '건물 간 이동 최적화',      icon: Navigation, color: '#8EDDD0' },
];

/* 슬라이더 트랙 색상 계산 */
const weightColor = (val) => {
  if (val >= 8) return '#4F7CF3';
  if (val >= 5) return '#2EC4B6';
  return '#A78BFA';
};

/* 토글 컴포넌트 */
const Toggle = ({ on, onToggle, disabled }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
      on ? 'bg-[#4F7CF3]' : 'bg-slate-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        on ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function AdminCSPConfig() {
  const [config, setConfig] = useState(INIT_CONFIG);
  const [saved, setSaved]   = useState(false);

  const setWeight  = (key, val) => setConfig({ ...config, weights: { ...config.weights, [key]: val } });
  const toggleHard = (key)      => setConfig({ ...config, hardConstraints: { ...config.hardConstraints, [key]: !config.hardConstraints[key] } });
  const toggleSoft = (key)      => setConfig({ ...config, softConstraints: { ...config.softConstraints, [key]: !config.softConstraints[key] } });
  const handleSave  = ()        => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = ()        => setConfig(INIT_CONFIG);

  const activeWeights = Object.values(config.weights).reduce((s, v) => s + v, 0);
  const avgWeight     = (activeWeights / Object.keys(config.weights).length).toFixed(1);

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">CSP 알고리즘 설정</h1>
          <p className="text-xs text-slate-400 mt-0.5">시간표 생성 제약조건 및 가중치를 조정합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">초기화</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              saved
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-[#4F7CF3] text-white shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0]'
            }`}
          >
            {saved ? <><CheckCircle2 size={14} />저장됨</> : <><Save size={14} />저장</>}
          </button>
        </div>
      </div>

      {/* ── 상단 요약 카드 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Plan 생성 수',   value: `${config.maxSolutions}개`,   icon: Zap,      bg: 'bg-[#EEF2FF]', ic: 'text-[#4F7CF3]', vc: 'text-[#4F7CF3]' },
          { label: '응답 제한',       value: `${config.timeLimit}ms`,      icon: Clock,    bg: 'bg-[#E6FAF8]', ic: 'text-[#2EC4B6]', vc: 'text-[#2EC4B6]' },
          { label: '학점 범위',       value: `${config.minCredits}~${config.maxCredits}`, icon: BookOpen, bg: 'bg-[#F3F0FF]', ic: 'text-[#A78BFA]', vc: 'text-[#A78BFA]' },
          { label: '평균 가중치',     value: avgWeight,                    icon: Sliders,  bg: 'bg-[#FFFBEA]', ic: 'text-yellow-500', vc: 'text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.ic} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
              <p className={`text-lg font-bold ${s.vc}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 좌측: 기본 설정 + 제약조건 ── */}
        <div className="space-y-4">

          {/* 기본 설정 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <Sliders size={14} className="text-[#4F7CF3]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">기본 설정</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Plan 생성 수',     field: 'maxSolutions', min: 1,   max: 5,    unit: '개',  desc: 'A / B / C 최대' },
                { label: '최대 응답 시간',   field: 'timeLimit',    min: 100, max: 2000, unit: 'ms',  desc: '초과 시 타임아웃' },
                { label: '최대 수강 학점',   field: 'maxCredits',   min: 12,  max: 27,   unit: '학점', desc: '한 학기 상한' },
                { label: '최소 수강 학점',   field: 'minCredits',   min: 6,   max: 18,   unit: '학점', desc: '한 학기 하한' },
              ].map(({ label, field, min, max, unit, desc }) => (
                <div key={field} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400">{desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      className="w-16 rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all text-center"
                      value={config[field]}
                      onChange={(e) => setConfig({ ...config, [field]: Number(e.target.value) })}
                    />
                    <span className="text-[11px] text-slate-400 w-7">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hard 제약조건 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center">
                <Lock size={13} className="text-red-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Hard 제약조건</h3>
              <div className="relative group ml-auto">
                <Info size={13} className="text-slate-300 cursor-help" />
                <div className="absolute right-0 top-5 hidden group-hover:block bg-slate-800 text-white text-[11px] rounded-xl px-3 py-2 w-44 z-10 shadow-lg">
                  절대 위반 불가 — 항상 적용됩니다
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 ml-9">항상 충족되어야 하는 절대 조건</p>
            <div className="space-y-3">
              {[
                { key: 'timeConflict',  label: '강의 시간 충돌 방지', desc: '겹치는 시간대 강의 제외',     locked: true  },
                { key: 'creditLimit',   label: '학점 한도 준수',       desc: '최소/최대 학점 범위 적용',   locked: false },
                { key: 'majorRequired', label: '전공필수 우선 배정',   desc: '졸업 요건 전공필수 우선',     locked: false },
              ].map(({ key, label, desc, locked }) => (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  config.hardConstraints[key] ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <Toggle
                    on={config.hardConstraints[key]}
                    onToggle={() => !locked && toggleHard(key)}
                    disabled={locked}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soft 제약조건 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-xl bg-[#E6FAF8] flex items-center justify-center">
                <Sliders size={13} className="text-[#2EC4B6]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Soft 제약조건</h3>
              <div className="relative group ml-auto">
                <Info size={13} className="text-slate-300 cursor-help" />
                <div className="absolute right-0 top-5 hidden group-hover:block bg-slate-800 text-white text-[11px] rounded-xl px-3 py-2 w-44 z-10 shadow-lg">
                  가중치로 조절 가능한 선호 조건
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 ml-9">사용자 선호도에 따라 조절 가능</p>
            <div className="space-y-3">
              {[
                { key: 'slopeAvoid',   label: '오르막 경사 회피', desc: '경사 가중치 적용'       },
                { key: 'freeDayPref',  label: '공강 요일 확보',   desc: '사용자 선호 요일 우선'  },
                { key: 'morningAvoid', label: '아침 수업 회피',   desc: '1~2교시 배정 최소화'   },
                { key: 'onlinePref',   label: '온라인 강의 선호', desc: '온라인 강의 가산점 부여'},
              ].map(({ key, label, desc }) => (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  config.softConstraints[key] ? 'bg-[#E6FAF8]/50 border-[#2EC4B6]/20' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <Toggle on={config.softConstraints[key]} onToggle={() => toggleSoft(key)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 우측 2칸: 가중치 설정 ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <Sliders size={14} className="text-[#4F7CF3]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">가중치 설정</h3>
              <span className="ml-auto text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">1 ~ 10</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-5 ml-9">
              값이 높을수록 해당 조건에 더 높은 최적화 우선순위를 부여합니다
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {WEIGHT_META.map(({ key, label, desc, icon: Icon, color }) => {
                const val = config.weights[key];
                const pct = ((val - 1) / 9) * 100;
                return (
                  <div key={key} className="py-3.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}20` }}
                        >
                          <Icon size={13} style={{ color }} />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">{label}</p>
                          <p className="text-[10px] text-slate-400">{desc}</p>
                        </div>
                      </div>
                      {/* 수치 배지 */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: weightColor(val) }}
                      >
                        {val}
                      </div>
                    </div>

                    {/* 슬라이더 */}
                    <div className="relative">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={val}
                        onChange={(e) => setWeight(key, Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #F1F5F9 ${pct}%, #F1F5F9 100%)`,
                          accentColor: color,
                        }}
                      />
                    </div>

                    {/* 눈금 */}
                    <div className="flex justify-between mt-1">
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <div
                          key={n}
                          className={`w-0.5 h-1 rounded-full transition-colors ${
                            n <= val ? 'opacity-60' : 'bg-slate-200'
                          }`}
                          style={{ background: n <= val ? color : undefined }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-300 mt-0.5">
                      <span>낮음</span>
                      <span>높음</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 가중치 분포 요약 바 */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-2.5">가중치 분포 현황</p>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                {WEIGHT_META.map(({ key, color }) => (
                  <div
                    key={key}
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(config.weights[key] / Object.values(config.weights).reduce((s,v) => s+v, 0)) * 100}%`,
                      background: color,
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 mt-3">
                {WEIGHT_META.map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[10px] text-slate-500 truncate">{label}</span>
                    <span className="text-[10px] font-bold ml-auto flex-shrink-0" style={{ color }}>
                      {config.weights[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
