export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white px-6 py-14 mt-20">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">

        {/* 브랜드 */}
        <div>
          <h2 className="text-2xl font-bold text-white">Sometime</h2>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            가천대학교 학생을 위한 맞춤형 시간표 생성 서비스입니다.
            <br />
            CSP 엔진을 활용하여 최적의 시간표를 추천합니다.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>About</li>
            <li>Team</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Help Center</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>FAQ</li>
          </ul>
        </div>

      </div>

      {/* 하단 */}
      <div className="mt-10 text-center text-sm text-gray-400">
        <p>© 2025 Sometime. All rights reserved.</p>
        <p className="mt-2">Made with ❤️ for university students</p>
      </div>
    </footer>
  )
}
