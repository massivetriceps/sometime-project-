import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import GachonBrand from "@/components/common/GachonBrand"
import {
  LogIn,
  UserPlus,
  KeyRound,
  Search,
  LogOut,
  Users,
  MessageCircle,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
  BellRing,
} from "lucide-react"

const accountCards = [
  {
    to: "/auth/login",
    title: "로그인",
    desc: "계정에 로그인하기",
    icon: LogIn,
    color: "from-[#4F7CF3]/15 to-[#4F7CF3]/5",
    iconColor: "text-[#4F7CF3]",
    border: "hover:border-[#4F7CF3]/40",
  },
  {
    to: "/auth/signup",
    title: "회원가입",
    desc: "새 계정 만들기",
    icon: UserPlus,
    color: "from-[#2EC4B6]/15 to-[#2EC4B6]/5",
    iconColor: "text-[#2EC4B6]",
    border: "hover:border-[#2EC4B6]/40",
  },
  {
    to: "/auth/forgot-password",
    title: "비밀번호 찾기",
    desc: "비밀번호 재설정하기",
    icon: KeyRound,
    color: "from-[#F4D58D]/20 to-[#F4D58D]/5",
    iconColor: "text-[#D4A84D]",
    border: "hover:border-[#F4D58D]/50",
  },
  {
    to: "/auth/find-id",
    title: "아이디 찾기",
    desc: "이메일 주소 찾기",
    icon: Search,
    color: "from-[#A78BFA]/15 to-[#A78BFA]/5",
    iconColor: "text-[#A78BFA]",
    border: "hover:border-[#A78BFA]/40",
  },
  {
    to: "/auth/reset-password",
    title: "비밀번호 재설정",
    desc: "새 비밀번호 설정하기",
    icon: ShieldCheck,
    color: "from-[#4F7CF3]/15 to-[#A78BFA]/8",
    iconColor: "text-[#4F7CF3]",
    border: "hover:border-[#4F7CF3]/40",
  },
  {
    to: "/auth/logout",
    title: "로그아웃",
    desc: "계정에서 로그아웃",
    icon: LogOut,
    color: "from-[#6B7280]/12 to-[#F5F7FB]",
    iconColor: "text-[#6B7280]",
    border: "hover:border-[#6B7280]/30",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-[#E8F0FF] bg-white/75 backdrop-blur-xl">
        <div className="container-balanced px-4 sm:px-6 py-3 flex items-center justify-between">
          <GachonBrand to="/" size="md" showSubtitle={true} textColor="dark" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7FB]"
              asChild
            >
              <Link to="/auth/login">로그인</Link>
            </Button>

            <Button
              className="rounded-xl bg-[#4F7CF3] hover:bg-[#3A5FD9] text-white shadow-lg shadow-[#4F7CF3]/25"
              asChild
            >
              <Link to="/auth/signup">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden hero-grid">
          <div className="container-balanced px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E8F0FF] bg-white/80 px-4 py-2 text-sm font-medium text-[#4F7CF3] shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                  가천대학교 학생 전용
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#1F2937]">
                  가천대 학우들과
                  <br />
                  <span className="text-[#4F7CF3]">언젠가 함께하는 공간</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-[#6B7280]">
                  학교 생활, 스터디, 동아리 정보까지.
                  가천대학교 학생들을 위한 커뮤니티에서 새로운 인연을 만들어보세요.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="h-13 rounded-2xl bg-[#4F7CF3] px-8 text-base text-white shadow-xl shadow-[#4F7CF3]/25 hover:bg-[#3A5FD9]"
                    asChild
                  >
                    <Link to="/auth/signup">
                      <UserPlus className="mr-2 h-5 w-5" />
                      회원가입
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-2xl border-[#E8F0FF] bg-white/85 px-8 text-base text-[#1F2937] hover:bg-[#F5F7FB]"
                    asChild
                  >
                    <Link to="/auth/login">
                      <LogIn className="mr-2 h-5 w-5" />
                      로그인
                    </Link>
                  </Button>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-[#E8F0FF] bg-white px-4 py-2 shadow-sm">
                    <Users className="w-4 h-4 text-[#2EC4B6]" />
                    <span className="text-sm text-[#6B7280]">학우들과 소통</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#E8F0FF] bg-white px-4 py-2 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-[#A78BFA]" />
                    <span className="text-sm text-[#6B7280]">실시간 채팅</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#E8F0FF] bg-white px-4 py-2 shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#D4A84D]" />
                    <span className="text-sm text-[#6B7280]">다양한 정보</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-[#4F7CF3]/10 blur-2xl" />
                <div className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-[#2EC4B6]/10 blur-2xl" />

                <div className="glass-card soft-shadow rounded-[28px] border border-white/70 p-5 sm:p-6">
                  <div className="rounded-[22px] bg-gradient-to-br from-[#4F7CF3] via-[#5B84F7] to-[#7EA1FF] p-6 text-white shadow-lg shadow-[#4F7CF3]/25">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Student Space</p>
                        <h3 className="mt-3 text-2xl font-bold leading-snug">
                          당신의 대학 생활을
                          <br />
                          더 가깝게
                        </h3>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-3">
                        <BellRing className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs text-white/70">학생 전용</p>
                        <p className="mt-2 text-lg font-semibold">인증 시스템</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs text-white/70">커뮤니티</p>
                        <p className="mt-2 text-lg font-semibold">실시간 연결</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#E8F0FF] bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#E8F0FF] p-2.5">
                          <BookOpen className="w-5 h-5 text-[#4F7CF3]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F2937]">스터디 정보</p>
                          <p className="text-xs text-[#6B7280]">모집/참여가 쉬워져요</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#E8F0FF] bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#F5F7FB] p-2.5">
                          <Users className="w-5 h-5 text-[#A78BFA]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F2937]">학생 네트워크</p>
                          <p className="text-xs text-[#6B7280]">학우를 더 쉽게 만나요</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-balanced px-4 sm:px-6 py-14 sm:py-18">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F0FF] px-4 py-2 text-sm font-medium text-[#4F7CF3]">
              <ShieldCheck className="w-4 h-4" />
              계정 관리
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-[#1F2937]">
              로그인, 회원가입 및 계정 복구 페이지
            </h2>
            <p className="mt-3 text-[#6B7280] leading-7">
              인증 흐름을 한눈에 확인할 수 있도록 카드형 메뉴로 정리했습니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {accountCards.map((card) => {
              const Icon = card.icon

              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className={`group glass-card soft-shadow rounded-[24px] border border-white/70 p-5 transition-all duration-300 hover:-translate-y-1 ${card.border}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-[#1F2937]">{card.title}</h3>
                    <p className="mt-1 text-sm text-[#6B7280]">{card.desc}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#4F7CF3]">바로가기</span>
                    <div className="rounded-full bg-[#E8F0FF] p-2 transition-all group-hover:bg-[#4F7CF3]">
                      <ArrowRight className="h-4 w-4 text-[#4F7CF3] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-[#E8F0FF] bg-white/80 backdrop-blur-sm">
        <div className="container-balanced px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <GachonBrand to="/" size="sm" showSubtitle={true} textColor="dark" />
          <div className="text-xs sm:text-sm text-[#6B7280]">
            Campus community for Gachon University students
          </div>
        </div>
      </footer>
    </div>
  )
}
