"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, Menu, X } from "lucide-react";

interface ForgeNavbarProps {
  onOpenFeedback: () => void;
}

export function ForgeNavbar({ onOpenFeedback }: ForgeNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">PromptForge</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#generator" className="hover:text-white transition-colors">Generator</a>
          <a href="#history" className="hover:text-white transition-colors">History</a>
          <button onClick={onOpenFeedback} className="hover:text-white transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Feedback
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="hidden md:inline-flex px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
            onClick={() => window.scrollTo({ top: document.getElementById('generator')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Get Started
          </button>
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#generator" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Generator</a>
            <a href="#history" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>History</a>
            <button
              onClick={() => { onOpenFeedback(); setMobileOpen(false); }}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Feedback
            </button>
            <button
              className="mt-2 w-full px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
              onClick={() => {
                window.scrollTo({ top: document.getElementById('generator')?.offsetTop || 0, behavior: 'smooth' });
                setMobileOpen(false);
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
