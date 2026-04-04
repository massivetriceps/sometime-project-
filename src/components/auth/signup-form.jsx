import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  AtSign,
  KeyRound,
  User,
  Phone,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  LogIn,
} from "lucide-react"

export function SignupForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    university: "가천대학교",
    name: "",
    studentId: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요"

    if (!formData.studentId.trim()) {
      newErrors.studentId = "학번을 입력해주세요"
    } else if (!/^\d+$/.test(formData.studentId)) {
      newErrors.studentId = "학번은 숫자만 입력 가능합니다"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요"
    } else if (!/^[\d-]+$/.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
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

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    navigate("/auth/login")
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            currentStep >= 1 ? "bg-[#4F7CF3] text-white" : "bg-[#E8F0FF] text-[#6B7280]"
          }`}>
            {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-sm font-medium text-[#1F2937]">기본 정보</span>
        </div>
        <div className={`flex-1 h-0.5 rounded-full transition-colors ${currentStep >= 2 ? "bg-[#4F7CF3]" : "bg-[#E8F0FF]"}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            currentStep >= 2 ? "bg-[#4F7CF3] text-white" : "bg-[#E8F0FF] text-[#6B7280]"
          }`}>
            2
          </div>
          <span className="text-sm font-medium text-[#1F2937]">계정 설정</span>
        </div>
      </div>

      {currentStep === 1 ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="university" className="text-[#1F2937] text-sm font-medium">
              대학교
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#4F7CF3]" />
              <Input
                id="university"
                type="text"
                value={formData.university}
                disabled
                className="pl-10 pr-10 h-12 bg-[#E8F0FF] border-transparent rounded-xl text-[#1F2937] font-medium cursor-not-allowed"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#2EC4B6] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[#1F2937] text-sm font-medium">
              이름
            </Label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                className="pl-10 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-xs text-[#EF4444]">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="studentId" className="text-[#1F2937] text-sm font-medium">
              학번
            </Label>
            <div className="relative group">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="studentId"
                type="text"
                placeholder="202012345"
                className="pl-10 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              />
            </div>
            {errors.studentId && <p className="text-xs text-[#EF4444]">{errors.studentId}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[#1F2937] text-sm font-medium">
              전화번호
            </Label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                className="pl-10 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            {errors.phone && <p className="text-xs text-[#EF4444]">{errors.phone}</p>}
          </div>

          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all mt-2"
          >
            <span className="flex items-center gap-2">
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#1F2937] text-sm font-medium">
              이메일
            </Label>
            <div className="relative group">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="pl-10 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-xs text-[#EF4444]">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#1F2937] text-sm font-medium">
              비밀번호
            </Label>
            <div className="relative group">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="8자 이상 입력"
                className="pl-10 pr-11 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
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
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#6B7280] group-focus-within:text-[#4F7CF3] transition-colors" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호 재입력"
                className="pl-10 pr-11 h-12 bg-[#F5F7FB] border-transparent rounded-xl text-[#1F2937] placeholder:text-[#6B7280]/60 focus:bg-white focus:border-[#4F7CF3] focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all"
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
            {errors.confirmPassword && <p className="text-xs text-[#EF4444]">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1 h-12 border-[#E8F0FF] hover:bg-[#F5F7FB] text-[#6B7280] font-medium rounded-xl"
            >
              이전
            </Button>
            <Button
              type="submit"
              className="flex-[2] h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  가입 중...
                </span>
              ) : (
                "회원가입 완료"
              )}
            </Button>
          </div>
        </form>
      )}

      <div className="text-center mt-6 pt-4 border-t border-[#E8F0FF]">
        <p className="text-sm text-[#6B7280]">
          이미 계정이 있으신가요?
        </p>
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 mt-2 text-[#4F7CF3] hover:text-[#3A5FD9] font-medium transition-colors"
        >
          <LogIn className="w-4 h-4" />
          로그인
        </Link>
      </div>
    </div>
  )
}
