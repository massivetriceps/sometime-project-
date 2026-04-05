const painPoints = [
  {
    quote: "수요일 공강 만들고 싶은데 경우의 수가 너무 많아...",
    description: "원하는 조건으로 시간표를 짜려면 수십 개의 조합을 일일이 확인해야 합니다.",
  },
  {
    quote: "아침 9시 수업은 절대 안돼...",
    description: "1교시 수업을 피하고 싶지만, 필수 과목이라면 어쩔 수 없이 신청하게 됩니다.",
  },
  {
    quote: "공대에서 인문대까지 10분 안에 어떻게 가...",
    description: "연강 사이 건물 이동 시간을 고려하지 않으면 지각이 일상이 됩니다.",
  },
  {
    quote: "전선 몇 학점 남았더라? 졸업 가능한거 맞아?",
    description: "남은 학점을 정확히 파악하지 못해 졸업 직전에 당황하는 경우가 많습니다.",
  },
]

export default function PainPoints() {
  return (
    <section className="bg-[#F9FAFB] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-[#1F2937]">
            더 이상 고민은 그만
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            여러분들이 원하는 조건 <span className="text-[#4F7CF3] font-semibold">모두 반영</span>하여 시간표를 짜드립니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[28px] border border-[#E8F0FF] bg-white p-7 shadow-[0_10px_30px_rgba(31,41,55,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,124,243,0.12)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4F7CF3] via-[#2EC4B6] to-[#A78BFA]" />

              <div className="mb-6 rounded-2xl bg-[#E8F0FF] px-6 py-5">
                <p className="text-[15px] font-semibold leading-8 text-[#4F7CF3]">
                  "{point.quote}"
                </p>
              </div>

              <p className="relative z-10 text-[15px] leading-8 text-[#6B7280]">
                {point.description}
              </p>

              <div className="mt-10 flex justify-end">
                <span className="text-6xl font-extrabold tracking-tight text-[#E5E7EB] transition-colors duration-300 group-hover:text-[#D6E4FF]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
