import { CheckCircle } from "lucide-react";

const checkItems = [
  "전공필수/선택 이수 현황",
  "교양 영역별 학점 체크",
  "졸업까지 남은 학점 계산",
  "학기별 추천 과목 제안",
];

export default function Credits() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">졸업 학점 현황</p>
                    <p className="text-sm text-white
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">75</p>
                    <p className="text-sm text-white
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-dark">전공필수</span>
                    <span className="text-sm font-semibold text-primary">24/30</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-primary to-primary/70" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-dark">전공선택</span>
                    <span className="text-sm font-semibold text-accent">36/45</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-accent to-accent/70" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-dark">필수교양</span>
                    <span className="text-sm font-semibold text-yellow-500">15/18</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-primary/20 bg-secondary p-4">
                  <p className="text-sm font-medium text-primary">
                    💡 다음 학기에 전공필수 6학점 이수를 권장합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              Credit Tracking
            </span>
            <h2 className="mb-4 text-3xl font-bold text-dark md:text-4xl">
              졸업까지 <span className="text-primary">몇학점</span> 들어야하나?
            </h2>
            <p className="mb-6 text-lg text-muted">
              전선, 전필 몇학점 남았지? 필수교양은?
            </p>
            <p className="mb-8 text-base leading-relaxed text-muted">
              현재까지 이수한 학점을 분석하여 졸업까지 필요한 학점을 정확히 계산합니다.
              전공, 교양, 일반선택을 졸업 요건에 맞게 균형있게 배분해드립니다.
            </p>

            <div className="space-y-3">
              {checkItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="shrink-0 text-accent" />
                  <span className="text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
