<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
=======
﻿import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
>>>>>>> 2efdf399020f7844078853b5e424474c43f95834
