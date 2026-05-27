const ANTHROPIC_KEY_STORAGE_KEY = "pf_anthropic_key";
const ANTHROPIC_DEFAULT_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export function getAnthropicKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ANTHROPIC_KEY_STORAGE_KEY) ?? process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ?? null;
}

export function setAnthropicKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANTHROPIC_KEY_STORAGE_KEY, key);
}

export function removeAnthropicKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANTHROPIC_KEY_STORAGE_KEY);
}

export function getAnthropicModel(): string {
  if (typeof window === "undefined") return ANTHROPIC_DEFAULT_MODEL;
  return localStorage.getItem("pf_anthropic_model") ?? ANTHROPIC_DEFAULT_MODEL;
}

export function setAnthropicModel(model: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("pf_anthropic_model", model);
}

class AnthropicAPIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AnthropicAPIError";
  }
}

async function anthropicFetch(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const err = await response.json() as { error?: { message?: string } };
      message = err.error?.message ?? message;
    } catch {}
    throw new AnthropicAPIError(response.status, message);
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
        error instanceof AnthropicAPIError &&
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

export async function validateAnthropicKey(key?: string): Promise<boolean> {
  const apiKey = key ?? getAnthropicKey();
  if (!apiKey) return false;

  try {
    const response = await anthropicFetch(apiKey, {
      model: ANTHROPIC_DEFAULT_MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "ok" }],
    });
    return response.ok;
  } catch (error) {
    if (error instanceof AnthropicAPIError && error.status === 400) {
      return true;
    }
    return false;
  }
}

export async function generateWithAnthropic(
  apiKey: string,
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<string> {
  const result = await generateWithRetry(async () => {
    const response = await anthropicFetch(apiKey, {
      model: options?.model ?? ANTHROPIC_DEFAULT_MODEL,
      max_tokens: options?.maxTokens ?? 4096,
      system,
      messages,
      temperature: options?.temperature ?? 0.7,
    });

    const data = await response.json() as {
      content?: { type: string; text: string }[];
    };

    const text = (data.content ?? [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!text) {
      throw new Error("Anthropic returned an empty response.");
    }

    return text;
  });

  return result;
}

export async function evaluateWithAnthropic(
  prompt: string,
  systemPrompt: string,
  evaluationPrompt: string,
  apiKey: string,
  model?: string,
): Promise<string> {
  const result = await generateWithRetry(async () => {
    const response = await anthropicFetch(apiKey, {
      model: model ?? ANTHROPIC_DEFAULT_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: "Expert analysis and critique, structured for AI training purposes." },
        { role: "user", content: evaluationPrompt },
      ],
    });

    const data = await response.json() as {
      content?: { type: string; text: string }[];
    };

    const text = (data.content ?? [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!text) {
      throw new Error("Anthropic returned an empty response.");
    }

    return text;
  });

  return result;
}
