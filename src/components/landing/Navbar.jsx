import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="w-full border-b border-[#E8F0FF] bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* 로고 + 아이콘 */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/gachon-icon.svg"
            alt="가천대학교 아이콘"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-[#1F2937]">
            Sometime
          </span>
        </Link>

        {/* 메뉴 */}
        <nav className="flex gap-6 text-[#6B7280] text-sm">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Community</a>
          <a href="#">Blog</a>
          <a href="#">Pricing</a>
        </nav>

      </div>
    </header>
  )
}
