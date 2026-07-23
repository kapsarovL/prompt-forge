"use client";

import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { PaddleCheckoutButton } from "@/components/paddle-checkout-button";

const FEATURES = [
  "Unlimited prompt generation",
  "Multi-provider support (Gemini, Claude, GPT, OpenCode)",
  "AI-powered refinement & evaluation",
  "Auto-fix weak prompts",
  "Version history & comparison",
  "Client-side encryption for API keys",
  "All future updates included",
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-mono tracking-widest uppercase text-amber-400 mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
            One price. Everything included.
          </h2>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <div className="relative bg-zinc-900/80 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
            {/* Glow */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="text-center mb-8">
              <p className="text-sm font-medium text-zinc-400 mb-2">PromptForge</p>
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className="text-5xl font-semibold text-white">$5</span>
                <span className="text-sm text-zinc-500">one-time</span>
              </div>
              <p className="text-sm text-zinc-500">Pay once. Use forever. No subscriptions.</p>
            </div>

            <div className="space-y-3.5 mb-8">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            <PaddleCheckoutButton
              priceId={process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? ''}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Buy for $5
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </PaddleCheckoutButton>

            <p className="text-center text-[11px] text-zinc-600 mt-4">
              Bring your own API keys. We never store or see them.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
