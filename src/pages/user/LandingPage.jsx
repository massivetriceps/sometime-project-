import Navbar from "../../Navbar";
import Hero from "../../Hero";
import PainPoints from "../../PainPoints";
import Features from "../../Features";
import Stats from "../../Stats";
import Credits from "../../Credits";
import Blog from "../../Blog";
import CTA from "../../CTA";
import Footer from "../../Footer";

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
  );
}

export default LandingPage;
