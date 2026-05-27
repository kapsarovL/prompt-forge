"use client";

import { motion } from "motion/react";
import { Pen, Sparkles, Gauge } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Write Your Intent",
    description: "Describe what you need in plain language — a code snippet, marketing copy, or data analysis query.",
    icon: Pen,
  },
  {
    number: "02",
    title: "AI Forges the Prompt",
    description: "Gemini transforms your rough idea into a structured, high-quality prompt optimized for your goal.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Refine & Evaluate",
    description: "Iterate with natural language refinements, auto-fix weaknesses, and get objective quality scores.",
    icon: Gauge,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 py-28 md:py-36 px-6 md:px-8 border-t border-zinc-900/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-white mb-6 leading-[0.9]">
            How it works.
          </h2>
          <p className="text-xl text-zinc-500 font-light tracking-tight max-w-xl mx-auto">
            Three steps from idea to production-ready prompt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-zinc-800 via-amber-500/30 to-zinc-800" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Step number + icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center relative z-10">
                  <step.icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center z-20">
                  <span className="text-[10px] font-bold text-amber-400">{step.number}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
