import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useAdminStore from './store/adminStore';
import Layout from './components/Layout';

// 사용자 페이지
import Landing             from './pages/user/Landing';
import Login               from './pages/user/Login';
import Signup              from './pages/user/Signup';
import FindAccount         from './pages/user/FindAccount';
import MyPage              from './pages/user/MyPage';
import Notice              from './pages/user/Notice';
import Courses             from './pages/user/Courses';
import Cart                from './pages/user/Cart';
import TimetableSetup      from './pages/user/timetable/TimetableSetup';
import TimetableManage     from './pages/user/timetable/TimetableManage';
import GraduationHistory   from './pages/user/graduation/GraduationHistory';
import GraduationDashboard from './pages/user/graduation/GraduationDashboard';

// 관리자 페이지
import AdminLogin          from './pages/admin/AdminLogin';
import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminUsers          from './pages/admin/AdminUsers';
import AdminNotice         from './pages/admin/AdminNotice';
import AdminCourseUpload   from './pages/admin/AdminCourseUpload';
import AdminCampusConfig   from './pages/admin/AdminCampusConfig';
import AdminGraduationConfig from './pages/admin/AdminGraduationConfig';
import AdminAnalytics      from './pages/admin/AdminAnalytics';
import AdminLogs           from './pages/admin/AdminLogs';
import AdminCSPConfig      from './pages/admin/AdminCSPConfig';
import AdminAIPrompt       from './pages/admin/AdminAIPrompt';
import AdminProfile        from './pages/admin/AdminProfile';

// FAQ 인라인 페이지 (별도 파일 없음)
function FAQ() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-pretendard">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">자주 묻는 질문</h1>
      {[
        { q: '시간표는 어떻게 저장하나요?', a: '수강신청 > 장바구니에 과목을 담은 후 시간표 확정 버튼을 누르면 저장됩니다.' },
        { q: '졸업요건 확인은 어디서 하나요?', a: '졸업요건 메뉴에서 수강내역을 입력하면 자동으로 이수 현황을 분석해 드립니다.' },
        { q: '비밀번호를 잊어버렸어요.', a: '로그인 화면의 [아이디/비밀번호 찾기] 링크를 이용해 주세요.' },
        { q: '학과 정보가 잘못 표시돼요.', a: '마이페이지 > 개인정보 수정에서 학과를 직접 변경할 수 있습니다.' },
      ].map(({ q, a }, i) => (
        <div key={i} className="mb-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="font-semibold text-slate-800 mb-2">Q. {q}</p>
          <p className="text-sm text-slate-500">A. {a}</p>
        </div>
      ))}
    </div>
  );
}

function PrivateRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

function AdminRoute({ children }) {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 인증 */}
        <Route path="/login"        element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup"       element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/find-account" element={<PublicOnlyRoute><FindAccount /></PublicOnlyRoute>} />

        {/* 사용자 페이지 */}
        <Route element={<Layout />}>
          <Route path="/"                     element={<Landing />} />
          <Route path="/notice"               element={<Notice />} />
          <Route path="/faq"                  element={<FAQ />} />
          <Route path="/mypage"               element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/courses"              element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/cart"                 element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/timetable/setup"      element={<PrivateRoute><TimetableSetup /></PrivateRoute>} />
          <Route path="/timetable/manage"     element={<PrivateRoute><TimetableManage /></PrivateRoute>} />
          <Route path="/graduation/history"   element={<PrivateRoute><GraduationHistory /></PrivateRoute>} />
          <Route path="/graduation/dashboard" element={<PrivateRoute><GraduationDashboard /></PrivateRoute>} />
        </Route>

        {/* 관리자 페이지 */}
        <Route path="/admin/login"              element={<AdminLogin />} />
        <Route path="/admin/dashboard"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users"              element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/notice"             element={<AdminRoute><AdminNotice /></AdminRoute>} />
        <Route path="/admin/course/upload"      element={<AdminRoute><AdminCourseUpload /></AdminRoute>} />
        <Route path="/admin/campus/config"      element={<AdminRoute><AdminCampusConfig /></AdminRoute>} />
        <Route path="/admin/graduation/config"  element={<AdminRoute><AdminGraduationConfig /></AdminRoute>} />
        <Route path="/admin/analytics"          element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/logs"               element={<AdminRoute><AdminLogs /></AdminRoute>} />
        <Route path="/admin/csp/config"         element={<AdminRoute><AdminCSPConfig /></AdminRoute>} />
        <Route path="/admin/ai/prompt"          element={<AdminRoute><AdminAIPrompt /></AdminRoute>} />
        <Route path="/admin/profile"            element={<AdminRoute><AdminProfile /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

