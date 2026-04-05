import { Link } from "react-router-dom"
import { Users, Sparkles, GraduationCap, ShieldCheck } from "lucide-react"
import GachonBrand from "@/components/common/GachonBrand"

export function AuthLayout({ children, title, subtitle, variant = "default" }) {
  if (variant === "centered") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <GachonBrand to="/" size="md" showSubtitle={true} textColor="dark" />
          </div>

          <div className="glass-card soft-shadow rounded-[28px] border border-white/70 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
              <p className="mt-2 text-[#6B7280] text-sm leading-6">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "simple") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FB] via-white to-[#E8F0FF] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px]">
          <div className="flex justify-center mb-8">
            <GachonBrand to="/" size="md" showSubtitle={false} textColor="dark" />
          </div>

          <div className="glass-card soft-shadow rounded-[26px] border border-white/70 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
              <p className="mt-2 text-[#6B7280] text-sm leading-6">{subtitle}</p>
            </div>
            {children}
          </div>

          <p className="text-center text-xs text-[#6B7280] mt-6">
            가천대학교 학생 전용 서비스입니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-[#4F7CF3] via-[#5F87F8] to-[#7EA1FF]">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2EC4B6]/20 blur-3xl" />
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-[#A78BFA]/18 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#F4D58D]/20 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-8 lg:p-12 xl:p-16">
          <GachonBrand to="/" size="md" showSubtitle={false} textColor="light" />

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Gachon University Students Only
            </div>

            <h1 className="mt-6 text-4xl xl:text-5xl font-bold leading-tight text-white">
              가천대학교 학생들을 위한
              <br />
              특별한 인증 공간
            </h1>

            <p className="mt-5 text-white/80 text-lg leading-8">
              안전한 학생 인증과 함께, 학교 생활에 필요한 커뮤니티 기능을 더 편리하게 이용해보세요.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span>학우들과 자유로운 소통</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span>다양한 학교 정보 공유</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span>가천대 학생 인증 시스템</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-1.5 rounded-full bg-[#2EC4B6]" />
            <div className="w-9 h-1.5 rounded-full bg-[#F4D58D]" />
            <div className="w-9 h-1.5 rounded-full bg-[#A78BFA]" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] xl:w-[50%] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[450px]">
          <div className="lg:hidden text-center mb-8">
            <GachonBrand to="/" size="md" showSubtitle={true} textColor="dark" />
          </div>

          <div className="glass-card soft-shadow rounded-[28px] border border-white/70 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
              <p className="mt-2 text-[#6B7280] text-sm leading-6">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}




