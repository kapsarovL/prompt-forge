const CODEX_KEY_STORAGE_KEY = "pf_codex_key";
const CODEX_DEFAULT_MODEL = "gpt-4o";
const CODEX_API_URL = "https://api.openai.com/v1/chat/completions";
const CODEX_TIMEOUT_MS = 30_000;

export function getCodexKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CODEX_KEY_STORAGE_KEY) ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? null;
}

export function setCodexKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CODEX_KEY_STORAGE_KEY, key);
}

export function removeCodexKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CODEX_KEY_STORAGE_KEY);
}

export function getCodexModel(): string {
  if (typeof window === "undefined") return CODEX_DEFAULT_MODEL;
  return localStorage.getItem("pf_codex_model") ?? CODEX_DEFAULT_MODEL;
}

export function setCodexModel(model: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("pf_codex_model", model);
}

class CodexAPIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "CodexAPIError";
  }
}

async function codexFetch(
  apiKey: string,
  body: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CODEX_TIMEOUT_MS);
  const combinedSignal = signal
    ? combineSignals(signal, controller.signal)
    : controller.signal;

  let response;
  try {
    response = await fetch(CODEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: combinedSignal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const err = await response.json() as { error?: { message?: string } };
      message = err.error?.message ?? message;
    } catch {}
    throw new CodexAPIError(response.status, message);
  }

  return response;
}

/** Combine two AbortSignals: if either aborts, the combined signal aborts. */
function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
}

async function generateWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (signal?.aborted) {
        throw new DOMException("Request was aborted", "AbortError");
      }
      return await fn();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      lastError = error;
      if (
        error instanceof CodexAPIError &&
        (error.status === 429 || error.status >= 500)
      ) {
        if (i < maxRetries) {
          const wait = Math.pow(4, i) * 1000;
          await new Promise((resolve) => setTimeout(resolve, wait));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

export async function validateCodexKey(key?: string): Promise<boolean> {
  const apiKey = key ?? getCodexKey();
  if (!apiKey) return false;

  try {
    const response = await codexFetch(apiKey, {
      model: CODEX_DEFAULT_MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "ok" }],
    });
    return response.ok;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return false;
    }
    if (error instanceof CodexAPIError && error.status === 400) {
      return true;
    }
    return false;
  }
}

export async function generateWithCodex(
  apiKey: string,
  system: string,
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  options?: { model?: string; temperature?: number; maxTokens?: number },
  signal?: AbortSignal,
): Promise<string> {
  const result = await generateWithRetry(async () => {
    const body: Record<string, unknown> = {
      model: options?.model ?? CODEX_DEFAULT_MODEL,
      max_tokens: options?.maxTokens ?? 4096,
      messages: [
        { role: "system", content: system },
        ...messages,
      ],
    };
    if (options?.temperature !== undefined) {
      body.temperature = options.temperature;
    }

    const response = await codexFetch(apiKey, body, signal);

    const data = await response.json() as {
      choices?: { message?: { content?: string | null } }[];
    };

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
      throw new Error("OpenAI returned an empty response.");
    }

    return text;
  });

  return result;
}

export async function evaluateWithCodex(
  prompt: string,
  systemPrompt: string,
  evaluationPrompt: string,
  apiKey: string,
  model?: string,
  signal?: AbortSignal,
): Promise<string> {
  const result = await generateWithRetry(async () => {
    const response = await codexFetch(
      apiKey,
      {
        model: model ?? CODEX_DEFAULT_MODEL,
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
          { role: "assistant", content: "Expert analysis and critique, structured for AI training purposes." },
          { role: "user", content: evaluationPrompt },
        ],
        temperature: 0.3,
      },
      signal,
    );

    const data = await response.json() as {
      choices?: { message?: { content?: string | null } }[];
    };

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
      throw new Error("OpenAI returned an empty response.");
    }

    return text;
  });

  return result;
}
