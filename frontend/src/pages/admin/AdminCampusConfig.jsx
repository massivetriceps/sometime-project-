import { useState } from 'react';
import {
  Save, MapPin, TrendingUp, Plus, Pencil,
  CheckCircle2, X, ArrowRight, Navigation,
  ChevronDown, AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

// 건물명 → DB building_id 매핑 (BUILDINGS 테이블 삽입 순서 기준)
const BUILDING_MAP = {
  '공학관A':    1,
  '공학관B':    2,
  '비전타워':   3,
  '바이오나노관': 4,
  '예술체육관': 5,
  '중앙도서관': 6,
  '학생회관':   7,
  '인문관':     8,
};

const BUILDINGS = Object.keys(BUILDING_MAP);

const INIT_MATRIX = {
  '공학관A-공학관B':     { distance: 120, slope: 2  },
  '공학관A-비전타워':    { distance: 350, slope: 5  },
  '공학관A-바이오나노관':{ distance: 480, slope: 8  },
  '공학관A-예술체육관':  { distance: 520, slope: 12 },
  '공학관B-비전타워':    { distance: 280, slope: 3  },
  '공학관B-바이오나노관':{ distance: 420, slope: 6  },
  '비전타워-중앙도서관': { distance: 200, slope: 1  },
  '비전타워-학생회관':   { distance: 180, slope: 2  },
  '중앙도서관-학생회관': { distance:  90, slope: 0  },
  '학생회관-인문관':     { distance: 230, slope: 3  },
};

const getSlopeInfo = (slope) => {
  if (slope >= 10) return { label: '급경사', bg: 'bg-red-50',     text: 'text-red-500',    dot: 'bg-red-400',    bar: 'bg-red-400'    };
  if (slope >= 5)  return { label: '보통',   bg: 'bg-orange-50',  text: 'text-orange-500', dot: 'bg-orange-400', bar: 'bg-orange-400' };
  return              { label: '완만',   bg: 'bg-emerald-50', text: 'text-emerald-600',dot: 'bg-emerald-400',bar: 'bg-emerald-400'};
};

const getDistanceInfo = (dist) => {
  if (dist >= 400) return { label: '원거리', color: 'text-red-400'    };
  if (dist >= 200) return { label: '중거리', color: 'text-orange-400' };
  return              { label: '근거리', color: 'text-emerald-500' };
};

export default function AdminCampusConfig() {
  const [matrix, setMatrix]     = useState(INIT_MATRIX);
  const [editKey, setEditKey]   = useState(null);
  const [editForm, setEditForm] = useState({ distance: 0, slope: 0 });
  const [saved, setSaved]       = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [newRoute, setNewRoute] = useState({ from: '', to: '', distance: '', slope: '' });
  const [filterSlope, setFilterSlope] = useState('all');

  const entries = Object.entries(matrix).filter(([, val]) => {
    if (filterSlope === 'flat')   return val.slope < 5;
    if (filterSlope === 'mid')    return val.slope >= 5 && val.slope < 10;
    if (filterSlope === 'steep')  return val.slope >= 10;
    return true;
  });

  const steepCount  = Object.values(matrix).filter(v => v.slope >= 10).length;
  const midCount    = Object.values(matrix).filter(v => v.slope >= 5 && v.slope < 10).length;
  const flatCount   = Object.values(matrix).filter(v => v.slope < 5).length;
  const avgDist     = Math.round(Object.values(matrix).reduce((s, v) => s + v.distance, 0) / Object.keys(matrix).length);

  const handleEdit     = (key)  => { setEditKey(key); setEditForm({ ...matrix[key] }); };
  const handleSaveEdit = ()     => {
    setMatrix({ ...matrix, [editKey]: { distance: Number(editForm.distance), slope: Number(editForm.slope) } });
    setEditKey(null);
  };
  const handleAddRoute = () => {
    if (!newRoute.from || !newRoute.to || !newRoute.distance) return;
    const key = `${newRoute.from}-${newRoute.to}`;
    setMatrix({ ...matrix, [key]: { distance: Number(newRoute.distance), slope: Number(newRoute.slope || 0) } });
    setNewRoute({ from: '', to: '', distance: '', slope: '' });
    setShowAdd(false);
  };

  // distance(m) → time_minutes, slope(°) → is_uphill 변환 후 API 호출
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const distances = Object.entries(matrix)
        .map(([key, val]) => {
          const dashIdx = key.indexOf('-');
          const from = key.slice(0, dashIdx);
          const to   = key.slice(dashIdx + 1);
          return {
            from_building_id: BUILDING_MAP[from],
            to_building_id:   BUILDING_MAP[to],
            time_minutes: Math.max(1, Math.round(val.distance / 80)),
            is_uphill: val.slope >= 5,
          };
        })
        .filter((d) => d.from_building_id && d.to_building_id);

      await adminApi.put('/api/admin/campus/distance', { distances });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">캠퍼스 지리 정보 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">건물 간 이동 거리 및 경사 가중치를 설정합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">경로 추가</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              saved
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-[#4F7CF3] text-white shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0]'
            }`}
          >
            {saved
              ? <><CheckCircle2 size={14} />저장됨</>
              : saving
                ? <><Save size={14} className="animate-spin" />저장 중...</>
                : <><Save size={14} />저장</>}
          </button>
        </div>
      </div>

      {/* ── 에러 알림 ── */}
      {saveError && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          <AlertTriangle size={14} className="flex-shrink-0" />
          {saveError}
          <button onClick={() => setSaveError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── 요약 카드 4개 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: '전체 경로',  value: Object.keys(matrix).length, unit: '개', icon: Navigation, bg: 'bg-[#EEF2FF]', iconColor: 'text-[#4F7CF3]', valColor: 'text-[#4F7CF3]' },
          { label: '완만 구간',  value: flatCount,  unit: '개', icon: TrendingUp, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valColor: 'text-emerald-600' },
          { label: '보통 경사',  value: midCount,   unit: '개', icon: TrendingUp, bg: 'bg-orange-50',  iconColor: 'text-orange-500',  valColor: 'text-orange-500'  },
          { label: '급경사',     value: steepCount, unit: '개', icon: AlertTriangle, bg: 'bg-red-50', iconColor: 'text-red-500',    valColor: 'text-red-500'     },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.iconColor} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.valColor}`}>{s.value}<span className="text-sm ml-0.5">{s.unit}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 경사 범례 + 필터 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4">
          {[
            { dot: 'bg-emerald-400', label: '0~4° 완만',         desc: '이동 부담 없음' },
            { dot: 'bg-orange-400',  label: '5~9° 보통',          desc: 'CSP 소폭 가중치' },
            { dot: 'bg-red-400',     label: '10°+ 급경사',        desc: 'CSP 높은 가중치 적용' },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${g.dot} flex-shrink-0`} />
              <span className="text-[12px] font-semibold text-slate-600">{g.label}</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">· {g.desc}</span>
            </div>
          ))}
        </div>
        {/* 필터 탭 */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-shrink-0">
          {[
            { val: 'all',   label: '전체' },
            { val: 'flat',  label: '완만' },
            { val: 'mid',   label: '보통' },
            { val: 'steep', label: '급경사' },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setFilterSlope(f.val)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterSlope === f.val ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 경로 리스트 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#4F7CF3]" />
            <h3 className="text-sm font-bold text-slate-800">건물 간 경로 데이터</h3>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
            {entries.length}개
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {entries.map(([key, val]) => {
            const [from, to] = key.split('-');
            const isEditing  = editKey === key;
            const slope      = getSlopeInfo(val.slope);
            const dist       = getDistanceInfo(val.distance);

            return (
              <div key={key} className={`transition-colors ${isEditing ? 'bg-[#EEF2FF]/40' : 'hover:bg-slate-50/70'}`}>
                {isEditing ? (
                  /* ── 편집 모드 ── */
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#4F7CF3] flex items-center justify-center">
                        <Pencil size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-bold text-[#4F7CF3]">{from}</span>
                      <ArrowRight size={13} className="text-slate-400" />
                      <span className="text-sm font-bold text-[#4F7CF3]">{to}</span>
                      <span className="text-[11px] text-slate-400 ml-1">편집 중</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">이동 거리 (m)</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-[#4F7CF3]/30 bg-white px-3 py-2 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all"
                          value={editForm.distance}
                          onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">경사도 (°)</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-[#4F7CF3]/30 bg-white px-3 py-2 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all"
                          value={editForm.slope}
                          onChange={(e) => setEditForm({ ...editForm, slope: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditKey(null)}
                        className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 py-2 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white hover:bg-[#3B6AE0] transition-colors"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── 뷰 모드 ── */
                  <div className="px-5 py-3.5 flex items-center gap-4 group">
                    {/* 경로 아이콘 */}
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Navigation size={14} className="text-slate-400" />
                    </div>

                    {/* 출발 → 도착 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-700">{from}</span>
                        <ArrowRight size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700">{to}</span>
                      </div>
                      {/* 거리 바 */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 max-w-[120px] h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${slope.bar}`}
                            style={{ width: `${Math.min((val.distance / 600) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold ${dist.color}`}>{val.distance}m</span>
                        <span className="text-[10px] text-slate-300">{dist.label}</span>
                      </div>
                    </div>

                    {/* 경사 배지 */}
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 ${slope.bg} ${slope.text}`}>
                      <TrendingUp size={11} />
                      {val.slope}°
                      <span className="hidden sm:inline font-medium opacity-70">· {slope.label}</span>
                    </div>

                    {/* 편집 버튼 (호버 시) */}
                    <button
                      onClick={() => handleEdit(key)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#4F7CF3] hover:bg-[#EEF2FF] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {entries.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400">해당 조건의 경로가 없습니다.</p>
          </div>
        )}
      </div>

      {/* ── 경로 추가 모달 ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                  <Plus size={15} className="text-[#4F7CF3]" />
                </div>
                <h3 className="text-base font-bold text-slate-800">새 경로 추가</h3>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 출발 → 도착 */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-2">경로 설정</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">출발 건물</p>
                    <div className="relative">
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] transition-all pr-7 text-slate-700"
                        value={newRoute.from}
                        onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                      >
                        <option value="">선택</option>
                        {BUILDINGS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">도착 건물</p>
                    <div className="relative">
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] transition-all pr-7 text-slate-700"
                        value={newRoute.to}
                        onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                      >
                        <option value="">선택</option>
                        {BUILDINGS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 경로 미리보기 */}
                {newRoute.from && newRoute.to && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-[#EEF2FF] rounded-xl">
                    <MapPin size={12} className="text-[#4F7CF3] flex-shrink-0" />
                    <span className="text-[12px] font-semibold text-[#4F7CF3]">{newRoute.from}</span>
                    <ArrowRight size={11} className="text-[#4F7CF3]" />
                    <span className="text-[12px] font-semibold text-[#4F7CF3]">{newRoute.to}</span>
                  </div>
                )}
              </div>

              {/* 거리 / 경사 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">이동 거리 (m)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all"
                    placeholder="예: 350"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">경사도 (°)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all"
                    placeholder="예: 5"
                    value={newRoute.slope}
                    onChange={(e) => setNewRoute({ ...newRoute, slope: e.target.value })}
                  />
                </div>
              </div>

              {/* 경사 안내 */}
              {newRoute.slope !== '' && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold ${getSlopeInfo(Number(newRoute.slope)).bg} ${getSlopeInfo(Number(newRoute.slope)).text}`}>
                  <TrendingUp size={13} />
                  {getSlopeInfo(Number(newRoute.slope)).label} 구간 — {newRoute.slope}°
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-2.5">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddRoute}
                disabled={!newRoute.from || !newRoute.to || !newRoute.distance}
                className="flex-1 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white hover:bg-[#3B6AE0] transition-colors shadow-lg shadow-[#4F7CF3]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                경로 추가
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
