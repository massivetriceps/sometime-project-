import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import PainPoints from "@/components/landing/PainPoints"
import Features from "@/components/landing/Features"
import Stats from "@/components/landing/Stats"
import Credits from "@/components/landing/Credits"
import Blog from "@/components/landing/Blog"
import CTA from "@/components/landing/CTA"
import Footer from "@/components/landing/Footer"

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-dark">
      <Navbar />
      <main className="pt-16 overflow-x-hidden">
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

export default LandingPage
