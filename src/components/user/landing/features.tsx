import { Calendar, Monitor, MapPin, Clock, GraduationCap, Layers } from 'lucide-react'

const SECTION_TITLE_1 = "?뱀떊???좏깮??"
const SECTION_TITLE_2 = "?좏샇議곌굔"
const SECTION_TITLE_3 = "??諛섏쁺?⑸땲??
const SECTION_DESC = "?쒓컙???몄꽦????媛??留롮씠 ?섎뒗 怨좊????꾩＜濡??ㅽ쁽 媛?ν븳 踰붿쐞?먯꽌 議곌굔?ㅼ쓣 ?좊퀎?섏??듬땲??"
const SPEECH_BUBBLE = "?듯빀援먯뼇 梨꾩썙?쇰릺???섎굹 ?ㅼ뼱?쇳븯?붾뜲,,,"

const features = [
  {
    icon: Calendar,
    title: "怨듦컯 ?붿씪 ?좏깮",
    desc: "?먰븯???붿씪???섏뾽???녿룄濡??쒓컙?쒕? 援ъ꽦?⑸땲??",
    color: "#4F7CF3",
  },
  {
    icon: Monitor,
    title: "?⑤씪??媛뺤쓽 ?좏샇",
    desc: "鍮꾨?硫??섏뾽???곗꽑?곸쑝濡?諛곗튂?섏뿬 ?깃탳 遺?댁쓣 以꾩엯?덈떎.",
    color: "#2EC4B6",
  },
  {
    icon: MapPin,
    title: "?숈꽑 理쒖쟻??,
    desc: "?곗냽???섏뾽 媛?嫄대Ъ ?대룞 嫄곕━瑜?理쒖냼?뷀빀?덈떎.",
    color: "#F59E0B",
  },
  {
    icon: Clock,
    title: "?꾩묠 ?섏뾽 ?쒖쇅",
    desc: "1援먯떆 ?섏뾽???쇳븯怨??띕떎硫??대떦 ?쒓컙?瑜??쒖쇅?⑸땲??",
    color: "#EF4444",
  },
  {
    icon: GraduationCap,
    title: "議몄뾽?숈젏 愿由?,
    desc: "?꾧났/援먯뼇 ?댁닔 ?꾪솴??遺꾩꽍?섏뿬 議몄뾽 ?붽굔??泥댄겕?⑸땲??",
    color: "#8B5CF6",
  },
  {
    icon: Layers,
    title: "?숆린 ?뚮옖 異붿쿇",
    desc: "?⑥? ?숆린???대뼡 怨쇰ぉ???ㅼ뼱???섎뒗吏 濡쒕뱶留듭쓣 ?쒓났?⑸땲??",
    color: "#EC4899",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#4F7CF3]/10 text-[#4F7CF3] text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#263238]">
              {SECTION_TITLE_1}
              <span className="text-[#4F7CF3]">{SECTION_TITLE_2}</span>
              {SECTION_TITLE_3}
            </h2>
            <p className="text-base leading-relaxed mb-8 text-[#4D5E80]">
              {SECTION_DESC}
            </p>

            <div className="relative inline-block bg-[#E8F0FF] p-4 rounded-2xl rounded-bl-none">
              <p className="text-sm font-medium text-[#4D5E80]">
                {`"${SPEECH_BUBBLE}"`}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-bold text-base mb-2 text-[#263238]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#4D5E80]">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


