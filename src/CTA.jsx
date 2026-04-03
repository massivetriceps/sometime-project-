import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-secondary px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-dark md:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="mb-8 text-lg text-muted">
          복잡한 시간표 고민, Sometime이 해결해드립니다
        </p>
        <a
          href="#register"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
        >
          무료로 시작하기
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
}
