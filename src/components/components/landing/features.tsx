import { Calendar, Monitor, MapPin, Clock, GraduationCap, Layers } from 'lucide-react'

const SECTION_TITLE_1 = "당신이 선택한 "
const SECTION_TITLE_2 = "선호조건"
const SECTION_TITLE_3 = "을 반영합니다"
const SECTION_DESC = "시간표 편성할 때 가장 많이 하는 고민들 위주로 실현 가능한 범위에서 조건들을 선별하였습니다."
const SPEECH_BUBBLE = "융합교양 채워야되서 하나 들어야하는데,,,"

const features = [
  {
    icon: Calendar,
    title: "공강 요일 선택",
    desc: "원하는 요일에 수업이 없도록 시간표를 구성합니다.",
    color: "#4F7CF3",
  },
  {
    icon: Monitor,
    title: "온라인 강의 선호",
    desc: "비대면 수업을 우선적으로 배치하여 등교 부담을 줄입니다.",
    color: "#2EC4B6",
  },
  {
    icon: MapPin,
    title: "동선 최적화",
    desc: "연속된 수업 간 건물 이동 거리를 최소화합니다.",
    color: "#F59E0B",
  },
  {
    icon: Clock,
    title: "아침 수업 제외",
    desc: "1교시 수업을 피하고 싶다면 해당 시간대를 제외합니다.",
    color: "#EF4444",
  },
  {
    icon: GraduationCap,
    title: "졸업학점 관리",
    desc: "전공/교양 이수 현황을 분석하여 졸업 요건을 체크합니다.",
    color: "#8B5CF6",
  },
  {
    icon: Layers,
    title: "학기 플랜 추천",
    desc: "남은 학기에 어떤 과목을 들어야 하는지 로드맵을 제공합니다.",
    color: "#EC4899",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#4F7CF3]/10 text-[#4F7CF3] text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#263238]">
              {SECTION_TITLE_1}
              <span className="text-[#4F7CF3]">{SECTION_TITLE_2}</span>
              {SECTION_TITLE_3}
            </h2>
            <p className="text-base leading-relaxed mb-8 text-[#4D5E80]">
              {SECTION_DESC}
            </p>

            <div className="relative inline-block bg-[#E8F0FF] p-4 rounded-2xl rounded-bl-none">
              <p className="text-sm font-medium text-[#4D5E80]">
                {`"${SPEECH_BUBBLE}"`}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-bold text-base mb-2 text-[#263238]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#4D5E80]">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
