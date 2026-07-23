import Link from "next/link";
import { Logo } from "@/components/logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400">
      <header className="border-b border-zinc-900/50">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={32} showWordmark={false} />
            <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">PromptForge</span>
          </Link>
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-zinc prose-headings:text-zinc-200 prose-headings:font-semibold prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-300 prose-code:text-zinc-500 prose-code:before:content-none prose-code:after:content-none">
        {children}
      </main>

      <footer className="border-t border-zinc-900/50">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-700">
            &copy; {new Date().getFullYear()} PromptForge
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/refund" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Refunds</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
