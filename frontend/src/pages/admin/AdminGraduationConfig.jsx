import { useState, useEffect } from 'react';
import {
  Save, ChevronDown, Pencil, CheckCircle2,
  GraduationCap, BookOpen, BookMarked, Layers, Sparkles, AlertTriangle, Plus
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const FIELDS = [
  { label: '전공 필수', field: 'major_required', icon: BookOpen,   bar: 'bg-[#4F7CF3]', badge: 'bg-[#EEF2FF] text-[#4F7CF3]', dot: 'bg-[#4F7CF3]' },
  { label: '전공 선택', field: 'major_elective', icon: BookMarked, bar: 'bg-[#2EC4B6]', badge: 'bg-[#E6FAF8] text-[#2EC4B6]', dot: 'bg-[#2EC4B6]' },
  { label: '기초교양',  field: 'basic_liberal',  icon: Layers,     bar: 'bg-[#A78BFA]', badge: 'bg-[#F3F0FF] text-[#A78BFA]', dot: 'bg-[#A78BFA]' },
  { label: '기타교양',  field: 'other_liberal',  icon: Sparkles,   bar: 'bg-[#F4D58D]', badge: 'bg-[#FFFBEA] text-yellow-600', dot: 'bg-[#F4D58D]' },
];

const EMPTY = { major_required: 0, major_elective: 0, basic_liberal: 0, other_liberal: 0, total_credits: 130 };

export default function AdminGraduationConfig() {
  const [majors, setMajors]       = useState([]);
  const [rules, setRules]         = useState([]);
  const [majorId, setMajorId]     = useState('');
  const [year, setYear]           = useState('2024');
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    adminApi.get('/api/admin/majors').then(r => {
      if (r.data.resultType === 'SUCCESS') {
        setMajors(r.data.success);
        if (r.data.success.length > 0) setMajorId(r.data.success[0].major_id);
      }
    }).catch(() => {});

    adminApi.get('/api/admin/graduation/rules').then(r => {
      if (r.data.resultType === 'SUCCESS') setRules(r.data.success);
    }).catch(() => {});
  }, []);

  // 학과/학번 바뀔 때 기존 저장값 불러오기
  useEffect(() => {
    if (!majorId) return;
    const existing = rules.find(r => r.major_id === Number(majorId) && r.apply_year === year);
    if (existing) {
      const otherLib = (existing.convergence_art || 0) + (existing.convergence_society || 0) +
        (existing.convergence_nature || 0) + (existing.convergence_world || 0) +
        (existing.free_liberal || 0) + (existing.area_liberal || 0);
      setForm({
        major_required: existing.major_required,
        major_elective: existing.major_elective,
        basic_liberal:  existing.basic_liberal,
        other_liberal:  otherLib,
        total_credits:  existing.total_credits,
      });
    } else {
      setForm(EMPTY);
    }
  }, [majorId, year, rules]);

  const isExisting = rules.some(r => r.major_id === Number(majorId) && r.apply_year === year);
  const totalSum   = form.major_required + form.major_elective + form.basic_liberal + form.other_liberal;
  const pct        = form.total_credits > 0 ? Math.round((totalSum / form.total_credits) * 100) : 0;
  const isOver     = totalSum > form.total_credits;

  const handleSave = async () => {
    if (!majorId) return;
    setSaving(true);
    try {
      await adminApi.put('/api/admin/graduation/rules', {
        major_id:       Number(majorId),
        apply_year:     year,
        total_credits:  form.total_credits,
        major_required: form.major_required,
        major_elective: form.major_elective,
        basic_liberal:  form.basic_liberal,
        free_liberal:   form.other_liberal,
      });
      // 목록 갱신
      const r = await adminApi.get('/api/admin/graduation/rules');
      if (r.data.resultType === 'SUCCESS') setRules(r.data.success);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const selectedMajor = majors.find(m => m.major_id === Number(majorId));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">졸업 요건 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">학과별 · 학번별 이수 기준을 설정합니다</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !majorId}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50 ${
            saved
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-[#4F7CF3] text-white shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0]'
          }`}
        >
          {saved
            ? <><CheckCircle2 size={14} />저장됨</>
            : !isExisting
            ? <><Plus size={14} />신규 등록</>
            : <><Save size={14} />저장</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">학과</label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-8 text-slate-700"
                    value={majorId}
                    onChange={e => setMajorId(e.target.value)}
                  >
                    {majors.map(m => <option key={m.major_id} value={m.major_id}>{m.major_name}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">학번</label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-8 text-slate-700"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}학번</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {!isExisting && majorId && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                <p className="text-[12px] text-amber-600 font-medium">
                  {selectedMajor?.major_name} · {year}학번의 졸업 요건이 아직 등록되지 않았습니다. 새로 작성 후 저장하세요.
                </p>
              </div>
            )}
          </div>

          {/* 이수 구분별 학점 입력 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800">
                이수 구분별 학점
                <span className="text-[12px] font-normal text-slate-400 ml-2">{selectedMajor?.major_name} · {year}학번</span>
              </h3>
              <span className={`px-2.5 py-1 rounded-xl text-[12px] font-bold ${
                isOver
                  ? 'bg-red-50 text-red-500'
                  : totalSum === form.total_credits
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {totalSum} / {form.total_credits} 학점
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
                      value={form[field]}
                      onChange={e => setForm({ ...form, [field]: Number(e.target.value) })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">학점</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-right">
                    {form.total_credits > 0 ? Math.round((form[field] / form.total_credits) * 100) : 0}%
                  </p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">졸업 최소 학점</label>
              <div className="relative w-40">
                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all pr-12"
                  value={form.total_credits}
                  onChange={e => setForm({ ...form, total_credits: Number(e.target.value) })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">학점</span>
              </div>
            </div>

            {isOver && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-[12px] text-red-500 font-medium">
                  이수 구분 합계({totalSum}학점)가 졸업 최소 학점({form.total_credits}학점)을 초과했습니다.
                </p>
              </div>
            )}
          </div>

          {/* 학점 배분 시각화 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">학점 배분 현황</h3>
              <span className={`text-[13px] font-bold ${isOver ? 'text-red-500' : pct === 100 ? 'text-emerald-600' : 'text-[#4F7CF3]'}`}>{pct}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full flex rounded-full overflow-hidden transition-all duration-500">
                {FIELDS.map(({ field, bar }, i) => (
                  <div key={i} className={`h-full ${bar} transition-all duration-300`}
                    style={{ width: form.total_credits > 0 ? `${(form[field] / form.total_credits) * 100}%` : '0%' }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map(({ label, field, dot, badge }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                    <span className="text-[12px] font-medium text-slate-600">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-slate-800">{form[field]}</span>
                    <span className="text-[10px] text-slate-400">학점</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${badge}`}>
                      {form.total_credits > 0 ? Math.round((form[field] / form.total_credits) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: 등록된 요건 목록 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={14} className="text-[#4F7CF3]" />
                <h3 className="text-sm font-bold text-slate-800">등록된 졸업 요건</h3>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{rules.length}건</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {rules.length === 0 && (
                <p className="px-5 py-4 text-[12px] text-slate-400">등록된 졸업요건이 없습니다.</p>
              )}
              {rules.map(r => {
                const isActive = r.major_id === Number(majorId) && r.apply_year === year;
                return (
                  <button
                    key={r.req_id}
                    onClick={() => { setMajorId(String(r.major_id)); setYear(r.apply_year); }}
                    className={`w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors ${isActive ? 'bg-[#EEF2FF]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#4F7CF3] flex-shrink-0" />}
                          <p className={`text-[12px] font-bold truncate ${isActive ? 'text-[#4F7CF3]' : 'text-slate-700'}`}>
                            {r.majors?.major_name ?? `학과 #${r.major_id}`}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400">{r.apply_year}학번</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[12px] font-bold text-slate-700">{r.total_credits}학점</span>
                        <Pencil size={11} className="text-slate-300" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#EEF2FF] border border-[#4F7CF3]/15 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={14} className="text-[#4F7CF3]" />
              <span className="text-[12px] font-bold text-[#4F7CF3]">졸업 요건 설정 안내</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-500 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#4F7CF3] mt-1.5 flex-shrink-0" />
                학과와 학번을 선택하고 학점을 입력한 후 저장하세요
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#4F7CF3] mt-1.5 flex-shrink-0" />
                기타교양은 free_liberal 항목으로 저장됩니다
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
