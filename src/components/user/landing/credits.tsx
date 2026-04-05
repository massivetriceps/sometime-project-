import { CheckCircle } from 'lucide-react'

const SECTION_TITLE_1 = "議몄뾽源뚯? "
const SECTION_TITLE_2 = "紐뉙븰??
const SECTION_TITLE_3 = " ?ㅼ뼱?쇳븯??"
const SECTION_SUBTITLE = "?꾩꽑, ?꾪븘 紐뉙븰???⑥븯吏? ?꾩닔援먯뼇??"
const SECTION_DESC = "?꾩옱源뚯? ?댁닔???숈젏??遺꾩꽍?섏뿬 議몄뾽源뚯? ?꾩슂???숈젏???뺥솗??怨꾩궛?⑸땲?? ?꾧났, 援먯뼇, ?쇰컲?좏깮??議몄뾽 ?붽굔??留욊쾶 洹좏삎?덇쾶 諛곕텇?대뱶由쎈땲??"
const CARD_TITLE = "議몄뾽 ?숈젏 ?꾪솴"
const CARD_SUBTITLE = "2025??1?숆린 湲곗?"
const ALERT_TEXT = "?ㅼ쓬 ?숆린???꾧났?꾩닔 6?숈젏 ?댁닔瑜?沅뚯옣?⑸땲??

const checkItems = [
  "?꾧났?꾩닔/?좏깮 ?댁닔 ?꾪솴",
  "援먯뼇 ?곸뿭蹂??숈젏 泥댄겕",
  "議몄뾽源뚯? ?⑥? ?숈젏 怨꾩궛",
  "?숆린蹂?異붿쿇 怨쇰ぉ ?쒖븞",
]

export default function Credits() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4F7CF3] to-[#4F7CF3]/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{CARD_TITLE}</p>
                    <p className="text-sm text-white/70">{CARD_SUBTITLE}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">75</p>
                    <p className="text-sm text-white/70">/ 130 ?숈젏</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#263238]">?꾧났?꾩닔</span>
                    <span className="text-sm font-semibold text-[#4F7CF3]">24/30</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#4F7CF3] to-[#4F7CF3]/70" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#263238]">?꾧났?좏깮</span>
                    <span className="text-sm font-semibold text-[#2EC4B6]">36/45</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2EC4B6] to-[#2EC4B6]/70" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#263238]">?꾩닔援먯뼇</span>
                    <span className="text-sm font-semibold text-amber-500">15/18</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: '83%' }} />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#E8F0FF] rounded-xl border border-[#4F7CF3]/20">
                  <p className="text-sm text-[#4F7CF3] font-medium">
                    {`?뮕 ${ALERT_TEXT}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 bg-[#2EC4B6]/10 text-[#2EC4B6] text-sm font-semibold rounded-full mb-4">
              Credit Tracking
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#263238]">
              {SECTION_TITLE_1}
              <span className="text-[#4F7CF3]">{SECTION_TITLE_2}</span>
              {SECTION_TITLE_3}
            </h2>
            <p className="text-lg mb-6 text-[#4D5E80]">
              {SECTION_SUBTITLE}
            </p>
            <p className="text-base leading-relaxed mb-8 text-[#4D5E80]">
              {SECTION_DESC}
            </p>

            <div className="space-y-3">
              {checkItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-[#2EC4B6] shrink-0" />
                  <span className="text-[#4D5E80]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


