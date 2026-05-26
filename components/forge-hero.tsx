"use client";

import { motion } from "motion/react";
import { Zap, ArrowRight } from "lucide-react";

interface ForgeHeroProps {
  onBrowseGallery: () => void;
}

export function ForgeHero({ onBrowseGallery }: ForgeHeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-8"
        >
          <Zap className="w-3 h-3" />
          Powered by Gemini &amp; OpenCode
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-8 leading-[0.9]"
        >
          Precision Prompts <br />
          <span className="text-zinc-500">at the speed of thought.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12"
        >
          Stop guessing. Start engineering. PromptForge uses frontier-level AI to transform your ideas into optimized, high-performance instructions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#generator"
            className="forge-ember px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-2xl shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)] hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.35)] hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Start Forging
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={onBrowseGallery}
            className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10 hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Browse Gallery
          </button>
        </motion.div>
      </div>
    </section>
  );
}
