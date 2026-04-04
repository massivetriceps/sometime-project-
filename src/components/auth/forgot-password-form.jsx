import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AtSign, Send, ArrowLeft, Mail, RefreshCw, LogIn } from "lucide-react"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateForm = () => {
    if (!email) {
      setError("이메일을 입력해주세요")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2EC4B6]/20 to-[#2EC4B6]/5 rounded-2xl flex items-center justify-center mb-6 relative">
          <Mail className="h-9 w-9 text-[#2EC4B6]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2EC4B6] rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#1F2937] mb-2">이메일을 확인해주세요</h3>
        <p className="text-[#6B7280] text-sm mb-1">
          비밀번호 재설정 링크를 발송했습니다.
        </p>
        <p className="text-[#1F2937] font-medium text-sm mb-6">{email}</p>

        <div className="bg-[#F5F7FB] rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            이메일이 도착하지 않았나요? 스팸 폴더를 확인하거나, 아래 버튼을 눌러 다시 요청해주세요.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 border-[#E8F0FF] hover:bg-[#F5F7FB] text-[#6B7280] font-medium rounded-xl"
            onClick={() => setIsSubmitted(false)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다른 이메일로 시도
          </Button>

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 h-11 w-full text-sm text-[#4F7CF3] hover:text-[#3A5FD9] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#4F7CF3]/20 to-[#4F7CF3]/5 rounded-2xl flex items-center justify-center mb-4">
          <AtSign className="h-7 w-7 text-[#4F7CF3]" />
        </div>
        <p className="text-sm text-[#6B7280]">
          가입시 등록한 이메일 주소를 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            전송 중...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            재설정 링크 보내기
          </span>
        )}
      </Button>

      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8F0FF]" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link
          to="/auth/login"
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4F7CF3] transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" />
          로그인
        </Link>
        <span className="w-px h-3 bg-[#E8F0FF]" />
        <Link
          to="/auth/find-id"
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4F7CF3] transition-colors"
        >
          <AtSign className="w-3.5 h-3.5" />
          아이디 찾기
        </Link>
      </div>
    </form>
  )
}
