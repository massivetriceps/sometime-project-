import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark">
          지금 바로 시작하세요
        </h2>
        <p className="text-lg mb-8 text-muted">
          복잡한 시간표 고민, Sometime이 해결해드립니다
        </p>
        <a
          href="#register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25"
        >
          무료로 시작하기
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  )
}
