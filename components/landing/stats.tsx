import { Users, Building2, Calendar, CreditCard } from 'lucide-react'

const stats = [
  { icon: Users, value: '5,000+', label: 'Members' },
  { icon: Building2, value: '120+', label: 'Universities' },
  { icon: Calendar, value: '50,000+', label: 'Schedules Created' },
  { icon: CreditCard, value: '99%', label: 'Satisfaction' },
]

export default function Stats() {
  return (
    <section className="py-16 px-6 bg-[#4F7CF3]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
                  <IconComponent size={28} className="text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
