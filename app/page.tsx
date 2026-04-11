"use client"
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, ArrowRight} from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

export default function Home() {
  return (
   <main className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
  </div>

  <nav className="relative z-10 flex items-center justify-between px-8 max-w- mx-auto">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900/50">
      <Sparkles className="w-4 h-4 text-zinc-300" />
      </div>
      <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">PromptForge</span>
    </div>
    <div className="flex items-center gap-6">
      <Link 
      href="/"
      className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
        Lunch App
      </Link>
    </div>
  </nav>

  <section className="relative z-10 pt-32 pb-40 px-8 max-w-350 mx-auto flex flex-col items-center text-center">
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800/60 backdrop-blur-md mb-12">
      <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
      <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">Gemini 3.1 Pro Preview</span>
    </motion.div>

    <motion.h1 
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    className="text-6xl md:text-8xl lg:text-[112px] font-medium tracking-tighter text-white mb-8 mx-w-auto leading-[0.88]">
      Forge the perfect prompt.
    </motion.h1>

    <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-16 font-light tracking-tight leading-relaxed"
        >
          Transform natural language into precision-engineered Gemini prompts. Built for developers, creators, and analysts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/forge"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium transition-all hover:scale-105 active:scale-95"
          >
            Start Forging
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white border border-zinc-800 rounded-full font-medium transition-all hover:bg-zinc-900"
          >
            Explore Features
          </a>
        </motion.div>
  </section>

   <section id="features" className="relative z-10 py-32 px-8 border-t border-zinc-900/50 bg-[#050505]">
    <div className="max-w-350 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6 leading-[0.9]">
                Precision engineering.
              </h2>
              <p className="text-xl text-zinc-500 font-light tracking-tight">
                Everything you need to craft, test, and manage your prompt library.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-zinc-500 rotate-45" />
              </div>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900/50">
            <FeatureCard 
              number="01"
              title="Instant Optimization"
              description="Convert vague ideas into structured, high-performing prompts instantly using Gemini 3.1 Pro."
            />
            <FeatureCard 
              number="02"
              title="Template Gallery"
              description="Access a rich library of pre-defined templates or save your own custom templates for quick reuse."
            />
            <FeatureCard 
              number="03"
              title="Version History"
              description="Never lose a good prompt. Automatically track your recent generations and recall them anytime."
            />
            <FeatureCard 
              number="04"
              title="Coding Prompts"
              description="Specialized optimizations for software development, debugging, and architecture tasks."
            />
            <FeatureCard 
              number="05"
              title="Creative Writing"
              description="Tailored structures for storytelling, marketing copy, and creative content generation."
            />
            <FeatureCard 
              number="06"
              title="Data Analysis"
              description="Precise instructions for data interpretation, research summaries, and analytical tasks."
            />
          </div>

   </div>
   </section>
    <footer className="relative z-10 py-12 px-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between max-w-350 mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50">
            <Sparkles className="w-3 h-3 text-zinc-500" />
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500">PromptForge</span>
        </div>
        <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-600">
          Built with Gemini API &bull; {new Date().getFullYear()}
        </p>
      </footer>
   </main>
  );
}
