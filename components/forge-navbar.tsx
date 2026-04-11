"use client";

import { Sparkles } from "lucide-react";

export function ForgeNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">PromptForge</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#generator" className="hover:text-white transition-colors">Generator</a>
          <a href="#history" className="hover:text-white transition-colors">History</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
            onClick={() => window.scrollTo({ top: document.getElementById('generator')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
