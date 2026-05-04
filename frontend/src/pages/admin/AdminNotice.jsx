import { useState } from 'react';
import { Plus, Pencil, Trash2, Pin, Search, Eye, Megaphone, X, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const INIT_NOTICES = [
  {
    id: 1,
    title: '2026-1학기 강의 데이터 업데이트 완료',
    content: '2026-1학기 강의 데이터가 업데이트되었습니다. 총 480건의 강의가 등록되었으며 새로운 학기 시간표 생성이 가능합니다.',
    pinned: true, views: 1280, createdAt: '2026-04-20',
  },
  {
    id: 2,
    title: '서버 점검 안내 (4/30 새벽 2~4시)',
    content: '시스템 안정화를 위한 서버 점검이 예정되어 있습니다. 해당 시간에는 서비스 이용이 불가능합니다.',
    pinned: true, views: 920, createdAt: '2026-04-25',
  },
  {
    id: 3,
    title: 'AI 코멘트 기능 개선 안내',
    content: 'AI 시간표 코멘트 생성 품질이 향상되었습니다. 더욱 정확하고 상세한 동선 분석 코멘트를 확인하세요.',
    pinned: false, views: 540, createdAt: '2026-04-15',
  },
  {
    id: 4,
    title: '졸업 요건 데이터 업데이트',
    content: '2022학번 이후 교육과정이 반영되었습니다. 본인의 학번에 맞는 졸업 요건을 다시 확인해주세요.',
    pinned: false, views: 380, createdAt: '2026-04-10',
  },
];

const EMPTY_FORM = { title: '', content: '', pinned: false };

export default function AdminNotice() {
  const [notices, setNotices]       = useState(INIT_NOTICES);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered   = notices.filter((n) => n.title.includes(search) || n.content.includes(search));
  const pinnedList = filtered.filter((n) => n.pinned);
  const normalList = filtered.filter((n) => !n.pinned);

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowModal(true); };
  const openEdit   = (n) => { setForm({ title: n.title, content: n.content, pinned: n.pinned }); setEditTarget(n); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editTarget) {
      setNotices(notices.map((n) => n.id === editTarget.id ? { ...n, ...form } : n));
    } else {
      setNotices([{ id: Date.now(), ...form, views: 0, createdAt: new Date().toISOString().slice(0, 10) }, ...notices]);
    }
    closeModal();
  };

  const handleDelete = () => {
    setNotices(notices.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const NoticeCard = ({ notice }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 왼쪽 아이콘 */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            notice.pinned ? 'bg-[#EEF2FF]' : 'bg-slate-100'
          }`}>
            {notice.pinned
              ? <Pin size={16} className="text-[#4F7CF3]" />
              : <Megaphone size={16} className="text-slate-400" />}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {notice.pinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F7CF3] text-[10px] font-bold uppercase tracking-wide">
                  <Pin size={9} />상단고정
                </span>
              )}
              <h3 className="text-sm font-bold text-slate-800 leading-snug">{notice.title}</h3>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{notice.content}</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">{notice.createdAt}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Eye size={11} />
                {notice.views.toLocaleString()}회
              </span>
            </div>
          </div>

          {/* 버튼 — 호버 시 표시 */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openEdit(notice)}
              className="p-2 rounded-xl hover:bg-[#EEF2FF] text-slate-400 hover:text-[#4F7CF3] transition-colors"
              title="수정"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(notice)}
              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              title="삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">공지사항 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            전체 <span className="font-semibold text-slate-600">{notices.length}건</span>
            <span className="mx-1.5">·</span>
            고정 <span className="font-semibold text-[#4F7CF3]">{notices.filter(n => n.pinned).length}건</span>
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4F7CF3] text-white text-sm font-semibold shadow-lg shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0] active:scale-[0.98] transition-all"
        >
          <Plus size={15} />
          공지사항 작성
        </button>
      </div>

      {/* ── 검색 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── 고정 공지 ── */}
      {pinnedList.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={13} className="text-[#4F7CF3]" />
            <span className="text-[12px] font-bold text-[#4F7CF3] uppercase tracking-wide">고정된 공지사항</span>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{pinnedList.length}</span>
          </div>
          <div className="space-y-2.5">
            {pinnedList.map((n) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </div>
      )}

      {/* ── 일반 공지 ── */}
      {normalList.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={13} className="text-slate-400" />
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">일반 공지사항</span>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{normalList.length}</span>
          </div>
          <div className="space-y-2.5">
            {normalList.map((n) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Search size={20} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">검색 결과가 없습니다</p>
          <p className="text-xs text-slate-400 mt-1">다른 검색어를 입력해보세요</p>
        </div>
      )}

      {/* ── 작성 / 수정 모달 ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                  {editTarget ? <Pencil size={14} className="text-[#4F7CF3]" /> : <Plus size={14} className="text-[#4F7CF3]" />}
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {editTarget ? '공지사항 수정' : '공지사항 작성'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  제목 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
                  placeholder="공지사항 제목을 입력하세요"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  내용 <span className="text-red-400">*</span>
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                  rows={5}
                  placeholder="공지사항 내용을 입력하세요"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              {/* 상단 고정 토글 */}
              <div
                onClick={() => setForm({ ...form, pinned: !form.pinned })}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  form.pinned
                    ? 'border-[#4F7CF3]/30 bg-[#EEF2FF]'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  form.pinned ? 'bg-[#4F7CF3]' : 'bg-slate-200'
                }`}>
                  <Pin size={15} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${form.pinned ? 'text-[#4F7CF3]' : 'text-slate-600'}`}>
                    상단 고정
                  </p>
                  <p className="text-[11px] text-slate-400">사용자 공지사항 목록 최상단에 표시됩니다</p>
                </div>
                {/* 토글 */}
                <div className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${form.pinned ? 'bg-[#4F7CF3]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform shadow-sm ${form.pinned ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>

              {/* 유효성 경고 */}
              {(!form.title.trim() || !form.content.trim()) && (form.title || form.content) && (
                <div className="flex items-center gap-2 text-[12px] text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  <AlertTriangle size={13} />
                  제목과 내용을 모두 입력해주세요.
                </div>
              )}
            </div>

            {/* 모달 하단 버튼 */}
            <div className="px-6 pb-6 flex gap-2.5">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white hover:bg-[#3B6AE0] transition-colors shadow-lg shadow-[#4F7CF3]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {editTarget ? '수정 완료' : '게시하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 삭제 확인 모달 ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">공지사항을 삭제할까요?</h3>
            <p className="text-sm text-slate-500 mb-1.5 line-clamp-2">
              <span className="font-semibold text-slate-700">"{deleteTarget.title}"</span>
            </p>
            <p className="text-xs text-red-400 font-medium mb-6">⚠ 삭제된 공지사항은 복구할 수 없습니다.</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
