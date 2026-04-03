import { Mail, Instagram, Github } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About', href: '#' },
    { label: 'Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold">Sometime</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              대학생을 위한 맞춤형 시간표 생성 서비스.
              CSP 엔진을 활용하여 최적의 시간표를 추천합니다.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Sometime. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with ♥ for university students
          </p>
        </div>
      </div>
    </footer>
  )
}
