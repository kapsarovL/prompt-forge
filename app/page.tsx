"use client";

import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { WhyPromptForgeSection } from "@/components/landing/why-promptforge";
import { FAQSection } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-amber-500/30 overflow-hidden relative font-sans">
      <ScrollProgress />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-amber-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>


      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyPromptForgeSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
