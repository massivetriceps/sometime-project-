import { Link } from "react-router-dom"

export default function GachonBrand({
  to = "/",
  size = "md",
  showSubtitle = false,
  textColor = "dark",
}) {
  const sizeMap = {
    sm: {
      wrap: "w-11 h-11 rounded-xl",
      img: "w-full h-full p-2",
      title: "text-lg",
      subtitle: "text-[11px]",
      gap: "gap-2.5",
    },
    md: {
      wrap: "w-14 h-14 rounded-2xl",
      img: "w-full h-full p-2.5",
      title: "text-xl",
      subtitle: "text-xs",
      gap: "gap-3",
    },
    lg: {
      wrap: "w-16 h-16 rounded-2xl",
      img: "w-full h-full p-3",
      title: "text-2xl",
      subtitle: "text-sm",
      gap: "gap-3.5",
    },
  }

  const textColorMap = {
    dark: {
      title: "text-[#1F2937]",
      subtitle: "text-[#6B7280]",
      bg: "bg-white shadow-lg shadow-[#4F7CF3]/10 border border-[#E8F0FF]",
    },
    light: {
      title: "text-white",
      subtitle: "text-white/75",
      bg: "bg-white/15 backdrop-blur-sm border border-white/10",
    },
  }

  const currentSize = sizeMap[size] || sizeMap.md
  const currentColor = textColorMap[textColor] || textColorMap.dark

  return (
    <Link to={to} className={`inline-flex items-center ${currentSize.gap}`}>
      <div
        className={`${currentSize.wrap} ${currentColor.bg} flex items-center justify-center shrink-0`}
      >
        <img
          src="/gachon-icon.svg"
          alt="가천대학교 아이콘"
          className={`${currentSize.img} object-contain block`}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = "/gachon-icon.png"
          }}
        />
      </div>

      <div className="leading-none">
        <div className={`${currentSize.title} font-bold ${currentColor.title}`}>
          Sometime
        </div>
        {showSubtitle && (
          <div className={`mt-1 ${currentSize.subtitle} ${currentColor.subtitle}`}>
            가천대학교 커뮤니티
          </div>
        )}
      </div>
    </Link>
  )
}
