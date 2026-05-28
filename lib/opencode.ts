export const OPENCODE_DEFAULT_BASE_URL = "https://opencode.ai/zen/v1";
export const OPENCODE_DEFAULT_MODEL = "opencode/big-pickle";

export interface OpenCodeConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export function getOpenCodeConfig(): OpenCodeConfig | null {
  if (typeof window === "undefined") return null;
  const apiKey = localStorage.getItem("promptforge_opencode_api_key");
  if (!apiKey) return null;
  return {
    apiKey,
    model: localStorage.getItem("promptforge_opencode_model") || OPENCODE_DEFAULT_MODEL,
    baseUrl: localStorage.getItem("promptforge_opencode_base_url") || OPENCODE_DEFAULT_BASE_URL,
  };
}

export interface ValidationResult {
  valid: boolean;
  status?: number;
  error?: string;
}

/**
 * Validates an OpenCode API key by attempting a minimal chat completion.
 * Returns a detailed result with HTTP status and error message on failure.
 * This allows the UI to show meaningful errors and offer a "Save Anyway"
 * option for false negatives (e.g., free tiers, transient failures).
 */
export async function validateOpenCodeKey(apiKey: string, baseUrl?: string, model?: string): Promise<ValidationResult> {
  try {
    const url = (baseUrl || OPENCODE_DEFAULT_BASE_URL).replace(/\/+$/, "");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${url}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || OPENCODE_DEFAULT_MODEL,
          messages: [{ role: "user", content: "Reply OK" }],
          max_tokens: 5,
        }),
        signal: controller.signal,
      });

      if (res.ok) return { valid: true, status: res.status };

      // Try to extract a meaningful error from the response body
      let errorMsg = "";
      try {
        const body = await res.text();
        if (body) {
          // Attempt JSON parse for structured errors
          try {
            const json = JSON.parse(body);
            errorMsg = json.error?.message || json.message || body.slice(0, 200);
          } catch {
            errorMsg = body.slice(0, 200);
          }
        }
      } catch {
        // Ignore body read errors
      }

      return { valid: false, status: res.status, error: errorMsg || `HTTP ${res.status}` };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { valid: false, error: "Request timed out after 15s" };
    }
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { valid: false, error: msg };
  }
}

/** Build the OpenCode chat completions endpoint URL (normalized). */
function openCodeEndpoint(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
}

/**
 * Attempts a fetch to the OpenCode API with CORS detection.
 * Wraps raw TypeError (network errors) with a detailed message that
 * explains how to resolve the issue.
 */
async function openCodeFetch(
  url: string,
  body: Record<string, unknown>,
  apiKey: string,
  signal: AbortSignal,
): Promise<Response> {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (!(err instanceof TypeError)) throw err;

    // Try with no-cors to distinguish "server reachable but CORS blocked"
    // from "server unreachable" — no-cors returns opaque on success.
    let serverReachable = false;
    try {
      const probeController = new AbortController();
      const probeTimeout = setTimeout(() => probeController.abort(), 5000);
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: "ping",
          mode: "no-cors",
          signal: probeController.signal,
        });
        serverReachable = true;
      } finally {
        clearTimeout(probeTimeout);
      }
    } catch {
      serverReachable = false;
    }

    if (serverReachable) {
      throw new Error(
        `Cannot connect to ${url}. The server is reachable but does not allow ` +
        `cross-origin requests from browser apps (CORS).\n\n` +
        `Solutions:\n` +
        `1. Set up a CORS proxy and enter its URL as the Base URL in Settings\n` +
        `2. If you control the server, enable CORS for this domain\n` +
        `3. Use a provider that supports browser-based API access`,
      );
    }

    // Extract hostname for a more specific message
    let hostname = url;
    try { hostname = new URL(url).hostname; } catch {}

    throw new Error(
      `Cannot connect to ${url}. The server at ${hostname} could not be reached.\n\n` +
      `This usually means the URL is wrong for your provider.\n\n` +
      `Check:\n` +
      `1. Go to Settings → OpenCode and verify the Base URL\n` +
      `2. The free tier may use a different endpoint — check your provider's docs\n` +
      `3. If self-hosting, make sure the server is running and publicly accessible\n` +
      `4. Your network connection is working`,
    );
  }
}

async function openCodeCompletion(
  config: OpenCodeConfig,
  messages: { role: string; content: string }[],
  options?: { systemInstruction?: string; temperature?: number; maxTokens?: number },
): Promise<string | null> {
  const systemMsg = options?.systemInstruction
    ? [{ role: "system", content: options.systemInstruction }]
    : [];

  const url = openCodeEndpoint(config.baseUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await openCodeFetch(
      url,
      {
        model: config.model,
        messages: [...systemMsg, ...messages],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
      },
      config.apiKey,
      controller.signal,
    );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenCode API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function openCodeGenerateWithRetry(
  config: OpenCodeConfig,
  messages: { role: string; content: string }[],
  options?: { systemInstruction?: string; temperature?: number; maxTokens?: number },
  maxRetries = 3,
): Promise<string | null> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await openCodeCompletion(config, messages, options);
    } catch (err) {
      lastError = err;
      // Retry on HTTP 503 AND network errors (TypeError → wrapped as Error)
      const error = err as Error;
      const isRetryable =
        // HTTP 503 from the API
        (err as { status?: number })?.status === 503 ||
        // Network error (wrapped by openCodeFetch with a message)
        (err instanceof Error && err.message.includes("Cannot connect to"));
      if (!isRetryable || attempt === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

export async function openCodeEvaluate(
  config: OpenCodeConfig,
  prompt: string,
): Promise<string | null> {
  const systemInstruction = `You are a Prompt Quality Evaluator.
Analyze the provided prompt based on three key criteria:
1. Clarity: How easy is it for the model to understand the core intent?
2. Specificity: Does the prompt provide enough detail, context, and constraints?
3. Misinterpretation Risk: Are there ambiguous terms or conflicting instructions?

Provide a score from 1-10 for each criterion and an overall rating. Give constructive feedback.

Return valid JSON only with this exact structure:
{
  "rating": number,
  "criteria": { "clarity": number, "specificity": number, "misinterpretationRisk": number },
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}`;

  const url = openCodeEndpoint(config.baseUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await openCodeFetch(
      url,
      {
        model: config.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Evaluate this prompt:\n\n${prompt}` },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      },
      config.apiKey,
      controller.signal,
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OpenCode evaluate error (${res.status}): ${body}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } finally {
    clearTimeout(timeoutId);
  }
}
