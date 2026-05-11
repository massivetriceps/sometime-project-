import { useState, useRef, useEffect } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle2, X,
  Download, CloudUpload, Clock, ChevronRight,
  BookOpen, Hash, User, Star, AlertCircle, Loader
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

// ── CSV 텍스트 → 행 배열 파싱 (따옴표 처리 포함) ─────────────────
const parseCSV = (text) => {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseRow = (line) => {
    const result = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(l => {
    const vals = parseRow(l);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return { headers, rows };
};

// ── 영역 → 융합교양 classification 매핑 ──────────────────────────────
const AREA_TO_CLASS = [
  { keywords: ['인간과 예술', '인간과예술'],   value: '융합(예술)' },
  { keywords: ['사회와 역사', '사회와역사'],   value: '융합(사회)' },
  { keywords: ['자연과 과학', '자연과과학'],   value: '융합(자연)' },
  { keywords: ['세계와 언어', '세계와언어'],   value: '융합(세계)' },
];

const resolveClassification = (rawClass, area) => {
  const areaStr = (area || '').trim();
  if (areaStr) {
    const matched = AREA_TO_CLASS.find(m => m.keywords.some(k => areaStr.includes(k)));
    if (matched) return matched.value;
  }
  return (rawClass || '').trim();
};

// ── CSV 행 → API 포맷 변환 ─────────────────────────────────────────
const rowToApiFormat = (row, majorMap) => {
  const major_id = majorMap[row['학과명']?.trim()];
  return {
    course_code:    row['강의코드']?.trim()  || '',
    course_name:    row['강의명']?.trim()    || '',
    major_id:       major_id ?? null,
    classification: resolveClassification(row['이수구분'], row['영역']),
    area:           row['영역']?.trim()      || '',
    credits:        parseInt(row['학점']) || 0,
    professor:      row['담당교수']?.trim()  || null,
    capacity:       parseInt(row['정원'])  || 0,
  };
};

// ── 양식 CSV 다운로드 ─────────────────────────────────────────────
const downloadTemplate = () => {
  const header = '강의코드,강의명,학과명,이수구분,영역,학점,담당교수,정원';
  const example = 'CS101,프로그래밍기초,컴퓨터공학부,전필,,3,홍길동,40\nLIB201,사회학의이해,가천리버럴아츠칼리지,교선,[공통선택]사회와 역사,3,홍길동,40';
  const blob = new Blob(['﻿' + header + '\n' + example], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'course_upload_template.csv'; a.click();
  URL.revokeObjectURL(url);
};

const COL_SPEC = ['강의코드', '강의명', '학과명', '이수구분', '영역', '학점', '담당교수', '정원'];

const TYPE_STYLE = {
  전필: 'bg-[#EEF2FF] text-[#4F7CF3]', 전선: 'bg-[#E6FAF8] text-[#2EC4B6]',
  기교: 'bg-[#FFFBEA] text-yellow-600', 교필: 'bg-[#FFFBEA] text-yellow-600',
  교선: 'bg-[#F3F0FF] text-[#A78BFA]', 계교: 'bg-pink-50 text-pink-500',
};

export default function AdminCourseUpload() {
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus]   = useState(null); // null | previewing | uploading | success | error
  const [preview, setPreview] = useState([]);    // 실제 파싱된 데이터 (전체)
  const [result, setResult]   = useState(null);  // { created, updated }
  const [errorMsg, setErrorMsg] = useState('');
  const [majorMap, setMajorMap] = useState({});  // { major_name: major_id }
  const [parseErrors, setParseErrors] = useState([]); // 알 수 없는 학과명 목록
  const inputRef = useRef();

  // ── 학과 목록 로드 ───────────────────────────────────────────────
  useEffect(() => {
    adminApi.get('/api/admin/majors')
      .then(res => {
        if (res.data.resultType === 'SUCCESS') {
          const map = {};
          (res.data.success || []).forEach(m => { map[m.major_name] = m.major_id; });
          setMajorMap(map);
        }
      })
      .catch(() => {});
  }, []);

  // ── 파일 처리 ────────────────────────────────────────────────────
  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['csv'].includes(ext)) {
      alert('CSV 파일만 업로드 가능합니다. (.xlsx는 다른 이름으로 저장 → CSV로 변환해주세요)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const { headers, rows } = parseCSV(text);

      // 필수 컬럼 체크
      const required = ['강의코드', '강의명', '학과명', '이수구분', '학점'];
      const missing = required.filter(c => !headers.includes(c));
      if (missing.length > 0) {
        alert(`필수 컬럼이 없습니다: ${missing.join(', ')}\n첫 행에 컬럼명이 정확히 있어야 합니다.`);
        return;
      }

      // 알 수 없는 학과명 경고
      const unknownMajors = [...new Set(
        rows.map(r => r['학과명']?.trim()).filter(n => n && !majorMap[n])
      )];
      setParseErrors(unknownMajors);
      setFile(f);
      setPreview(rows);
      setStatus('previewing');
    };
    reader.readAsText(f, 'utf-8');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── 업로드 확정 ──────────────────────────────────────────────────
  const handleUpload = async () => {
    setStatus('uploading');
    setErrorMsg('');
    try {
      const courses = preview
        .map(row => rowToApiFormat(row, majorMap))
        .filter(c => c.course_code && c.course_name);

      const res = await adminApi.post('/api/admin/courses/upload', { courses });
      if (res.data.resultType === 'SUCCESS') {
        setResult(res.data.success);
        setStatus('success');
      } else {
        throw new Error(res.data.error?.reason || '업로드 실패');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.reason || err.message || '업로드 중 오류가 발생했습니다.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFile(null); setStatus(null); setPreview([]);
    setResult(null); setErrorMsg(''); setParseErrors([]);
  };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">강의 데이터 업로드</h1>
          <p className="text-xs text-slate-400 mt-0.5">CSV 파일로 강의 정보를 일괄 등록합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await adminApi.get('/api/courses/export', { responseType: 'blob' });
                const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
                const a = document.createElement('a'); a.href = url; a.download = 'courses_export.csv'; a.click();
                URL.revokeObjectURL(url);
              } catch { alert('내보내기 실패'); }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blue-200 text-sm font-medium text-blue-600 hover:bg-blue-50 shadow-sm transition-all"
          >
            <Download size={13} />
            <span className="hidden sm:inline">현재 강의 내보내기</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download size={13} />
            <span className="hidden sm:inline">양식 다운로드</span>
          </button>
        </div>
      </div>

      {/* ── 컬럼 안내 ── */}
      <div className="bg-[#EEF2FF] border border-[#4F7CF3]/15 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#4F7CF3] flex items-center justify-center">
            <BookOpen size={12} className="text-white" />
          </div>
          <span className="text-[13px] font-bold text-[#4F7CF3]">CSV 업로드 양식 (1행: 헤더)</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {COL_SPEC.map((col, i) => (
            <div key={col} className={`flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-1.5 border ${i < 5 ? 'border-[#4F7CF3]/30' : 'border-[#4F7CF3]/10'}`}>
              <span className="text-[10px] font-bold text-[#4F7CF3]/50">{i + 1}</span>
              <span className={`text-[11px] font-semibold ${i < 5 ? 'text-slate-800' : 'text-slate-400'}`}>
                {col}{i < 5 ? ' *' : ''}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#4F7CF3]/70 mt-2">* 필수 컬럼 &nbsp;|&nbsp; 학과명은 시스템에 등록된 학과명과 정확히 일치해야 합니다</p>
      </div>

      {/* ── 드롭존 ── */}
      {!file && (
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer mb-5 ${
            dragging ? 'border-[#4F7CF3] bg-[#EEF2FF]' : 'border-slate-200 bg-white hover:border-[#4F7CF3]/40 hover:bg-slate-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <div className="py-14 flex flex-col items-center text-center px-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all ${dragging ? 'bg-[#4F7CF3] scale-110' : 'bg-[#EEF2FF]'}`}>
              <CloudUpload size={28} className={dragging ? 'text-white' : 'text-[#4F7CF3]'} />
            </div>
            <p className="text-base font-bold text-slate-700 mb-1.5">
              {dragging ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭해서 업로드'}
            </p>
            <p className="text-[12px] text-slate-400 mb-4">.csv 지원 &nbsp;·&nbsp; UTF-8 인코딩 권장</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#4F7CF3] rounded-xl text-white text-sm font-semibold shadow-lg shadow-[#4F7CF3]/25">
              <Upload size={14} /> 파일 선택
            </div>
          </div>
          <input ref={inputRef} type="file" accept=".csv" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}

      {/* ── 파일 선택됨 + 미리보기 ── */}
      {file && status === 'previewing' && (
        <>
          {/* 파일 정보 바 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet size={18} className="text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; 전체 {preview.length}건
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                ✓ {preview.length}건 파싱됨
              </span>
              <button onClick={handleReset}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* 학과명 불일치 경고 */}
          {parseErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 flex items-start gap-2.5">
              <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-bold text-amber-700">알 수 없는 학과명 {parseErrors.length}개</p>
                <p className="text-[12px] text-amber-600 mt-0.5">
                  {parseErrors.join(', ')} — 해당 행은 major_id 없이 등록됩니다. 업로드 후 직접 수정이 필요할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 미리보기 테이블 (최대 10건) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">데이터 미리보기</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">처음 10건 표시 (전체 {preview.length}건 업로드됨)</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#4F7CF3] text-[11px] font-bold">
                {preview.length}건
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[
                      { label: '강의코드', icon: Hash },
                      { label: '강의명',   icon: BookOpen },
                      { label: '학과명',   icon: null },
                      { label: '이수구분', icon: null },
                      { label: '학점',     icon: Star },
                      { label: '담당교수', icon: User },
                    ].map(({ label, icon: Icon }) => (
                      <th key={label} className="text-left px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          {Icon && <Icon size={10} />}{label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {row['강의코드'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{row['강의명'] || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] font-medium ${majorMap[row['학과명']?.trim()] ? 'text-slate-600' : 'text-amber-500'}`}>
                          {row['학과명'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${TYPE_STYLE[row['이수구분']] || 'bg-slate-100 text-slate-500'}`}>
                          {row['이수구분'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] font-bold text-slate-700">{row['학점']}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{row['담당교수'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 확정 버튼 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-700">업로드를 확정하시겠습니까?</p>
              <p className="text-[12px] text-slate-400 mt-0.5">전체 {preview.length}건이 데이터베이스에 등록/업데이트됩니다</p>
            </div>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button onClick={handleReset}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={handleUpload}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
                <Upload size={14} /> 업로드 확정
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 업로드 중 ── */}
      {status === 'uploading' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="w-16 h-16 border-4 border-[#4F7CF3]/15 border-t-[#4F7CF3] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader size={20} className="text-[#4F7CF3]" />
            </div>
          </div>
          <p className="text-base font-bold text-slate-700 mb-1.5">강의 데이터를 업로드하는 중</p>
          <p className="text-sm text-slate-400">{preview.length}건 처리 중... 잠시만 기다려주세요</p>
        </div>
      )}

      {/* ── 업로드 완료 ── */}
      {status === 'success' && result && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-14 px-6 text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={30} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1.5">업로드 완료!</h3>
          <p className="text-sm text-slate-500 mb-5">{file?.name} 파일이 성공적으로 처리되었습니다.</p>
          <div className="inline-flex gap-4 bg-slate-50 rounded-2xl px-6 py-4 mb-6 border border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#4F7CF3]">{result.created ?? 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">신규 등록</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2EC4B6]">{result.updated ?? 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">업데이트</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-700">{(result.created ?? 0) + (result.updated ?? 0)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">전체 처리</p>
            </div>
          </div>
          <br />
          <button onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] transition-all">
            새 파일 업로드
          </button>
        </div>
      )}

      {/* ── 업로드 오류 ── */}
      {status === 'error' && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm py-12 px-6 text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={30} className="text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1.5">업로드 실패</h3>
          <p className="text-sm text-red-500 mb-5">{errorMsg}</p>
          <button onClick={() => setStatus('previewing')}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            다시 시도
          </button>
        </div>
      )}

      {/* ── 업로드 이력 (mock, 이력 API 없음) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-5">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Clock size={14} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">업로드 이력</h3>
          <span className="ml-auto text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">이번 세션</span>
        </div>
        {status === 'success' && result ? (
          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={15} className="text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700">{file?.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-400">신규 {result.created}건</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="text-[11px] text-[#2EC4B6]">업데이트 {result.updated}건</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0">
              {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-[12px] text-slate-400">
            이번 세션에서 업로드한 내역이 없습니다
          </div>
        )}
      </div>

    </AdminLayout>
  );
}
