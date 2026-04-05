import { Mail, Instagram, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* 로고 + 설명 */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F7CF3] font-bold">
                S
              </div>
              <span className="text-xl font-bold">Sometime</span>
            </div>

            <p className="mt-4 text-sm text-gray-300 leading-6">
              대학생을 위한 맞춤형 시간표 생성 서비스. CSP 엔진을 활용하여 최적의 시간표를 추천합니다.
            </p>

            <div className="mt-6 flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                <Mail size={18} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                <Instagram size={18} />
              </div>

              {/* ✅ 깃허브 → 전화 아이콘 변경 */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                <Phone size={18} />
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>About</li>
              <li>Team</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© 2025 Sometime. All rights reserved.</p>

          {/* ✅ 문구 수정 */}
          <p>Made with ♥ for Gachon university students</p>
        </div>

      </div>
    </footer>
  )
}
