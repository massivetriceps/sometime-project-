import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, AtSign, KeyRound, ArrowRight, HelpCircle, UserPlus } from "lucide-react"

export function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsLoading(false)

    navigate("/landing")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email}</p>}
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
            placeholder="비밀번호 입력"
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
        {errors.password && <p className="text-xs text-[#EF4444] mt-1">{errors.password}</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            로그인 중...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            로그인
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 pt-2">
        <Link
          to="/auth/find-id"
          className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#4F7CF3] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          아이디 찾기
        </Link>
        <span className="w-px h-3 bg-[#E8F0FF]" />
        <Link
          to="/auth/forgot-password"
          className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#4F7CF3] transition-colors"
        >
          <KeyRound className="w-3.5 h-3.5" />
          비밀번호 찾기
        </Link>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8F0FF]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-[#6B7280]">또는</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-[#6B7280]">
          아직 계정이 없으신가요?
        </p>
        <Link
          to="/auth/signup"
          className="inline-flex items-center gap-1.5 mt-2 text-[#4F7CF3] hover:text-[#3A5FD9] font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          회원가입
        </Link>
      </div>
    </form>
  )
}




