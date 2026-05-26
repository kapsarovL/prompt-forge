"use client";

import { motion } from "motion/react";

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

export function FeatureCard({ number, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#050505] p-10 group hover:bg-zinc-900/20 transition-colors"
    >
      <div className="text-xs font-mono tracking-widest text-zinc-600 mb-8">{number}</div>
      <h3 className="text-2xl font-medium tracking-tight text-zinc-200 mb-4">{title}</h3>
      <p className="text-zinc-500 font-light leading-relaxed">{description}</p>
    </motion.div>
  );
}