import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css'; 
import Landing from './pages/user/Landing';
import TimeTableG from './pages/user/TimeTableG'; // ★ 방금 만든 시간표 컴포넌트 불러오기

// 1. import 경로를 user/auth/ 하위로 변경합니다.
import Login from './pages/user/Auth/Login'; 
import Signup from './pages/user/Auth/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* ★ 여기에 시간표 생성 라우트를 추가합니다 (소문자 /timetable 로 설정) */}
        <Route path="/timetable" element={<TimeTableG />} />
        
        {/* URL 주소는 폴더 구조와 상관없이 깔끔하게 /login, /signup을 유지합니다 */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;