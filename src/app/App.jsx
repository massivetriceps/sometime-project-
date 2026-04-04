import { Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import LandingPage from "@/pages/user/LandingPage"
import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import FindIdPage from "@/pages/auth/FindIdPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import LogoutPage from "@/pages/auth/LogoutPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
