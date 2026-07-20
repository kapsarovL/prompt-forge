import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ApiConfig } from "@/lib/api";

// Mock all provider modules before importing api.ts
vi.mock("@/lib/gemini", () => ({
  getApiKey: vi.fn(() => undefined),
  createClient: vi.fn(() => ({})),
  generateWithRetry: vi.fn(),
}));

vi.mock("@/lib/opencode", () => ({
  getOpenCodeConfig: vi.fn(() => null),
  openCodeGenerateWithRetry: vi.fn(),
  openCodeEvaluate: vi.fn(),
}));

vi.mock("@/lib/anthropic", () => ({
  getAnthropicKey: vi.fn(() => null),
  getAnthropicModel: vi.fn(() => "claude-sonnet-4-20250514"),
  generateWithAnthropic: vi.fn(),
  evaluateWithAnthropic: vi.fn(),
}));

vi.mock("@/lib/codex", () => ({
  getCodexKey: vi.fn(() => null),
  getCodexModel: vi.fn(() => "gpt-4o"),
  generateWithCodex: vi.fn(),
  evaluateWithCodex: vi.fn(),
}));

vi.mock("@/lib/sanitize", () => ({
  sanitizeDescription: vi.fn((text: string) => ({ text, flagged: false })),
  sanitizeRefine: vi.fn((text: string) => ({ text, flagged: false })),
  sanitizeEvaluation: vi.fn((text: string) => ({ text, flagged: false })),
}));

// Import after mocks are set up
import { generatePrompt, refinePrompt, smartEnhance, evaluatePrompt, autoFixPrompt } from "@/lib/api";
import { generateWithRetry, createClient, getApiKey } from "@/lib/gemini";
import { openCodeGenerateWithRetry, openCodeEvaluate } from "@/lib/opencode";
import { generateWithAnthropic, evaluateWithAnthropic } from "@/lib/anthropic";
import { generateWithCodex, evaluateWithCodex } from "@/lib/codex";
import { sanitizeDescription, sanitizeRefine, sanitizeEvaluation } from "@/lib/sanitize";

const geminiConfig: ApiConfig = { provider: "gemini", geminiKey: "g-key", geminiModel: "gemini-3.1-pro-preview" };
const anthropicConfig: ApiConfig = { provider: "anthropic", anthropicConfig: { apiKey: "a-key", model: "claude-sonnet-4-20250514" } };
const codexConfig: ApiConfig = { provider: "codex", codexConfig: { apiKey: "c-key", model: "gpt-4o" } };
const opencodeConfig: ApiConfig = { provider: "opencode", opencodeConfig: { apiKey: "oc-key", model: "opencode/big-pickle", baseUrl: "https://oc.example.com" } };

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// generatePrompt
// ---------------------------------------------------------------------------
describe("generatePrompt", () => {
  it("calls Gemini provider with correct args", async () => {
    vi.mocked(generateWithRetry).mockResolvedValue("gemini result");

    const result = await generatePrompt("build a hook", "coding", geminiConfig);

    expect(result).toBe("gemini result");
    expect(generateWithRetry).toHaveBeenCalledOnce();
    expect(sanitizeDescription).toHaveBeenCalledWith("build a hook");
  });

  it("calls Anthropic provider with correct args", async () => {
    vi.mocked(generateWithAnthropic).mockResolvedValue("anthropic result");

    const result = await generatePrompt("write a story", "creative", anthropicConfig);

    expect(result).toBe("anthropic result");
    expect(generateWithAnthropic).toHaveBeenCalledOnce();
    const call = vi.mocked(generateWithAnthropic).mock.calls[0];
    expect(call[0]).toBe("a-key");
    expect(call[2][0].content).toContain("write a story");
  });

  it("calls Codex provider with correct args", async () => {
    vi.mocked(generateWithCodex).mockResolvedValue("codex result");

    const result = await generatePrompt("analyze data", "analysis", codexConfig);

    expect(result).toBe("codex result");
    expect(generateWithCodex).toHaveBeenCalledOnce();
  });

  it("calls OpenCode provider with correct args", async () => {
    vi.mocked(openCodeGenerateWithRetry).mockResolvedValue("opencode result");

    const result = await generatePrompt("draft email", "general", opencodeConfig);

    expect(result).toBe("opencode result");
    expect(openCodeGenerateWithRetry).toHaveBeenCalledOnce();
  });

  it("throws when Gemini key is missing", async () => {
    vi.mocked(getApiKey).mockReturnValue(undefined);
    const noKeyConfig: ApiConfig = { provider: "gemini" };

    await expect(generatePrompt("test", "coding", noKeyConfig)).rejects.toThrow("Gemini API key is missing");
  });

  it("throws when Anthropic key is missing", async () => {
    const noKeyConfig: ApiConfig = { provider: "anthropic", anthropicConfig: null };

    await expect(generatePrompt("test", "coding", noKeyConfig)).rejects.toThrow("Anthropic API key is missing");
  });

  it("throws when Codex key is missing", async () => {
    const noKeyConfig: ApiConfig = { provider: "codex", codexConfig: null };

    await expect(generatePrompt("test", "coding", noKeyConfig)).rejects.toThrow("Codex API key is missing");
  });

  it("throws when OpenCode key is missing", async () => {
    const noKeyConfig: ApiConfig = { provider: "opencode", opencodeConfig: null };

    await expect(generatePrompt("test", "coding", noKeyConfig)).rejects.toThrow("OpenCode API key is missing");
  });

  it("passes AbortSignal through to Gemini", async () => {
    vi.mocked(generateWithRetry).mockResolvedValue("ok");
    const controller = new AbortController();

    await generatePrompt("test", "coding", geminiConfig, controller.signal);

    const calls = vi.mocked(generateWithRetry).mock.calls[0];
    expect(calls[3]).toBe(controller.signal);
  });
});

