import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, User, ArrowLeft, CreditCard, Search, Mail, LogIn, KeyRound, Copy, Check } from "lucide-react"

export function FindIdForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [foundEmail, setFoundEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    phone: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요"
    if (!formData.studentId.trim()) newErrors.studentId = "학번을 입력해주세요"
    if (!formData.phone.trim()) newErrors.phone = "전화번호를 입력해주세요"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)

    setFoundEmail("us***@example.com")
    setIsSubmitted(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(foundEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2EC4B6]/20 to-[#2EC4B6]/5 rounded-2xl flex items-center justify-center mb-6 relative">
          <Mail className="h-9 w-9 text-[#2EC4B6]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2EC4B6] rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#1F2937] mb-2">계정을 찾았습니다</h3>
        <p className="text-[#6B7280] text-sm mb-4">
          등록된 이메일 주소입니다
        </p>

        <div className="bg-[#F5F7FB] rounded-xl p-4 mb-6 flex items-center justify-between gap-3">
          <span className="text-[#1F2937] font-medium">{foundEmail}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-[#4F7CF3] hover:text-[#3A5FD9] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
            asChild
          >
            <Link to="/auth/login">
              <LogIn className="w-4 h-4 mr-2" />
              로그인하기
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 border-[#E8F0FF] hover:bg-[#F5F7FB] text-[#6B7280] font-medium rounded-xl"
            asChild
          >
            <Link to="/auth/reset-password">
              <KeyRound className="w-4 h-4 mr-2" />
              비밀번호 재설정
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#F4D58D]/30 to-[#F4D58D]/10 rounded-2xl flex items-center justify-center mb-4">
          <Search className="h-7 w-7 text-[#D4A84D]" />
        </div>
        <p className="text-sm text-[#6B7280]">
          가입 시 등록한 정보를 입력하시면
          <br />
          등록된 이메일 주소를 찾아드립니다.
        </p>
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
        type="submit"
        className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            찾는 중...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            아이디 찾기
          </span>
        )}
      </Button>

      <Link
        to="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors mt-4"
      >
        <ArrowLeft className="h-4 w-4" />
        로그인으로 돌아가기
      </Link>
    </form>
  )
}




