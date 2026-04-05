import { ArrowRight } from 'lucide-react'

const HERO_BADGE = "?꾧뎅 ??숈깮 5,000紐??댁긽 ?ъ슜 以?
const HERO_TITLE_1 = "?뱀떊???먰븯???쒓컙??
const HERO_TITLE_2 = "?뚯옒?깃퉼??
const HERO_TITLE_3 = "???닿껐?⑸땲??
const HERO_DESC_1 = "議곌굔留??좏깮?쒕떎硫?怨좊?? ??좏빐?쒕━怨?"
const HERO_DESC_2 = "媛쒓??쒓컙??
const HERO_DESC_3 = "瑜?異붿쿇?대뱶由쎈땲??
const HERO_CTA = "吏湲??쒖옉?섍린"
const HERO_DEMO = "?곕え 蹂닿린"

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


