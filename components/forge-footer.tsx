"use client";

import Link from "next/link";
import { Sparkles, Github } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Generator", href: "#generator" },
    { label: "Vault", href: "#history" },
    { label: "Landing", href: "/" },
  ],
  Resources: [
    { label: "Gemini", href: "https://ai.google.dev/" },
    { label: "Claude", href: "https://www.anthropic.com" },
    { label: "GPT", href: "https://platform.openai.com/" },
    { label: "OpenCode", href: "https://opencode.ai" },
  ],
  Legal: [
    { label: "Terms", href: "/#terms" },
    { label: "Privacy", href: "/#terms" },
    { label: "GitHub", href: "https://github.com/prismaflux/prompt-forge" },
  ],
};

export function ForgeFooter() {
  return (
    <footer className="relative border-t border-zinc-900/50 bg-[#050505]">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_12px_-4px_rgba(245,158,11,0.2)]">
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
            Free trial &amp; $5 one-time &bull; {new Date().getFullYear()}
          </p>
          <a
            href="https://github.com/prismaflux/prompt-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3 h-3" /> Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
