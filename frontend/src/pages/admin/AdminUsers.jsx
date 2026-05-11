import { useState, useEffect } from 'react';
import {
  Search, UserX, ChevronDown,
  Users, UserCheck2, Trash2, AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../api/adminApi';

const DEPT_COLOR = {
  '컴퓨터공학과':   'bg-[#EEF2FF] text-[#4F7CF3]',
  '소프트웨어학과': 'bg-[#E6FAF8] text-[#2EC4B6]',
  'AI학과':         'bg-[#F3F0FF] text-[#A78BFA]',
  '정보보안학과':   'bg-[#FFF3E0] text-orange-500',
  '산업경영공학과': 'bg-[#FEF9C3] text-yellow-600',
};

const Avatar = ({ name }) => {
  const colors = [
    'bg-[#EEF2FF] text-[#4F7CF3]',
    'bg-[#E6FAF8] text-[#2EC4B6]',
    'bg-[#F3F0FF] text-[#A78BFA]',
    'bg-[#FEF9C3] text-yellow-600',
    'bg-red-50 text-red-400',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-xl ${colors[idx]} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
      {name[0]}
    </div>
  );
};

export default function AdminUsers() {
  const [search, setSearch]             = useState('');
  const [users, setUsers]               = useState([]);
  const [majors, setMajors]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const majorMap = majors.reduce((acc, m) => {
    acc[m.major_id] = m.major_name;
    return acc;
  }, {});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, majorsRes] = await Promise.all([
        adminApi.get('/api/admin/users'),
        adminApi.get('/api/admin/majors'),
      ]);
      setUsers(usersRes.data.success.users || []);
      setMajors(majorsRes.data.success || []);
    } catch (err) {
      console.error('AdminUsers fetch error:', err);
      setError('데이터를 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = users.filter((u) => {
    const majorName = majorMap[u.major_id] || '';
    return (
      (u.name || '').includes(search) ||
      (u.login_id || '').includes(search) ||
      (u.email || '').includes(search) ||
      majorName.includes(search)
    );
  });

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const closeModal = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.delete(`/api/admin/users/${selectedUser.user_id}`);
      setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
      closeModal();
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">사용자 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">가천대학교 Sometime 사용자 계정을 관리합니다</p>
        </div>
      </div>

      {/* ── 요약 카드 2개 ── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: '전체 사용자', value: loading ? '—' : users.length, icon: Users,      bg: 'bg-[#EEF2FF]', iconColor: 'text-[#4F7CF3]', valColor: 'text-[#4F7CF3]' },
          { label: '검색 결과',   value: loading ? '—' : filtered.length, icon: UserCheck2, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valColor: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.iconColor} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.valColor}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 검색 / 필터 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이름, 아이디, 이메일, 학과로 검색"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── 에러 상태 ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* ── 로딩 상태 ── */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#4F7CF3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">불러오는 중...</p>
        </div>
      )}

      {/* ── 테이블 (데스크탑) ── */}
      {!loading && !error && (
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['사용자', '학과 / 학년', '이메일', '학번', '가입일', '관리'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => {
                const majorName = majorMap[user.major_id] || `학과 ID: ${user.major_id}`;
                return (
                  <tr key={user.user_id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* 사용자 */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name || '?'} />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.login_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* 학과/학년 */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold ${DEPT_COLOR[majorName] || 'bg-slate-100 text-slate-500'}`}>
                        {majorName}
                      </span>
                      {user.grade && (
                        <span className="text-[11px] text-slate-400 ml-1.5">{user.grade}학년</span>
                      )}
                    </td>

                    {/* 이메일 */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-slate-500">{user.email}</span>
                    </td>

                    {/* 학번 */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-slate-400">{user.student_id}</span>
                    </td>

                    {/* 가입일 */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-slate-400">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '—'}
                      </span>
                    </td>

                    {/* 관리 버튼 */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">검색 결과가 없습니다</p>
              <p className="text-xs text-slate-400 mt-1">다른 검색어를 입력해보세요</p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-[11px] text-slate-400">
                전체 <span className="font-semibold text-slate-600">{users.length}명</span> 중{' '}
                <span className="font-semibold text-slate-600">{filtered.length}명</span> 표시
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 카드 (모바일) ── */}
      {!loading && !error && (
        <div className="md:hidden space-y-3">
          {filtered.map((user) => {
            const majorName = majorMap[user.major_id] || `학과 ID: ${user.major_id}`;
            return (
              <div key={user.user_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name || '?'} />
                    <div>
                      <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{user.login_id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[12px] text-slate-500 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${DEPT_COLOR[majorName] || 'bg-slate-100 text-slate-500'}`}>
                      {majorName}
                    </span>
                    {user.grade && <span>{user.grade}학년</span>}
                  </div>
                  <p>{user.email}</p>
                  <p className="text-slate-400">학번 · {user.student_id}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="flex-1 py-2 rounded-xl text-[12px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 삭제 모달 ── */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">계정을 삭제할까요?</h3>
            <p className="text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{selectedUser.name}</span> 님의 계정과 모든 데이터가 영구적으로 삭제됩니다.
            </p>
            <p className="text-xs text-red-400 font-medium mb-6">⚠ 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-2">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors">
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
