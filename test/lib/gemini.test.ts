import { describe, it, expect, beforeEach } from "vitest";
import { getApiKey, getErrorMessage } from "@/lib/gemini";

beforeEach(() => {
  localStorage.clear();
  delete (process.env as Record<string, string | undefined>)
    .NEXT_PUBLIC_GEMINI_API_KEY;
});

describe("getApiKey", () => {
  it("returns undefined when no key is set", () => {
    expect(getApiKey()).toBeUndefined();
  });

  it("returns the key from localStorage when set", () => {
    localStorage.setItem("promptforge_api_key", "test-key-123");
    expect(getApiKey()).toBe("test-key-123");
  });

  it("falls back to env var when localStorage is empty", () => {
    (process.env as Record<string, string | undefined>)
      .NEXT_PUBLIC_GEMINI_API_KEY = "env-key-456";
    expect(getApiKey()).toBe("env-key-456");
  });
});

describe("getErrorMessage", () => {
  it("returns friendly message for 503 status", () => {
    const err = { status: 503, message: "Service Unavailable" };
    expect(getErrorMessage(err)).toBe(
      "The service is temporarily unavailable. Please try again in a moment.",
    );
  });

  it("returns friendly message for 429 status", () => {
    const err = { status: 429, message: "Too Many Requests" };
    expect(getErrorMessage(err)).toBe(
      "API quota exceeded. Please check your API key and billing, or try a different model.",
    );
  });

  it("returns the error message for other errors", () => {
    const err = { message: "Something went wrong" };
    expect(getErrorMessage(err)).toBe("Something went wrong");
  });

  it("returns fallback for null/undefined", () => {
    expect(getErrorMessage(null)).toBe("An unexpected error occurred.");
    expect(getErrorMessage(undefined)).toBe("An unexpected error occurred.");
  });
});
