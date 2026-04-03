import { ArrowRight } from 'lucide-react'

const HERO_BADGE = "전국 대학생 5,000명 이상 사용 중"
const HERO_TITLE_1 = "당신이 원하는 시간표"
const HERO_TITLE_2 = "알잘딱깔센"
const HERO_TITLE_3 = "이 해결합니다"
const HERO_DESC_1 = "조건만 선택한다면 고민은 대신해드리고 "
const HERO_DESC_2 = "개꿀시간표"
const HERO_DESC_3 = "를 추천해드립니다"
const HERO_CTA = "지금 시작하기"
const HERO_DEMO = "데모 보기"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#E8F0FF]/50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F0FF] rounded-full mb-6">
          <span className="w-2 h-2 bg-[#2EC4B6] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#4F7CF3]">{HERO_BADGE}</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#263238]">
          {HERO_TITLE_1}
          <br />
          <span className="text-[#4F7CF3]">{HERO_TITLE_2}</span>{HERO_TITLE_3}
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-[#4D5E80]">
          {HERO_DESC_1}
          <span className="font-semibold text-[#263238]">{HERO_DESC_2}</span>
          {HERO_DESC_3}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F7CF3] text-white font-semibold rounded-full hover:bg-[#4F7CF3]/90 hover:scale-105 transition-all shadow-lg shadow-[#4F7CF3]/25"
          >
            {HERO_CTA}
            <ArrowRight size={20} />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4D5E80] font-semibold rounded-full border-2 border-gray-200 hover:border-[#4F7CF3] hover:text-[#4F7CF3] transition-all"
          >
            {HERO_DEMO}
          </a>
        </div>
      </div>
    </section>
  )
}
