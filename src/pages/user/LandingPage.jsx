import Navbar from "@/components/user/landing/Navbar"
import Hero from "@/components/user/landing/Hero"
import PainPoints from "@/components/user/landing/PainPoints"
import Features from "@/components/user/landing/Features"
import Stats from "@/components/user/landing/Stats"
import Credits from "@/components/user/landing/Credits"
import Blog from "@/components/user/landing/Blog"
import CTA from "@/components/user/landing/CTA"
import Footer from "@/components/user/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <Stats />
        <Credits />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}


