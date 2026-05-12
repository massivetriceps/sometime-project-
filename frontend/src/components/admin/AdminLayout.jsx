import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Megaphone, Upload, MapPin,
  GraduationCap, BarChart2, PieChart, FileText, Sliders,
  Bot, LogOut, Menu, X, ChevronRight, Bell, UserCog
} from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import adminApi from '../../api/adminApi';

const navItems = [
  { section: '대시보드' },
  { label: '종합 통계', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: '선호 조건 분석', icon: PieChart, path: '/admin/analytics' },
  { label: '시스템 로그', icon: FileText, path: '/admin/logs' },
  { section: '사용자 관리' },
  { label: '사용자 관리', icon: Users, path: '/admin/users' },
  { label: '공지사항 관리', icon: Megaphone, path: '/admin/notice' },
  { section: '데이터 관리' },
  { label: '강의 데이터 업로드', icon: Upload, path: '/admin/course/upload' },
  { label: '캠퍼스 지리 정보', icon: MapPin, path: '/admin/campus/config' },
  { label: '졸업 요건 관리', icon: GraduationCap, path: '/admin/graduation/config' },
  { section: '엔진 관리' },
  { label: 'CSP 알고리즘 설정', icon: Sliders, path: '/admin/csp/config' },
  { label: 'AI 프롬프트 관리', icon: Bot, path: '/admin/ai/prompt' },
  { section: '계정' },
  { label: '계정 설정', icon: UserCog, path: '/admin/profile' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await adminApi.post('/api/admin/logout');
    } catch {
      // 서버 오류여도 로컬 세션은 항상 초기화
    } finally {
      logout();
      navigate('/admin/login');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <span className="text-base font-bold text-text-dark">Sometime</span>
            <p className="text-[10px] text-text-light font-medium">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <p key={i} className="text-[10px] font-bold text-text-light uppercase tracking-widest px-4 pt-4 pb-1.5">
                {item.section}
              </p>
            );
          }
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              <item.icon size={16} className={active ? 'text-primary' : 'text-text-light'} />
              <span>{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin info + logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-gray">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-dark truncate">관리자</p>
            <p className="text-[11px] text-text-light truncate">admin@sometime.kr</p>
          </div>
          <button onClick={handleLogout} className="text-text-light hover:text-red-500 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg-gray overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text-dark"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-light hover:text-text-dark"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button className="relative text-text-light hover:text-primary transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">A</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
