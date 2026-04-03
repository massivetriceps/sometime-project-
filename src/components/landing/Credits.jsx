import { CheckCircle } from 'lucide-react'

const checkItems = [
  '전공필수/선택 이수 현황',
  '교양 영역별 학점 체크',
  '졸업까지 남은 학점 계산',
  '학기별 추천 과목 제안',
]

export default function Credits() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Mock UI */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">졸업 학점 현황</p>
                    <p className="text-sm text-white/70">2025년 1학기 기준</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">75</p>
                    <p className="text-sm text-white/70">/ 130 학점</p>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark">전공필수</span>
                    <span className="text-sm font-semibold text-primary">24/30</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                      style={{ width: '80%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark">전공선택</span>
                    <span className="text-sm font-semibold text-accent">36/45</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
                      style={{ width: '80%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark">필수교양</span>
                    <span className="text-sm font-semibold text-amber-500">15/18</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                      style={{ width: '83%' }}
                    />
                  </div>
                </div>

                {/* Alert */}
                <div className="mt-6 p-4 bg-secondary rounded-xl border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    💡 다음 학기에 전공필수 6학점 이수를 권장합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4">
              Credit Tracking
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark">
              졸업까지{' '}
              <span className="text-primary">몇학점</span> 들어야하나?
            </h2>
            <p className="text-lg mb-6 text-muted">
              전선, 전필 몇학점 남았지? 필수교양은?
            </p>
            <p className="text-base leading-relaxed mb-8 text-muted">
              현재까지 이수한 학점을 분석하여 졸업까지 필요한 학점을 정확히 계산합니다.
              전공, 교양, 일반선택을 졸업 요건에 맞게 균형있게 배분해드립니다.
            </p>

            <div className="space-y-3">
              {checkItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-accent shrink-0" />
                  <span className="text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
