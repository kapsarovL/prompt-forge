"use client";

import { motion } from "motion/react";
import { Zap } from "lucide-react";

export function ForgeHero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="max-w-350 mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800/60 backdrop-blur-md mb-8"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            Multi-model prompt crafting
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[88px] font-medium tracking-tighter text-white leading-[0.88]"
        >
          Craft every
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            prompt.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-sm text-zinc-500 font-light"
        >
          Bring your own API keys for Gemini, Claude, GPT, or OpenCode.
        </motion.p>
      </div>
    </section>
  );
}
