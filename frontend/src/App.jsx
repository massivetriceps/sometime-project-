import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
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

