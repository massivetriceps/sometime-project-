import { Calendar, Monitor, MapPin, Clock, GraduationCap, Layers } from "lucide-react";

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
    color: "#F4D58D",
  },
  {
    icon: Clock,
    title: "아침 수업 제외",
    desc: "1교시 수업을 피하고 싶다면 해당 시간대를 제외합니다.",
    color: "#F87171",
  },
  {
    icon: GraduationCap,
    title: "졸업학점 관리",
    desc: "전공/교양 이수 현황을 분석하여 졸업 요건을 체크합니다.",
    color: "#A78BFA",
  },
  {
    icon: Layers,
    title: "학기 플랜 추천",
    desc: "남은 학기에 어떤 과목을 들어야 하는지 로드맵을 제공합니다.",
    color: "#BFD4FF",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background-soft px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Features
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-dark md:text-5xl">
            당신이 선택한 <span className="text-primary">선호조건</span>을 반영합니다
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted">
            시간표 편성할 때 가장 많이 하는 고민을 중심으로 실현 가능한 범위에서 조건을 선별했습니다.
          </p>

          <div className="mt-8 inline-block rounded-2xl bg-secondary px-5 py-4 text-sm font-medium text-muted shadow-sm">
            "융합교양 채워야돼서 하나 들어야하는데..."
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <IconComponent size={24} style={{ color: feature.color }} />
                </div>

                <h3 className="text-lg font-bold text-dark">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
