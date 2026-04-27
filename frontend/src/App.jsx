import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
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

function PrivateRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"        element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup"       element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/find-account" element={<PublicOnlyRoute><FindAccount /></PublicOnlyRoute>} />
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;