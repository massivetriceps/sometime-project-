import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-secondary-light to-white px-6 pb-20 pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-primary">
            전국 대학생 5,000명 이상 사용 중
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-dark sm:text-5xl lg:text-6xl">
          당신이 원하는 시간표
          <br />
          <span className="text-primary">알잘딱깔센</span>이 해결합니다
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
          조건만 선택한다면 고민은 대신해드리고{" "}
          <span className="font-semibold text-dark">개꿀시간표</span>를 추천해드립니다
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#start"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:bg-primary/90"
          >
            지금 시작하기
            <ArrowRight size={20} />
          </a>

          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-muted transition hover:border-primary hover:text-primary"
          >
            데모 보기
          </a>
        </div>
      </div>
    </section>
  );
}




