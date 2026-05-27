"use client";

import { motion } from "motion/react";
import { Sparkles, BarChart, Zap } from "lucide-react";

import { FeatureCard } from "./feature-card";

const FEATURES = [
  {
    number: "01", title: "Smart Enhance",
    description: "Turn vague descriptions into detailed context automatically.",
    icon: Sparkles,
  },
  {
    number: "02", title: "Deep Evaluation",
    description: "Analyze clarity, specificity, and misinterpretation risks.",
    icon: BarChart,
  },
  {
    number: "03", title: "Auto-Optimization",
    description: "One-click fixes based on AI-driven performance feedback.",
    icon: Zap,
  },
];

export function ForgeFeatures() {
  return (
    <section className="py-20 px-6 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold tracking-wide">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="text-sm text-zinc-500 font-light mt-2">Tools built into every forge session.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeatureCard
                number={feature.number}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
