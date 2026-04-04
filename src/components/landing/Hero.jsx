export default function Hero() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">

        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <img
            src="/gachon-icon.svg"
            alt="가천대학교 아이콘"
            className="w-16 h-16"
          />
        </div>

        {/* 제목 */}
        <h1 className="text-5xl font-bold text-[#1F2937] leading-tight">
          강의 시간표 문제를
          <br />
          <span className="text-[#4F7CF3]">알잘딱깔센</span>이 해결합니다
        </h1>

        {/* 설명 */}
        <p className="mt-6 text-lg text-[#6B7280]">
          조건만 선택하면 고민은 대신해드리고
          <br />
          최적의 시간표를 추천해드립니다
        </p>

        {/* 버튼 */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-[#4F7CF3] text-white">
            지금 시작하기 →
          </button>
          <button className="px-6 py-3 rounded-xl border border-[#E8F0FF]">
            데모 보기
          </button>
        </div>

      </div>
    </section>
  )
}
