"use client";

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      className="rounded-lg border border-border bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      onClick={() => setCount((c) => c + 1)}
    >
      count is {count}
    </button>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <a
        href="https://nextjs.org"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <img src="/next.svg" className="h-24" alt="Next.js logo" />
      </a>
      <h1 className="text-4xl font-bold leading-tight">Prompt Forge</h1>
      <div className="rounded-xl border border-border bg-muted p-6">
        <Counter />
      </div>
      <p className="text-sm text-muted-foreground">
        AI prompt engineering tool — click the logo to learn more
      </p>
    </main>
  );
}
