import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogIn, Home, Clock, Hand } from "lucide-react"

export default function LogoutPage() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    const performLogout = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoggingOut(false)
      setIsLoggedOut(true)
    }

    performLogout()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FB] via-white to-[#E8F0FF] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#4F7CF3] rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1F2937]">Sometime</span>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#4F7CF3]/10 border border-[#E8F0FF]/50 p-8 text-center">
          {isLoggingOut && (
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#4F7CF3]/20 to-[#4F7CF3]/5 rounded-2xl flex items-center justify-center relative">
                <div className="w-10 h-10 border-3 border-[#E8F0FF] border-t-[#4F7CF3] rounded-full animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1F2937]">로그아웃 중...</h2>
                <p className="mt-1.5 text-[#6B7280] text-sm">
                  안전하게 로그아웃하고 있습니다.
                </p>
              </div>
            </div>
          )}

          {isLoggedOut && (
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2EC4B6]/20 to-[#2EC4B6]/5 rounded-2xl flex items-center justify-center">
                <Hand className="h-10 w-10 text-[#2EC4B6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1F2937]">로그아웃 완료</h2>
                <p className="mt-1.5 text-[#6B7280] text-sm">
                  다음에 또 만나요!
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <Button
                  className="w-full h-12 bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white font-medium rounded-xl shadow-lg shadow-[#4F7CF3]/25 hover:shadow-[#4F7CF3]/40 transition-all"
                  onClick={() => navigate("/auth/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  다시 로그인
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#E8F0FF] hover:bg-[#F5F7FB] text-[#6B7280] font-medium rounded-xl"
                  onClick={() => navigate("/")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 가기
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#6B7280] mt-6">
          가천대학교 커뮤니티 플랫폼
        </p>
      </div>
    </div>
  )
}
