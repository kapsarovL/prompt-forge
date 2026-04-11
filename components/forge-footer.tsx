"use client";

import { Sparkles } from "lucide-react";

export function ForgeFooter() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-semibold text-white">PromptForge</span>
        </div>
        <p className="text-xs text-zinc-600 font-light">© 2026 PromptForge. Built for the frontier.</p>
        <div className="flex gap-6 text-xs font-medium text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  );
}
