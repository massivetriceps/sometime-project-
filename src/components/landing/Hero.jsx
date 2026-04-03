import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-secondary/50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium text-primary">
            전국 대학생 5,000명 이상 사용 중
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-dark">
          당신이 원하는 시간표
          <br />
          <span className="text-primary">알잘딱깔센</span>이 해결합니다
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-muted">
          조건만 선택한다면 고민은 대신해드리고{' '}
          <span className="font-semibold text-dark">개꿀시간표</span>를 추천해드립니다
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25"
          >
            지금 시작하기
            <ArrowRight size={20} />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-muted font-semibold rounded-full border-2 border-gray-200 hover:border-primary hover:text-primary transition-all"
          >
            데모 보기
          </a>
        </div>
      </div>
    </section>
  )
}
