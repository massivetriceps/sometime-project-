import { useState } from 'react';
import {
  Search, UserX, UserCheck, ChevronDown,
  MoreVertical, Users, UserCheck2, UserMinus, Trash2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const MOCK_USERS = [
  { id: 1, name: '김민준', username: 'minjun2024',  email: 'minjun@gachon.ac.kr',   dept: '컴퓨터공학과',   year: 3, status: 'active',    createdAt: '2026-02-15', lastLogin: '2026-04-28' },
  { id: 2, name: '이서연', username: 'seoyeon_lee', email: 'seoyeon@gachon.ac.kr',  dept: '소프트웨어학과', year: 2, status: 'active',    createdAt: '2026-02-20', lastLogin: '2026-04-27' },
  { id: 3, name: '박지훈', username: 'jihoon_p',    email: 'jihoon@gachon.ac.kr',   dept: '컴퓨터공학과',   year: 4, status: 'suspended', createdAt: '2025-08-10', lastLogin: '2026-04-10' },
  { id: 4, name: '최아린', username: 'arinchoi',    email: 'arin@gachon.ac.kr',     dept: 'AI학과',         year: 1, status: 'active',    createdAt: '2026-03-01', lastLogin: '2026-04-28' },
  { id: 5, name: '정우성', username: 'woosung_j',   email: 'woosung@gachon.ac.kr',  dept: '산업경영공학과', year: 3, status: 'active',    createdAt: '2025-09-01', lastLogin: '2026-04-25' },
  { id: 6, name: '한지은', username: 'jieun_han',   email: 'jieun@gachon.ac.kr',    dept: '소프트웨어학과', year: 2, status: 'suspended', createdAt: '2026-01-15', lastLogin: '2026-03-20' },
];

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

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
    status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
    {status === 'active' ? '활성' : '정지됨'}
  </span>
);

export default function AdminUsers() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers]             = useState(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType]     = useState(null);
  const [openMenuId, setOpenMenuId]   = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(search) || u.username.includes(search) || u.email.includes(search);
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openModal  = (user, type) => { setSelectedUser(user); setModalType(type); setOpenMenuId(null); };
  const closeModal = () => { setSelectedUser(null); setModalType(null); };

  const handleStatusToggle = () => {
    setUsers(users.map((u) => u.id === selectedUser.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    closeModal();
  };
  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    closeModal();
  };

  const totalActive    = users.filter((u) => u.status === 'active').length;
  const totalSuspended = users.filter((u) => u.status === 'suspended').length;

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">사용자 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">가천대학교 Sometime 사용자 계정을 관리합니다</p>
        </div>
      </div>

      {/* ── 요약 카드 3개 ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '전체 사용자', value: users.length, icon: Users,       bg: 'bg-[#EEF2FF]', iconColor: 'text-[#4F7CF3]', valColor: 'text-[#4F7CF3]' },
          { label: '활성 계정',   value: totalActive,  icon: UserCheck2,  bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valColor: 'text-emerald-600' },
          { label: '정지 계정',   value: totalSuspended, icon: UserMinus, bg: 'bg-red-50',     iconColor: 'text-red-400',    valColor: 'text-red-500' },
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
              placeholder="이름, 아이디, 이메일로 검색"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/10 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-32 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none appearance-none focus:border-[#4F7CF3] transition-all pr-8 text-slate-600"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="suspended">정지됨</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── 테이블 (데스크탑) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['사용자', '학과 / 학년', '이메일', '상태', '마지막 로그인', '관리'].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">

                {/* 사용자 */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                      <p className="text-[11px] text-slate-400">{user.username}</p>
                    </div>
                  </div>
                </td>

                {/* 학과/학년 */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold ${DEPT_COLOR[user.dept] || 'bg-slate-100 text-slate-500'}`}>
                    {user.dept}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1.5">{user.year}학년</span>
                </td>

                {/* 이메일 */}
                <td className="px-5 py-3.5">
                  <span className="text-[12px] text-slate-500">{user.email}</span>
                </td>

                {/* 상태 */}
                <td className="px-5 py-3.5">
                  <StatusBadge status={user.status} />
                </td>

                {/* 마지막 로그인 */}
                <td className="px-5 py-3.5">
                  <span className="text-[12px] text-slate-400">{user.lastLogin}</span>
                </td>

                {/* 관리 버튼 */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(user, 'status')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        user.status === 'active'
                          ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {user.status === 'active' ? '정지' : '활성화'}
                    </button>
                    <button
                      onClick={() => openModal(user, 'delete')}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

        {/* 하단 페이지 정보 */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-[11px] text-slate-400">
              전체 <span className="font-semibold text-slate-600">{users.length}명</span> 중{' '}
              <span className="font-semibold text-slate-600">{filtered.length}명</span> 표시
            </p>
          </div>
        )}
      </div>

      {/* ── 카드 (모바일) ── */}
      <div className="md:hidden space-y-3">
        {filtered.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                    <StatusBadge status={user.status} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{user.username}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-[12px] text-slate-500 mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${DEPT_COLOR[user.dept] || 'bg-slate-100 text-slate-500'}`}>
                  {user.dept}
                </span>
                <span>{user.year}학년</span>
              </div>
              <p>{user.email}</p>
              <p className="text-slate-400">마지막 로그인 · {user.lastLogin}</p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => openModal(user, 'status')}
                className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
                  user.status === 'active'
                    ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {user.status === 'active' ? '계정 정지' : '계정 활성화'}
              </button>
              <button
                onClick={() => openModal(user, 'delete')}
                className="flex-1 py-2 rounded-xl text-[12px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── 모달 ── */}
      {modalType && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">

            {modalType === 'status' ? (
              <>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  selectedUser.status === 'active' ? 'bg-orange-50' : 'bg-emerald-50'
                }`}>
                  {selectedUser.status === 'active'
                    ? <UserX size={22} className="text-orange-500" />
                    : <UserCheck size={22} className="text-emerald-500" />}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {selectedUser.status === 'active' ? '계정을 정지할까요?' : '계정을 활성화할까요?'}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  <span className="font-semibold text-slate-700">{selectedUser.name}</span> 님의 계정을{' '}
                  {selectedUser.status === 'active' ? '정지하면 로그인이 차단됩니다.' : '활성화하면 즉시 로그인이 가능합니다.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    취소
                  </button>
                  <button
                    onClick={handleStatusToggle}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                      selectedUser.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                  >
                    {selectedUser.status === 'active' ? '정지하기' : '활성화하기'}
                  </button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
