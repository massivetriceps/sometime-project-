const SECTION_TITLE = "???댁긽 怨좊?? 洹몃쭔"
const SECTION_DESC_1 = "?щ윭遺꾨뱾???먰븯??議곌굔 "
const SECTION_DESC_2 = "紐⑤몢 諛섏쁺"
const SECTION_DESC_3 = "?섏뿬 ?쒓컙?쒕? 吏쒕뱶由쎈땲??

const painPoints = [
  {
    quote: "?섏슂??怨듦컯 留뚮뱾怨??띠???寃쎌슦???섍? ?덈Т 留롮븘...",
    description: "?먰븯??議곌굔?쇰줈 ?쒓컙?쒕? 吏쒕젮硫??섏떗 媛쒖쓽 議고빀???쇱씪???뺤씤?댁빞 ?⑸땲??",
  },
  {
    quote: "?꾩묠 9???섏뾽? ?덈? ?덈뤌...",
    description: "1援먯떆 ?섏뾽???쇳븯怨??띠?留? ?꾩닔 怨쇰ぉ?대씪硫??댁찓 ???놁씠 ?좎껌?섍쾶 ?⑸땲??",
  },
  {
    quote: "怨듬??먯꽌 ?몃Ц?源뚯? 10遺??덉뿉 ?대뼸寃?媛...",
    description: "?곌컯 ?ъ씠 嫄대Ъ ?대룞 ?쒓컙??怨좊젮?섏? ?딆쑝硫?吏媛곸씠 ?쇱긽???⑸땲??",
  },
  {
    quote: "?꾩꽑 紐??숈젏 ?⑥븯?붾씪? 議몄뾽 媛?ν븳嫄?留욎븘?",
    description: "?⑥? ?숈젏???뺥솗???뚯븙?섏? 紐삵빐 議몄뾽 吏곸쟾???뱁솴?섎뒗 寃쎌슦媛 留롮뒿?덈떎.",
  },
]

export default function PainPoints() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#263238]">
            {SECTION_TITLE}
          </h2>
          <p className="text-lg text-[#4D5E80]">
            {SECTION_DESC_1}
            <span className="font-semibold text-[#4F7CF3]">{SECTION_DESC_2}</span>
            {SECTION_DESC_3}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#4F7CF3]/30 hover:shadow-xl hover:shadow-[#4F7CF3]/5 transition-all duration-300"
            >
              <div className="bg-[#E8F0FF] rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-[#4F7CF3] leading-relaxed">
                  {`"${point.quote}"`}
                </p>
              </div>

              <div className="absolute left-8 top-[88px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#E8F0FF]" />

              <p className="text-sm leading-relaxed text-[#4D5E80] mt-2">
                {point.description}
              </p>

              <span className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-[#4F7CF3]/10 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


