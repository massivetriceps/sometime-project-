import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Megaphone, X, AlertTriangle, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

const EMPTY_FORM = { title: '', content: '' };

export default function AdminNotice() {
  const [notices, setNotices]           = useState([]);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.get('/api/notices');
      setNotices(res.data.success.content || []);
    } catch (err) {
      console.error('Notice fetch error:', err);
      setError('데이터를 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filtered = notices.filter(
    (n) => n.title.includes(search) || n.content.includes(search)
  );

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowModal(true); };
  const openEdit   = (n) => { setForm({ title: n.title, content: n.content }); setEditTarget(n); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); setSaving(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await adminApi.put(`/api/admin/notices/${editTarget.notice_id}`, {
          title: form.title,
          content: form.content,
        });
      } else {
        await adminApi.post('/api/admin/notices', {
          title: form.title,
          content: form.content,
        });
      }
      closeModal();
      await fetchNotices();
    } catch (err) {
      console.error('Notice save error:', err);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.delete(`/api/admin/notices/${deleteTarget.notice_id}`);
      setDeleteTarget(null);
      await fetchNotices();
    } catch (err) {
      console.error('Notice delete error:', err);
    }
  };

  const NoticeCard = ({ notice }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 왼쪽 아이콘 */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-slate-100">
            <Megaphone size={16} className="text-slate-400" />
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-800 leading-snug">{notice.title}</h3>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{notice.content}</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">
                {notice.created_at
                  ? new Date(notice.created_at).toLocaleDateString('ko-KR')
                  : '—'}
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

      {/* ── 에러 ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchNotices}
            className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* ── 로딩 ── */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">불러오는 중...</p>
        </div>
      )}

      {/* ── 공지 목록 ── */}
      {!loading && !error && (
        <>
          {filtered.length > 0 ? (
            <div className="space-y-2.5">
              {filtered.map((n) => <NoticeCard key={n.notice_id} notice={n} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">검색 결과가 없습니다</p>
              <p className="text-xs text-slate-400 mt-1">다른 검색어를 입력해보세요</p>
            </div>
          )}
        </>
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
                disabled={!form.title.trim() || !form.content.trim() || saving}
                className="flex-1 py-2.5 rounded-xl bg-[#4F7CF3] text-sm font-semibold text-white hover:bg-[#3B6AE0] transition-colors shadow-lg shadow-[#4F7CF3]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {saving ? '저장 중...' : editTarget ? '수정 완료' : '게시하기'}
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
