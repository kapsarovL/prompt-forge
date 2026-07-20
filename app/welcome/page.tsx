import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Welcome — PromptForge',
  description: 'Your purchase was successful. Welcome to PromptForge.',
};

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* Glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full" />
          <div className="relative text-6xl">&#10003;</div>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-4">
          Welcome to PromptForge
        </h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your purchase was successful. You now have full access to all features in
          your plan. Start crafting better prompts today.
        </p>

        <Link
          href="/forge"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98]"
        >
          Open PromptForge
        </Link>

        <p className="text-zinc-600 text-sm mt-6">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </main>
  );
}
