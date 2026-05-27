"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 md:px-8 max-w-[1400px] mx-auto py-5">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">PromptForge</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs font-semibold tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/forge"
          className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
        >
          Launch App
        </Link>
      </div>

      <button
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mx-6 mt-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/forge"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors mt-1"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
