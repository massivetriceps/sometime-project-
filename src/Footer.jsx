import { Mail, Instagram, Github } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About", href: "#" },
    { label: "Team", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <span className="text-2xl font-bold">Sometime</span>
            </div>

            <p className="mb-6 max-w-sm leading-relaxed text-gray-400">
              대학생을 위한 맞춤형 시간표 생성 서비스.
              CSP 엔진을 활용하여 최적의 시간표를 추천합니다.
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary">
                <Mail size={20} />
              </a>
              <a href="#" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2025 Sometime. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Made with ♥ for university students
          </p>
        </div>
      </div>
    </footer>
  );
}