// ---------------------------------------------------------------------------
// refinePrompt
// ---------------------------------------------------------------------------
describe("refinePrompt", () => {
  it("calls Gemini refine with combined content", async () => {
    vi.mocked(generateWithRetry).mockResolvedValue("refined prompt");

    const result = await refinePrompt("original prompt", "make it shorter", geminiConfig);

    expect(result).toBe("refined prompt");
    expect(sanitizeRefine).toHaveBeenCalledWith("make it shorter");
  });

  it("calls Anthropic refine", async () => {
    vi.mocked(generateWithAnthropic).mockResolvedValue("refined by claude");

    const result = await refinePrompt("original", "expand it", anthropicConfig);

    expect(result).toBe("refined by claude");
    expect(generateWithAnthropic).toHaveBeenCalledOnce();
  });

  it("calls Codex refine", async () => {
    vi.mocked(generateWithCodex).mockResolvedValue("refined by gpt");

    const result = await refinePrompt("original", "add examples", codexConfig);

    expect(result).toBe("refined by gpt");
  });

  it("calls OpenCode refine", async () => {
    vi.mocked(openCodeGenerateWithRetry).mockResolvedValue("refined by oc");

    const result = await refinePrompt("original", "simplify", opencodeConfig);

    expect(result).toBe("refined by oc");
  });

  it("throws when Anthropic key is missing", async () => {
    const noKeyConfig: ApiConfig = { provider: "anthropic", anthropicConfig: null };

    await expect(refinePrompt("p", "i", noKeyConfig)).rejects.toThrow("Anthropic API key is missing");
  });
});

// ---------------------------------------------------------------------------
// smartEnhance
// ---------------------------------------------------------------------------
describe("smartEnhance", () => {
  it("calls Gemini enhance with enhancement prompt", async () => {
    vi.mocked(generateWithRetry).mockResolvedValue("enhanced description");

    const result = await smartEnhance("vague idea", geminiConfig);

    expect(result).toBe("enhanced description");
    expect(sanitizeDescription).toHaveBeenCalledWith("vague idea");
  });

  it("calls Anthropic enhance", async () => {
    vi.mocked(generateWithAnthropic).mockResolvedValue("enhanced by claude");

    const result = await smartEnhance("short", anthropicConfig);

    expect(result).toBe("enhanced by claude");
  });

  it("calls Codex enhance", async () => {
    vi.mocked(generateWithCodex).mockResolvedValue("enhanced by gpt");

    const result = await smartEnhance("brief", codexConfig);

    expect(result).toBe("enhanced by gpt");
  });

  it("calls OpenCode enhance", async () => {
    vi.mocked(openCodeGenerateWithRetry).mockResolvedValue("enhanced by oc");

    const result = await smartEnhance("tiny", opencodeConfig);

    expect(result).toBe("enhanced by oc");
  });

  it("throws when Gemini key is missing", async () => {
    vi.mocked(getApiKey).mockReturnValue(undefined);
    const noKeyConfig: ApiConfig = { provider: "gemini" };

    await expect(smartEnhance("test", noKeyConfig)).rejects.toThrow("Gemini API key is missing");
  });
});

