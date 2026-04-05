import { Routes, Route } from "react-router-dom"
import UserEntryPage from "@/pages/user/auth/UserEntryPage"
import LandingPage from "@/pages/user/LandingPage"
import LoginPage from "@/pages/user/auth/LoginPage"
import SignupPage from "@/pages/user/auth/SignupPage"
import FindIdPage from "@/pages/user/auth/FindIdPage"
import ForgotPasswordPage from "@/pages/user/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/user/auth/ResetPasswordPage"
import LogoutPage from "@/pages/user/auth/LogoutPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserEntryPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/find-id" element={<FindIdPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/logout" element={<LogoutPage />} />
    </Routes>
  )
}

export default App




