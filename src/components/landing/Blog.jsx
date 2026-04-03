import { ArrowUpRight } from 'lucide-react'

const articles = [
  {
    category: 'Tips',
    title: '시간표 짤 때 꼭 알아야 할 5가지 팁',
    excerpt: '수강신청 전 미리 준비하면 좋은 전략들을 소개합니다.',
    color: '#4F7CF3',
    date: '2025.03.15',
  },
  {
    category: 'Update',
    title: '2025년 1학기 신규 기능 업데이트',
    excerpt: 'AI 기반 과목 추천 기능이 새롭게 추가되었습니다.',
    color: '#2EC4B6',
    date: '2025.03.10',
  },
  {
    category: 'Guide',
    title: '졸업학점 관리 완벽 가이드',
    excerpt: '놓치기 쉬운 졸업 요건들을 체계적으로 관리하는 방법.',
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
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark">
              유용한 정보들
            </h2>
          </div>
          <a
            href="#all-posts"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
          >
            모든 글 보기
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* Image placeholder */}
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
                <p className="text-xs text-muted mb-2">{article.date}</p>
                <h3 className="font-bold text-lg mb-2 text-dark group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
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
