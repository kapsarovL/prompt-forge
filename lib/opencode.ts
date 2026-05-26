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

export async function validateOpenCodeKey(apiKey: string, baseUrl?: string): Promise<boolean> {
  try {
    const url = baseUrl || OPENCODE_DEFAULT_BASE_URL;
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
          model: OPENCODE_DEFAULT_MODEL,
          messages: [{ role: "user", content: "Reply OK" }],
          max_tokens: 5,
        }),
        signal: controller.signal,
      });
      return res.ok;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return false;
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${config.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [...systemMsg, ...messages],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
      }),
      signal: controller.signal,
    });

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
      const status = (err as { status?: number })?.status;
      if (status !== 503 || attempt === maxRetries - 1) throw err;
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${config.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Evaluate this prompt:\n\n${prompt}` },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`OpenCode evaluate error (${res.status})`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } finally {
    clearTimeout(timeoutId);
  }
}
