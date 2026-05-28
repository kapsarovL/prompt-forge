import { GoogleGenAI } from "@google/genai";

export const GEMINI_TIMEOUT_MS = 30_000;

/**
 * Creates a GoogleGenAI client with optional custom fetch.
 * When `signal` is provided, the underlying fetch will abort on signal.
 */
export function createClient(
  apiKey: string,
): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export function getApiKey(): string | undefined {
  if (typeof window !== "undefined") {
    const userKey = localStorage.getItem("promptforge_api_key");
    if (userKey) return userKey;
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

interface GenerateContentInput {
  model: string;
  contents: string;
  config?: Record<string, unknown>;
}

/**
 * Calls the Gemini API with retry and optional abort signal support.
 * When `signal` is provided, the call races against the abort signal so
 * the promise rejects (without truly aborting the underlying HTTP request
 * since the Google SDK doesn't expose per-request signal passing).
 * A 30s timeout is enforced via a wrapped timeout controller.
 */
export async function generateWithRetry(
  client: GoogleGenAI,
  { model, contents, config }: GenerateContentInput,
  maxRetries = 3,
  signal?: AbortSignal,
): Promise<string | null> {
  // Merge caller-provided signal with a 30s hard timeout
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), GEMINI_TIMEOUT_MS);

  const effectiveSignal = signal
    ? combineAbortSignals(signal, timeoutController.signal)
    : timeoutController.signal;

  let lastError: unknown;
  try {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (effectiveSignal.aborted) {
          throw new DOMException("Request was aborted", "AbortError");
        }

        // Race the SDK call against the abort signal
        const response = await Promise.race([
          client.models.generateContent({ model, contents, config }),
          abortSignalPromise(effectiveSignal),
        ]);

        return response.text?.trim() ?? null;
      } catch (err) {
        // Don't retry aborted requests
        if (err instanceof DOMException && err.name === "AbortError") {
          throw err;
        }
        lastError = err;
        const apiError = err as { status?: number };
        const isRetryable = apiError?.status === 503 || apiError?.status === 429;
        if (!isRetryable || attempt === maxRetries - 1) throw err;
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
  throw lastError;
}

/**
 * Returns a promise that rejects with AbortError when the signal is aborted.
 */
function abortSignalPromise(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Request was aborted", "AbortError"));
      return;
    }
    const onAbort = () => {
      reject(new DOMException("Request was aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Combines two AbortSignals: if either aborts, the combined signal aborts.
 */
function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
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

export function getErrorMessage(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "Request timed out or was cancelled. Please check your network connection and try again.";
  }

  const apiError = err as { status?: number; message?: string } | null;

  if (apiError?.status === 503) {
    return "The service is temporarily unavailable. Please try again in a moment.";
  }
  if (apiError?.status === 429) {
    return "API quota exceeded. Please check your API key and billing, or try a different model.";
  }
  if (apiError?.status === 401) {
    return "Authentication failed. Check that your API key is correct.";
  }
  if (apiError?.status === 403) {
    return "Access denied. Your API key may not have permission to access this resource.";
  }
  if (apiError?.status === 404) {
    return "API endpoint not found. Check the base URL in Settings.";
  }

  // Handle OpenCode-specific connection errors (from openCodeFetch)
  if (apiError?.message?.includes("Cannot connect to")) {
    console.warn("OpenCode connection error details:\n", apiError.message);
    const urlMatch = apiError.message.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : "the API endpoint";
    if (apiError.message.includes("CORS")) {
      return `Cannot reach ${url}. The server blocks browser requests (CORS). Check Settings for solutions.`;
    }
    if (apiError.message.includes("could not be reached")) {
      const hostMatch = apiError.message.match(/server at ([^\s]+) could not be reached/);
      const host = hostMatch ? hostMatch[1] : url;
      return `Cannot reach ${host}. The server may not exist or the URL is wrong for your provider. Check the Base URL in Settings.`;
    }
    return `Cannot reach ${url}. Check the Base URL in Settings and your network connection.`;
  }

  return apiError?.message || "An unexpected error occurred.";
}
