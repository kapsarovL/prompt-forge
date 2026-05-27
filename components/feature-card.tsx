"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ number, title, description, icon: Icon }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#050505] p-10 group hover:bg-zinc-900/20 transition-colors relative overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-xs font-mono tracking-widest text-zinc-600">{number}</div>
      </div>
      <h3 className="text-2xl font-medium tracking-tight text-zinc-200 mb-4">{title}</h3>
      <p className="text-zinc-400 font-light leading-relaxed">{description}</p>
    </motion.div>
  );
}