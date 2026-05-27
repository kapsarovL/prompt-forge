"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Forge", href: "/forge" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Resources: [
    { label: "Gemini API", href: "https://ai.google.dev/" },
    { label: "OpenCode", href: "https://opencode.ai" },
    { label: "Anthropic", href: "https://anthropic.com" },
  ],
  Legal: [
    { label: "MIT License", href: "https://github.com/anomalyco/prompt-forge/blob/main/LICENSE" },
    { label: "Privacy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-900/50 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">PromptForge</span>
            </Link>
            <p className="text-xs text-zinc-600 font-light leading-relaxed max-w-xs">
              Precision prompts at the speed of thought.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-600">
            Built with Gemini API &bull; {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-zinc-700">
            Open source &mdash; MIT licensed
          </p>
        </div>
      </div>
    </footer>
  );
}
