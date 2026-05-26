import { ErrorBoundary } from "@/components/error-boundary";
import { PromptForge } from "@/components/prompt-forge";

export default function PromptForgePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-amber-500/30">
      <ErrorBoundary>
        <PromptForge />
      </ErrorBoundary>
    </main>
  );
}
