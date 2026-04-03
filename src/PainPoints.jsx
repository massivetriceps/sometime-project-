const painPoints = [
  {
    quote: '"수요일 공강 만들고 싶은데 경우의 수가 너무 많아..."',
    description: "원하는 조건으로 시간표를 짜려면 수십 개의 조합을 일일이 확인해야 합니다.",
  },
  {
    quote: '"아침 9시 수업은 절대 안돼..."',
    description: "1교시 수업을 피하고 싶지만, 필수 과목이라면 어쩔 수 없이 신청하게 됩니다.",
  },
  {
    quote: '"공대에서 인문대까지 10분 안에 어떻게 가..."',
    description: "연강 사이 건물 이동 시간을 고려하지 않으면 지각이 일상이 됩니다.",
  },
  {
    quote: '"전선 몇 학점 남았더라? 졸업 가능한거 맞아?"',
    description: "남은 학점을 정확히 파악하지 못해 졸업 직전에 당황하는 경우가 많습니다.",
  },
];

export default function PainPoints() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-dark md:text-4xl">
            더 이상 고민은 그만
          </h2>
          <p className="mt-4 text-lg text-muted">
            여러분들이 원하는 조건 <span className="font-semibold text-primary">모두 반영</span>하여
            시간표를 짜드립니다
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="relative flex min-h-[220px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 rounded-xl bg-secondary px-4 py-3">
                  <p className="text-sm font-semibold leading-relaxed text-primary">
                    {point.quote}
                  </p>
                </div>
                <p className="text-sm leading-7 text-muted">{point.description}</p>
              </div>

              <span className="absolute bottom-4 right-5 text-5xl font-extrabold text-gray-100">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