// ---------------------------------------------------------------------------
// evaluatePrompt
// ---------------------------------------------------------------------------
describe("evaluatePrompt", () => {
  const evaluationJson = JSON.stringify({
    rating: 8,
    criteria: { clarity: 9, specificity: 7, misinterpretationRisk: 8 },
    strengths: ["clear intent"],
    weaknesses: ["could be more specific"],
    suggestions: ["add examples"],
  });

  it("calls Gemini evaluate with structured output", async () => {
    vi.mocked(createClient).mockReturnValue({ models: { generateContent: vi.fn().mockResolvedValue({ text: evaluationJson }) } } as never);
    vi.mocked(getApiKey).mockReturnValue("g-key");

    const result = await evaluatePrompt("test prompt", geminiConfig);

    expect(result.rating).toBe(8);
    expect(result.criteria.clarity).toBe(9);
    expect(sanitizeEvaluation).toHaveBeenCalledWith("test prompt");
  });

  it("calls Anthropic evaluate and parses JSON", async () => {
    vi.mocked(evaluateWithAnthropic).mockResolvedValue(evaluationJson);

    const result = await evaluatePrompt("test prompt", anthropicConfig);

    expect(result.rating).toBe(8);
    expect(result.strengths).toEqual(["clear intent"]);
  });

  it("calls Codex evaluate and parses JSON", async () => {
    vi.mocked(evaluateWithCodex).mockResolvedValue(evaluationJson);

    const result = await evaluatePrompt("test prompt", codexConfig);

    expect(result.rating).toBe(8);
  });

  it("calls OpenCode evaluate and parses JSON", async () => {
    vi.mocked(openCodeEvaluate).mockResolvedValue(evaluationJson);

    const result = await evaluatePrompt("test prompt", opencodeConfig);

    expect(result.rating).toBe(8);
  });

  it("strips markdown fences from evaluation response", async () => {
    const fenced = "```json\n" + evaluationJson + "\n```";
    vi.mocked(evaluateWithAnthropic).mockResolvedValue(fenced);

    const result = await evaluatePrompt("test", anthropicConfig);

    expect(result.rating).toBe(8);
  });

  it("throws on unparseable evaluation response", async () => {
    vi.mocked(evaluateWithAnthropic).mockResolvedValue("not json at all");

    await expect(evaluatePrompt("test", anthropicConfig)).rejects.toThrow("Failed to parse evaluation results");
  });

  it("throws when Gemini key is missing", async () => {
    vi.mocked(getApiKey).mockReturnValue(undefined);
    const noKeyConfig: ApiConfig = { provider: "gemini" };

    await expect(evaluatePrompt("test", noKeyConfig)).rejects.toThrow("Gemini API key is missing");
  });
});

// ---------------------------------------------------------------------------
// autoFixPrompt
// ---------------------------------------------------------------------------
describe("autoFixPrompt", () => {
  const mockEvaluation = {
    rating: 5,
    criteria: { clarity: 4, specificity: 6, misinterpretationRisk: 5 },
    strengths: ["good structure"],
    weaknesses: ["unclear constraints", "missing examples"],
    suggestions: ["add concrete examples", "specify output format"],
  };

  it("calls Gemini autoFix with weaknesses and suggestions", async () => {
    vi.mocked(generateWithRetry).mockResolvedValue("auto-fixed prompt");

    const result = await autoFixPrompt("bad prompt", mockEvaluation, geminiConfig);

    expect(result).toBe("auto-fixed prompt");
    expect(generateWithRetry).toHaveBeenCalledOnce();
  });

  it("calls Anthropic autoFix", async () => {
    vi.mocked(generateWithAnthropic).mockResolvedValue("fixed by claude");

    const result = await autoFixPrompt("bad", mockEvaluation, anthropicConfig);

    expect(result).toBe("fixed by claude");
  });

  it("calls Codex autoFix", async () => {
    vi.mocked(generateWithCodex).mockResolvedValue("fixed by gpt");

    const result = await autoFixPrompt("bad", mockEvaluation, codexConfig);

    expect(result).toBe("fixed by gpt");
  });

  it("calls OpenCode autoFix", async () => {
    vi.mocked(openCodeGenerateWithRetry).mockResolvedValue("fixed by oc");

    const result = await autoFixPrompt("bad", mockEvaluation, opencodeConfig);

    expect(result).toBe("fixed by oc");
  });
});
