import { ArrowRight } from 'lucide-react'

const CTA_TITLE = "吏湲?諛붾줈 ?쒖옉?섏꽭??
const CTA_DESC = "蹂듭옟???쒓컙??怨좊?, Sometime???닿껐?대뱶由쎈땲??
const CTA_BUTTON = "臾대즺濡??쒖옉?섍린"

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-[#E8F0FF]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#263238]">
          {CTA_TITLE}
        </h2>
        <p className="text-lg mb-8 text-[#4D5E80]">
          {CTA_DESC}
        </p>
        <a
          href="#register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F7CF3] text-white font-semibold rounded-full hover:bg-[#4F7CF3]/90 hover:scale-105 transition-all shadow-lg shadow-[#4F7CF3]/25"
        >
          {CTA_BUTTON}
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  )
}


