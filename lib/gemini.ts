import { GoogleGenAI } from "@google/genai";

export function getApiKey(): string | undefined {
  if (typeof window !== "undefined") {
    const userKey = localStorage.getItem("promptforge_api_key");
    if (userKey) return userKey;
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

export function createClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

interface GenerateContentInput {
  model: string;
  contents: string;
  config?: Record<string, unknown>;
}

export async function generateWithRetry(
  client: GoogleGenAI,
  { model, contents, config }: GenerateContentInput,
  maxRetries = 3,
): Promise<string | null> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config,
      });
      return response.text?.trim() ?? null;
    } catch (err) {
      lastError = err;
      const apiError = err as { status?: number };
      const isRetryable = apiError?.status === 503 || apiError?.status === 429;
      if (!isRetryable || attempt === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

export function getErrorMessage(err: unknown): string {
  const apiError = err as { status?: number; message?: string } | null;
  if (apiError?.status === 503) {
    return "The service is temporarily unavailable. Please try again in a moment.";
  }
  if (apiError?.status === 429) {
    return "API quota exceeded. Please check your Gemini API key and billing, or try a different model.";
  }
  return apiError?.message || "An unexpected error occurred.";
}
