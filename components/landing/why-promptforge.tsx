"use client";

import { motion } from "motion/react";
import { Server, Sliders, History, ShieldCheck } from "lucide-react";

const REASONS = [
  { title: "Zero Backend", description: "Everything runs in your browser. No accounts, no servers, no data leaves your machine.", icon: Server },
  { title: "Multiple AI Providers", description: "Gemini, OpenCode, Anthropic, or OpenAI — swap providers without changing your workflow.", icon: Sliders },
  { title: "Version Tracking", description: "Every generation is automatically saved. Browse, compare, and restore any version.", icon: History },
  { title: "Built-in Evaluation", description: "Deep analysis across clarity, specificity, and misinterpretation risk — with one-click auto-fix.", icon: ShieldCheck },
];

export function WhyPromptForgeSection() {
  return (
    <section className="relative z-10 py-28 md:py-36 px-6 md:px-8 border-t border-zinc-900/50 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-white mb-6 leading-[0.9]">
            Why PromptForge?
          </h2>
          <p className="text-xl text-zinc-500 font-light tracking-tight max-w-xl mx-auto">
            A purpose-built workspace, not another chat interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900/50 rounded-2xl overflow-hidden">
          {REASONS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#050505] p-10 group hover:bg-zinc-900/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <item.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
