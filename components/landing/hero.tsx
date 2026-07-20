"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Wand2, MessageSquare } from "lucide-react";

export function Hero() {
  return (
    <section className="relative z-10 pt-28 md:pt-36 pb-24 md:pb-40 px-6 md:px-8 max-w-[1400px] mx-auto flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800/60 backdrop-blur-md mb-10"
      >
        <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">Multi-model prompt crafting</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl md:text-8xl lg:text-[112px] font-medium tracking-wide text-white mb-8 leading-[0.88]"
      >
        Forge the&nbsp;perfect
        <br />
        <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
          prompt.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light tracking-tight leading-relaxed"
      >
        Transform natural language into precision-crafted prompts for Gemini, Claude, GPT, OpenCode, and beyond.
        Built for freelancers, creators, and independent professionals.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-3"
      >
        <Link
          href="/forge"
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)] hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.35)] hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 active:scale-95"
        >
          Start Forging
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href="#features"
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-white/10 hover:bg-zinc-800 transition-all active:scale-95"
        >
          Explore Features
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
      <span className="text-xs text-zinc-600 mb-20">7-day free trial &middot; then $5 &middot; Bring your own API keys</span>

      {/* Product Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl"
      >
        {/* Browser chrome */}
        <div className="relative bg-zinc-800/80 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
          {/* Window controls */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-zinc-900/90 border-b border-zinc-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-zinc-800 rounded-md text-[10px] font-mono text-zinc-500">
                promptforge.app
              </div>
            </div>
          </div>

          {/* App preview */}
          <div className="flex flex-col md:flex-row gap-px bg-zinc-700/50">
            {/* Input panel */}
            <div className="flex-1 p-6 md:p-8 bg-[#050505]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <Wand2 className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Intent</span>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-zinc-800 rounded-full w-full shimmer" />
                <div className="h-3 bg-zinc-800 rounded-full w-[85%] shimmer" />
                <div className="h-3 bg-zinc-800 rounded-full w-[60%] shimmer" />
              </div>
              <div className="mt-6 flex gap-2">
                <div className="h-9 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-lg flex-1" />
                <div className="h-9 bg-zinc-800 rounded-lg w-20" />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-zinc-700/50" />

            {/* Output panel */}
            <div className="flex-1 p-6 md:p-8 bg-[#050505]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Generated Prompt</span>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <div className="space-y-2.5">
                  <div className="h-2.5 bg-zinc-800 rounded-full w-full" />
                  <div className="h-2.5 bg-zinc-800 rounded-full w-[92%]" />
                  <div className="h-2.5 bg-zinc-800 rounded-full w-[78%]" />
                  <div className="h-2.5 bg-zinc-800 rounded-full w-[88%]" />
                  <div className="h-2.5 bg-zinc-800 rounded-full w-[45%]" />
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <div className="h-2 bg-emerald-500/20 rounded-full w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative glow behind mockup */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-amber-500/20 blur-[60px] rounded-full pointer-events-none" />
      </motion.div>
    </section>
  );
}
