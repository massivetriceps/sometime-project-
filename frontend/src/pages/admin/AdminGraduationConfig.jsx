import { useState } from 'react';
import {
  Save, ChevronDown, Pencil, CheckCircle2,
  GraduationCap, BookOpen, BookMarked, Layers, Sparkles, AlertTriangle, Plus
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const DEPTS = ['컴퓨터공학과', '소프트웨어학과', 'AI학과', '정보보안학과', '산업경영공학과'];
const YEARS = ['2020학번', '2021학번', '2022학번', '2023학번', '2024학번', '2025학번'];

const INIT_RULES = {
  '컴퓨터공학과-2022학번': { major_required: 45, major_elective: 21, general: 27, free: 9,  total: 130, note: '융합교양 3학점 포함' },
  '컴퓨터공학과-2023학번': { major_required: 42, major_elective: 24, general: 27, free: 9,  total: 130, note: '' },
  '소프트웨어학과-2022학번': { major_required: 39, major_elective: 27, general: 27, free: 9,  total: 130, note: '' },
};

const FIELDS = [
  { label: '전공 필수', field: 'major_required', icon: BookOpen,   bar: 'bg-[#4F7CF3]', badge: 'bg-[#EEF2FF] text-[#4F7CF3]',   dot: 'bg-[#4F7CF3]'   },
  { label: '전공 선택', field: 'major_elective', icon: BookMarked, bar: 'bg-[#2EC4B6]', badge: 'bg-[#E6FAF8] text-[#2EC4B6]',   dot: 'bg-[#2EC4B6]'   },
  { label: '교양',      field: 'general',         icon: Layers,     bar: 'bg-[#A78BFA]', badge: 'bg-[#F3F0FF] text-[#A78BFA]',   dot: 'bg-[#A78BFA]'   },
  { label: '자유 이수', field: 'free',             icon: Sparkles,   bar: 'bg-[#F4D58D]', badge: 'bg-[#FFFBEA] text-yellow-600', dot: 'bg-[#F4D58D]'   },
];

export default function AdminGraduationConfig() {
  const [dept, setDept]   = useState('컴퓨터공학과');
  const [year, setYear]   = useState('2022학번');
  const [rules, setRules] = useState(INIT_RULES);
  const [saved, setSaved] = useState(false);

  const key     = `${dept}-${year}`;
  const current = rules[key] || { major_required: 0, major_elective: 0, general: 0, free: 0, total: 130, note: '' };
  const isNew   = !rules[key];

  const totalSum = current.major_required + current.major_elective + current.general + current.free;
  const pct      = current.total > 0 ? Math.round((totalSum / current.total) * 100) : 0;
  const isOver   = totalSum > current.total;
  const isValid  = totalSum <= current.total && current.total > 0;

  const handleChange = (field, value) => {
    setRules({ ...rules, [key]: { ...current, [field]: Number(value) } });
  };

  const handleSave = () => {
    if (!rules[key]) {
      setRules({ ...rules, [key]: current });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">졸업 요건 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">학과별 · 학번별 이수 기준을 설정합니다</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
            saved
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-[#4F7CF3] text-white shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0]'
          }`}
        >
          {saved
            ? <><CheckCircle2 size={14} />저장됨</>
            : isNew
            ? <><Plus size={14} />신규 등록</>
            : <><Save size={14} />저장</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 좌측: 선택 + 편집 폼 ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* 학과 / 학번 선택 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <GraduationCap size={14} className="text-[#4F7CF3]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">대상 선택</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* 학과 */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">학과</label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-8 text-slate-700"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    {DEPTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              {/* 학번 */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">학번</label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-8 text-slate-700"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 신규 등록 안내 */}
            {isNew && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                <p className="text-[12px] text-amber-600 font-medium">
                  {dept} · {year}의 졸업 요건이 아직 등록되지 않았습니다. 새로 작성 후 저장하세요.
                </p>
              </div>
            )}
          </div>

          {/* 이수 구분별 학점 입력 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800">
                이수 구분별 학점
                <span className="text-[12px] font-normal text-slate-400 ml-2">{dept} · {year}</span>
              </h3>
              {/* 합계 뱃지 */}
              <span className={`px-2.5 py-1 rounded-xl text-[12px] font-bold ${
                isOver
                  ? 'bg-red-50 text-red-500'
                  : totalSum === current.total
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {totalSum} / {current.total} 학점
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {FIELDS.map(({ label, field, icon: Icon, badge }) => (
                <div key={field} className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${badge}`}>
                      <Icon size={12} />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-600">{label}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base font-bold text-slate-800 outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-12"
                      value={current[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">학점</span>
                  </div>
                  {/* 비율 표시 */}
                  <p className="text-[10px] text-slate-400 mt-1.5 text-right">
                    {current.total > 0 ? Math.round((current[field] / current.total) * 100) : 0}%
                  </p>
                </div>
              ))}
            </div>

            {/* 총 학점 + 특이사항 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                  졸업 최소 학점
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-12"
                    value={current.total}
                    onChange={(e) => handleChange('total', e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">학점</span>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">특이사항</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-300"
                  placeholder="예: 융합교양 3학점 포함"
                  value={current.note || ''}
                  onChange={(e) => setRules({ ...rules, [key]: { ...current, note: e.target.value } })}
                />
              </div>
            </div>

            {/* 초과 경고 */}
            {isOver && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-[12px] text-red-500 font-medium">
                  이수 구분 합계({totalSum}학점)가 졸업 최소 학점({current.total}학점)을 초과했습니다.
                </p>
              </div>
            )}
          </div>

          {/* 학점 배분 시각화 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">학점 배분 현황</h3>
              <span className={`text-[13px] font-bold ${
                isOver ? 'text-red-500' : pct === 100 ? 'text-emerald-600' : 'text-[#4F7CF3]'
              }`}>{pct}%</span>
            </div>

            {/* 누적 바 */}
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full flex rounded-full overflow-hidden transition-all duration-500">
                {FIELDS.map(({ field, bar }, i) => (
                  <div
                    key={i}
                    className={`h-full ${bar} transition-all duration-300`}
                    style={{ width: current.total > 0 ? `${(current[field] / current.total) * 100}%` : '0%' }}
                  />
                ))}
              </div>
            </div>

            {/* 범례 */}
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map(({ label, field, dot, badge }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                    <span className="text-[12px] font-medium text-slate-600">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-slate-800">{current[field]}</span>
                    <span className="text-[10px] text-slate-400">학점</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${badge}`}>
                      {current.total > 0 ? Math.round((current[field] / current.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 우측: 등록된 요건 목록 ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={14} className="text-[#4F7CF3]" />
                <h3 className="text-sm font-bold text-slate-800">등록된 졸업 요건</h3>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {Object.keys(rules).length}건
              </span>
            </div>

            <div className="divide-y divide-slate-50">
              {Object.entries(rules).map(([k, v]) => {
                const [d, y] = k.split('-');
                const isActive = k === key;
                return (
                  <button
                    key={k}
                    onClick={() => { setDept(d); setYear(y); }}
                    className={`w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors ${
                      isActive ? 'bg-[#EEF2FF]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7CF3] flex-shrink-0" />
                          )}
                          <p className={`text-[12px] font-bold truncate ${isActive ? 'text-[#4F7CF3]' : 'text-slate-700'}`}>
                            {d}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400">{y}</p>
                        {v.note && (
                          <p className="text-[10px] text-slate-400 mt-1 truncate">{v.note}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[12px] font-bold text-slate-700">{v.total}학점</span>
                        <Pencil size={11} className="text-slate-300" />
                      </div>
                    </div>

                    {/* 미니 학점 바 */}
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div className="h-full flex rounded-full overflow-hidden">
                        {FIELDS.map(({ field, bar }, i) => (
                          <div
                            key={i}
                            className={`h-full ${bar}`}
                            style={{ width: v.total > 0 ? `${(v[field] / v.total) * 100}%` : '0%' }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 안내 카드 */}
          <div className="bg-[#EEF2FF] border border-[#4F7CF3]/15 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={14} className="text-[#4F7CF3]" />
              <span className="text-[12px] font-bold text-[#4F7CF3]">졸업 요건 설정 안내</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-500 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#4F7CF3] mt-1.5 flex-shrink-0" />
                이수 구분 합계는 졸업 최소 학점을 초과할 수 없습니다
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#4F7CF3] mt-1.5 flex-shrink-0" />
                변경 사항은 저장 후 즉시 시간표 추천에 반영됩니다
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#4F7CF3] mt-1.5 flex-shrink-0" />
                학번별로 교육과정이 다를 수 있으니 학번 구분에 유의하세요
              </li>
            </ul>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
