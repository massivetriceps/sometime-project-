const painPoints = [
  {
    quote: '"수요일 공강 만들고 싶은데 경우의 수가 너무 많아..."',
    description: '원하는 조건으로 시간표를 짜려면 수십 개의 조합을 일일이 확인해야 합니다.',
  },
  {
    quote: '"아침 9시 수업은 절대 안돼..."',
    description: '1교시 수업을 피하고 싶지만, 필수 과목이라면 어쩔 수 없이 신청하게 됩니다.',
  },
  {
    quote: '"공대에서 인문대까지 10분 안에 어떻게 가..."',
    description: '연강 사이 건물 이동 시간을 고려하지 않으면 지각이 일상이 됩니다.',
  },
  {
    quote: '"전선 몇 학점 남았더라? 졸업 가능한거 맞아?"',
    description: '남은 학점을 정확히 파악하지 못해 졸업 직전에 당황하는 경우가 많습니다.',
  },
]

export default function PainPoints() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark">
            더 이상 고민은 그만
          </h2>
          <p className="text-lg text-muted">
            여러분들이 원하는 조건{' '}
            <span className="font-semibold text-primary">모두 반영</span>
            하여 시간표를 짜드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Quote bubble */}
              <div className="bg-secondary rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-primary leading-relaxed">
                  {point.quote}
                </p>
              </div>
              
              {/* Triangle */}
              <div className="absolute left-8 top-[88px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-secondary" />
              
              {/* Description */}
              <p className="text-sm leading-relaxed text-muted mt-2">
                {point.description}
              </p>

              {/* Index number */}
              <span className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-primary/10 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
