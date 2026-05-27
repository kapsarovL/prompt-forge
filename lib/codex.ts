const CODEX_KEY_STORAGE_KEY = "pf_codex_key";
const CODEX_DEFAULT_MODEL = "gpt-4o";
const CODEX_API_URL = "https://api.openai.com/v1/chat/completions";

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
): Promise<Response> {
  const response = await fetch(CODEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

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

async function generateWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
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

    const response = await codexFetch(apiKey, body);

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
): Promise<string> {
  const result = await generateWithRetry(async () => {
    const response = await codexFetch(apiKey, {
      model: model ?? CODEX_DEFAULT_MODEL,
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
        { role: "assistant", content: "Expert analysis and critique, structured for AI training purposes." },
        { role: "user", content: evaluationPrompt },
      ],
      temperature: 0.3,
    });

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
