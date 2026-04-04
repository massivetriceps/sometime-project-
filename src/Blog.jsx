import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    category: "Tips",
    title: "시간표 짤 때 꼭 알아야 할 5가지 팁",
    excerpt: "수강신청 전 미리 준비하면 좋은 전략들을 소개합니다.",
    color: "#4F7CF3",
    date: "2025.03.15",
  },
  {
    category: "Update",
    title: "2025년 1학기 신규 기능 업데이트",
    excerpt: "AI 기반 과목 추천 기능이 새롭게 추가되었습니다.",
    color: "#2EC4B6",
    date: "2025.03.10",
  },
  {
    category: "Guide",
    title: "졸업학점 관리 완벽 가이드",
    excerpt: "놓치기 쉬운 졸업 요건들을 체계적으로 관리하는 방법.",
    color: "#F59E0B",
    date: "2025.03.05",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Blog
            </span>
            <h2 className="text-3xl font-bold text-dark md:text-4xl">
              유용한 정보들
            </h2>
          </div>

          <a
            href="#all-posts"
            className="mt-4 inline-flex items-center gap-1 font-semibold text-primary transition-all hover:gap-2 md:mt-0"
          >
            모든 글 보기
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={index}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50"
            >
              <div
                className="relative h-48 overflow-hidden"
                style={{ backgroundColor: `${article.color}15` }}
              >
                <div
                  className="absolute inset-0 "
                  style={{
                    background: `linear-gradient(135deg, ${article.color}40 0%, transparent 50%)`,
                  }}
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: article.color }}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="mb-2 text-xs text-muted">{article.date}</p>
                <h3 className="mb-2 text-lg font-bold text-dark transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
