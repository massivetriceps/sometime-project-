import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { TimetableProvider } from './context/TimetableContext';
import Landing from './pages/user/Landing';
import Login from './pages/user/Auth/Login';
import Signup from './pages/user/Auth/Signup';
import TimetableSetup from './pages/user/timetable/TimetableSetup';
import Cart from './pages/user/Cart';
import Create from './pages/user/Create';
import Result from './pages/user/Result';
import Support from './pages/user/Support';

function App() {
  return (
    <TimetableProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/timetable/setup" element={<TimetableSetup />} />
          <Route path="/timetable/result" element={<Result />} />
          <Route path="/create" element={<Create />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </BrowserRouter>
    </TimetableProvider>
  );
}

export default App;
