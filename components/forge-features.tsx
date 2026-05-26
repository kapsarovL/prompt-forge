"use client";

import { motion } from "motion/react";

import { FeatureCard } from "./feature-card";

const FEATURES = [
  {
    title: "Smart Enhance",
    desc: "Turn vague descriptions into detailed context automatically."
  },
  {
    title: "Deep Evaluation",
    desc: "Analyze clarity, specificity, and misinterpretation risks."
  },
  {
    title: "Auto-Optimization",
    desc: "One-click fixes based on AI-driven performance feedback."
  }
];

export function ForgeFeatures() {
  return (
    <section id="features" className="py-24 px-6 border-t border-white/5 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <FeatureCard
                number={`0${i + 1}`}
                title={feature.title}
                description={feature.desc}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
