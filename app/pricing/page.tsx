import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/pricing";

export const metadata: Metadata = {
  title: "Pricing — PromptForge",
  description: "One-time purchase. $5. No subscriptions. Lifetime access to PromptForge.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-amber-500/30">
      <PricingSection />
    </main>
  );
}
