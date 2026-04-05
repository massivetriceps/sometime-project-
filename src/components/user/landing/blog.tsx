import { ArrowUpRight } from 'lucide-react'

const SECTION_TITLE = "?좎슜???뺣낫??
const VIEW_ALL = "紐⑤뱺 湲 蹂닿린"

const articles = [
  {
    category: 'Tips',
    title: "?쒓컙??吏???瑗??뚯븘????5媛吏 ??,
    excerpt: "?섍컯?좎껌 ??誘몃━ 以鍮꾪븯硫?醫뗭? ?꾨왂?ㅼ쓣 ?뚭컻?⑸땲??",
    color: '#4F7CF3',
    date: '2025.03.15',
  },
  {
    category: 'Update',
    title: "2025??1?숆린 ?좉퇋 湲곕뒫 ?낅뜲?댄듃",
    excerpt: "AI 湲곕컲 怨쇰ぉ 異붿쿇 湲곕뒫???덈∼寃?異붽??섏뿀?듬땲??",
    color: '#2EC4B6',
    date: '2025.03.10',
  },
  {
    category: 'Guide',
    title: "議몄뾽?숈젏 愿由??꾨꼍 媛?대뱶",
    excerpt: "?볦튂湲??ъ슫 議몄뾽 ?붽굔?ㅼ쓣 泥닿퀎?곸쑝濡?愿由ы븯??諛⑸쾿.",
    color: '#F59E0B',
    date: '2025.03.05',
  },
]

export default function Blog() {
  return (
    <section id="blog" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#4F7CF3]/10 text-[#4F7CF3] text-sm font-semibold rounded-full mb-4">
              Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#263238]">
              {SECTION_TITLE}
            </h2>
          </div>
          <a
            href="#all-posts"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-[#4F7CF3] font-semibold hover:gap-2 transition-all"
          >
            {VIEW_ALL}
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div
                className="h-48 relative overflow-hidden"
                style={{ backgroundColor: `${article.color}15` }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${article.color}40 0%, transparent 50%)`,
                  }}
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: article.color }}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[#4D5E80] mb-2">{article.date}</p>
                <h3 className="font-bold text-lg mb-2 text-[#263238] group-hover:text-[#4F7CF3] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[#4D5E80] leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


