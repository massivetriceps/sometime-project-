import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Blog", href: "#blog" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
            S
          </div>
          <span className="text-2xl font-bold text-dark">Sometime</span>
        </a>

        <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-muted">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#register"
          className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          Register Now
        </a>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMobileOpen(false)} className="hover:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#register"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Register Now
          </a>
        </div>
      )}
    </header>
  );
}




