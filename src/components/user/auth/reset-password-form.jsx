import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, KeyRound, ShieldCheck, CheckCircle, LogIn, Lock } from "lucide-react"

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "새 비밀번호를 입력해주세요"
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  const passwordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const labels = ["", "취약", "보통", "양호", "강력"]
    const colors = ["", "bg-[#EF4444]", "bg-[#F4D58D]", "bg-[#2EC4B6]", "bg-[#2EC4B6]"]

    return { strength, label: labels[strength], color: colors[strength] }
  }

  const { strength, label, color } = passwordStrength()

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2EC4B6]/20 to-[#2EC4B6]/5 rounded-2xl flex items-center justify-center mb-6 relative">
          <Lock className="h-9 w-9 text-[#2EC4B6]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2EC4B6] rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#1F2937] mb-2">비밀번호 변경 완료</h3>
        <p className="text-[#6B7280] text-sm mb-6">
          새로운 비밀번호로 변경되었습니다.
          <br />
          지금 바로 로그인해 보세요.
        </p>

        <Button
          className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
          onClick={() => navigate("/auth/login")}
        >
          <LogIn className="w-4 h-4 mr-2" />
          로그인하기
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#A78BFA]/20 to-[#A78BFA]/5 rounded-2xl flex items-center justify-center mb-4">
          <KeyRound className="h-7 w-7 text-[#A78BFA]" />
        </div>
        <p className="text-sm text-[#6B7280]">
          새로운 비밀번호를 입력해주세요.
          <br />
          보안을 위해 8자 이상으로 설정하세요.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[#1F2937] text-sm font-medium">
          새 비밀번호
        </Label>
        <div className="relative group">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#A78BFA] transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="8자 이상 입력"
            className="pl-10 pr-11 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
        {formData.password && (
          <div className="space-y-1.5 mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= strength ? color : "bg-[#E8F0FF]"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-3.5 h-3.5 ${strength >= 3 ? "text-[#2EC4B6]" : "text-[#6B7280]"}`} />
              <p className="text-xs text-[#6B7280]">
                비밀번호 강도: <span className="font-medium">{label}</span>
              </p>
            </div>
          </div>
        )}
        {errors.password && <p className="text-xs text-[#EF4444]">{errors.password}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-[#1F2937] text-sm font-medium">
          비밀번호 확인
        </Label>
        <div className="relative group">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#A78BFA] transition-colors" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호 재입력"
            className="pl-10 pr-11 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 transition-all"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
        {formData.confirmPassword && formData.password === formData.confirmPassword && (
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#2EC4B6]" />
            <p className="text-xs text-[#2EC4B6]">비밀번호가 일치합니다</p>
          </div>
        )}
        {errors.confirmPassword && <p className="text-xs text-[#EF4444]">{errors.confirmPassword}</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#A78BFA] hover:bg-[#9061F9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#A78BFA]/25 hover:shadow-[#A78BFA]/40 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            변경 중...
          </span>
        ) : (
          "비밀번호 변경하기"
        )}
      </Button>

      <Link
        to="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors mt-4"
      >
        로그인으로 돌아가기
      </Link>
    </form>
  )
}




