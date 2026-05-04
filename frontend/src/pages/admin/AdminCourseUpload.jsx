import { useState, useRef } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle2, X,
  Download, CloudUpload, Clock, ChevronRight,
  BookOpen, Hash, User, MapPin, Calendar, Star
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const MOCK_PREVIEW = [
  { code: 'CS101', name: '프로그래밍기초', prof: '김민수', room: '공A203', day: '월수', time: '10:00-11:30', credits: 3, type: '전필' },
  { code: 'CS201', name: '자료구조',       prof: '이지연', room: '공B105', day: '화목', time: '13:00-14:30', credits: 3, type: '전필' },
  { code: 'GE001', name: '영어회화',       prof: '박서준', room: '인문관A101', day: '월', time: '14:00-16:00', credits: 2, type: '교양' },
  { code: 'CS301', name: '알고리즘',       prof: '최아린', room: '공A301', day: '수금', time: '09:00-10:30', credits: 3, type: '전선' },
  { code: 'CS401', name: '운영체제',       prof: '정우성', room: '공B201', day: '화목', time: '15:00-16:30', credits: 3, type: '전필' },
];

const HISTORY = [
  { semester: '2026-1학기', count: 480, updated: 12, date: '2026-04-20' },
  { semester: '2025-2학기', count: 465, updated:  8, date: '2025-09-01' },
  { semester: '2025-1학기', count: 472, updated:  5, date: '2025-03-15' },
];

const TYPE_STYLE = {
  전필: 'bg-[#EEF2FF] text-[#4F7CF3]',
  전선: 'bg-[#E6FAF8] text-[#2EC4B6]',
  교양: 'bg-[#F3F0FF] text-[#A78BFA]',
};

const COLUMNS = ['강의코드', '강의명', '담당교수', '강의실', '요일', '시간', '학점', '이수구분'];

export default function AdminCourseUpload() {
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus]   = useState(null); // null | previewing | uploading | success
  const [preview, setPreview] = useState([]);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      alert('CSV 또는 Excel 파일만 업로드 가능합니다.');
      return;
    }
    setFile(f);
    setPreview(MOCK_PREVIEW);
    setStatus('previewing');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    setStatus('uploading');
    setTimeout(() => setStatus('success'), 2200);
  };

  const handleReset = () => { setFile(null); setStatus(null); setPreview([]); };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">강의 데이터 업로드</h1>
          <p className="text-xs text-slate-400 mt-0.5">CSV 또는 Excel 파일로 강의 정보를 일괄 등록합니다</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
          <Download size={13} />
          <span className="hidden sm:inline">양식 다운로드</span>
        </button>
      </div>

      {/* ── 컬럼 안내 ── */}
      <div className="bg-[#EEF2FF] border border-[#4F7CF3]/15 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#4F7CF3] flex items-center justify-center">
            <BookOpen size={12} className="text-white" />
          </div>
          <span className="text-[13px] font-bold text-[#4F7CF3]">업로드 양식 필수 컬럼</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COLUMNS.map((col, i) => (
            <div key={col} className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-1.5 border border-[#4F7CF3]/10">
              <span className="text-[10px] font-bold text-[#4F7CF3]/50">{i + 1}</span>
              <span className="text-[11px] font-semibold text-slate-700">{col}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 드롭존 ── */}
      {!file && (
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer mb-5 ${
            dragging
              ? 'border-[#4F7CF3] bg-[#EEF2FF]'
              : 'border-slate-200 bg-white hover:border-[#4F7CF3]/40 hover:bg-slate-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <div className="py-14 flex flex-col items-center text-center px-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all ${
              dragging ? 'bg-[#4F7CF3] scale-110' : 'bg-[#EEF2FF]'
            }`}>
              <CloudUpload size={28} className={dragging ? 'text-white' : 'text-[#4F7CF3]'} />
            </div>
            <p className="text-base font-bold text-slate-700 mb-1.5">
              {dragging ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭해서 업로드'}
            </p>
            <p className="text-[12px] text-slate-400 mb-4">
              .csv · .xlsx · .xls 지원 &nbsp;·&nbsp; 최대 10MB
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#4F7CF3] rounded-xl text-white text-sm font-semibold shadow-lg shadow-[#4F7CF3]/25">
              <Upload size={14} />
              파일 선택
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
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
                {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; 미리보기 {preview.length}건
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                ✓ 형식 확인됨
              </span>
              <button
                onClick={handleReset}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* 미리보기 테이블 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">데이터 미리보기</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">처음 5건을 표시합니다</p>
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
                      { label: '교수',     icon: User },
                      { label: '강의실',   icon: MapPin },
                      { label: '요일',     icon: Calendar },
                      { label: '시간',     icon: Clock },
                      { label: '학점',     icon: Star },
                      { label: '이수구분', icon: null },
                    ].map(({ label, icon: Icon }) => (
                      <th key={label} className="text-left px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          {Icon && <Icon size={10} />}
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {row.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{row.name}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{row.prof}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{row.room}</td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-semibold text-slate-600">{row.day}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] text-slate-500">{row.time}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] font-bold text-slate-700">{row.credits}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${TYPE_STYLE[row.type] || 'bg-slate-100 text-slate-500'}`}>
                          {row.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 확정 버튼 영역 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-700">업로드를 확정하시겠습니까?</p>
              <p className="text-[12px] text-slate-400 mt-0.5">미리보기 외 전체 데이터가 데이터베이스에 등록됩니다</p>
            </div>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <Upload size={14} />
                업로드 확정
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
              <CloudUpload size={20} className="text-[#4F7CF3]" />
            </div>
          </div>
          <p className="text-base font-bold text-slate-700 mb-1.5">강의 데이터를 업로드하는 중</p>
          <p className="text-sm text-slate-400">잠시만 기다려주세요...</p>
          <div className="mt-5 mx-auto w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#4F7CF3] rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* ── 업로드 완료 ── */}
      {status === 'success' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-14 px-6 text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={30} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1.5">업로드 완료!</h3>
          <p className="text-sm text-slate-500 mb-5">{file?.name} 파일이 성공적으로 등록되었습니다.</p>

          {/* 결과 요약 */}
          <div className="inline-flex gap-4 bg-slate-50 rounded-2xl px-6 py-4 mb-6 border border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#4F7CF3]">480</p>
              <p className="text-[11px] text-slate-400 mt-0.5">신규 등록</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2EC4B6]">12</p>
              <p className="text-[11px] text-slate-400 mt-0.5">업데이트</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-700">492</p>
              <p className="text-[11px] text-slate-400 mt-0.5">전체 처리</p>
            </div>
          </div>

          <br />
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] transition-all"
          >
            새 파일 업로드
          </button>
        </div>
      )}

      {/* ── 업로드 이력 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-5">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">업로드 이력</h3>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{HISTORY.length}건</span>
        </div>
        <div className="divide-y divide-slate-50">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={15} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">{h.semester}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400">신규 {h.count}건</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[11px] text-[#2EC4B6]">업데이트 {h.updated}건</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 flex-shrink-0">{h.date}</span>
              <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </AdminLayout>
  );
}
