import { Users, Building2, Calendar, CreditCard } from "lucide-react";

const stats = [
  { icon: Users, value: "5,000+", label: "Members" },
  { icon: Building2, value: "120+", label: "Universities" },
  { icon: Calendar, value: "50,000+", label: "Schedules Created" },
  { icon: CreditCard, value: "99%", label: "Satisfaction" },
];

export default function Stats() {
  return (
    <section className="py-16 px-6 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <IconComponent size={28} className="text-white" />
                </div>
                <div className="mb-1 text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/70">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
