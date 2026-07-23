"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Settings, History, Menu, X, Github } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/logo";

interface ForgeNavbarProps {
  onOpenFeedback: () => void;
  onOpenSettings: () => void;
  onOpenVersions: () => void;
  hasGeneratedPrompt: boolean;
}

export function ForgeNavbar({ onOpenFeedback, onOpenSettings, onOpenVersions, hasGeneratedPrompt }: ForgeNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.08] mix-blend-overlay pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo
            size={40}
            className="group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all"
          />
        </Link>

        <div className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
          <a href="#generator" className="px-3 py-2 hover:text-white transition-colors tracking-wider relative group">
            Generator
            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>
          <a href="#history" className="px-3 py-2 hover:text-white transition-colors tracking-wider relative group">
            History
            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>
          {hasGeneratedPrompt && (
            <button onClick={onOpenVersions} className="px-3 py-2 hover:text-white transition-colors tracking-wider flex items-center gap-1.5 relative group">
              <History className="w-3 h-3" />
              Versions
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          )}
          <button onClick={onOpenSettings} className="px-3 py-2 hover:text-white transition-colors tracking-wider flex items-center gap-1.5 relative group">
            <Settings className="w-3 h-3" />
            Settings
            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          <button onClick={onOpenFeedback} className="px-3 py-2 hover:text-white transition-colors tracking-wider flex items-center gap-1.5 relative group">
            <MessageSquare className="w-3 h-3" />
            Feedback
            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/prismaflux/prompt-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex p-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-all"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-4 py-3 gap-0.5 text-sm text-zinc-400">
              <a href="#generator" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all" onClick={() => setMobileOpen(false)}>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                Generator
              </a>
              <a href="#history" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all" onClick={() => setMobileOpen(false)}>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                History
              </a>
              {hasGeneratedPrompt && (
                <button onClick={() => { onOpenVersions(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all">
                  <History className="w-4 h-4 text-zinc-600" /> Versions
                </button>
              )}
              <div className="border-t border-white/5 my-2" />
              <button onClick={() => { onOpenSettings(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all">
                <Settings className="w-4 h-4 text-zinc-600" /> Settings
              </button>
              <button onClick={() => { onOpenFeedback(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all">
                <MessageSquare className="w-4 h-4 text-zinc-600" /> Feedback
              </button>
              <a
                href="https://github.com/prismaflux/prompt-forge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-amber-500/5 rounded-xl transition-all"
              >
                <Github className="w-4 h-4 text-zinc-600" /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
