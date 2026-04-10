import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import { TimetableProvider } from './context/TimetableContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing             from './pages/user/Landing';
import Login               from './pages/user/Login';
import Signup              from './pages/user/Signup';
import FindAccount         from './pages/user/FindAccount';
import MyPage              from './pages/user/MyPage';
import Notice              from './pages/user/Notice';
import Courses             from './pages/user/Courses';
import Cart                from './pages/user/Cart';
import TimetableSetup      from './pages/user/timetable/TimetableSetup';
import Result              from './pages/user/Result';
import TimetableManage     from './pages/user/timetable/TimetableManage';
import GraduationHistory   from './pages/user/graduation/GraduationHistory';
import GraduationDashboard from './pages/user/graduation/GraduationDashboard';

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                     element={<Landing />} />
      <Route path="/login"                element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/signup"               element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
      <Route path="/find-account"         element={<PublicOnlyRoute><FindAccount /></PublicOnlyRoute>} />
      <Route path="/notice"               element={<Notice />} />
      <Route path="/mypage"               element={<PrivateRoute><MyPage /></PrivateRoute>} />
      <Route path="/courses"              element={<PrivateRoute><Courses /></PrivateRoute>} />
      <Route path="/cart"                 element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/timetable/setup"      element={<PrivateRoute><TimetableSetup /></PrivateRoute>} />
      <Route path="/timetable/result"     element={<PrivateRoute><Result /></PrivateRoute>} />
      <Route path="/timetable/manage"     element={<PrivateRoute><TimetableManage /></PrivateRoute>} />
      <Route path="/graduation/history"   element={<PrivateRoute><GraduationHistory /></PrivateRoute>} />
      <Route path="/graduation/dashboard" element={<PrivateRoute><GraduationDashboard /></PrivateRoute>} />
      <Route path="*"                     element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <TimetableProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TimetableProvider>
    </AuthProvider>
  );
}

export default App;