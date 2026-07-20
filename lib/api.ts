import { Type } from "@google/genai";
import type { EvaluationData, Provider } from "@/lib/types";
import { getApiKey, createClient, generateWithRetry } from "@/lib/gemini";
import { getOpenCodeConfig, openCodeGenerateWithRetry, openCodeEvaluate } from "@/lib/opencode";
import { getAnthropicKey, getAnthropicModel, generateWithAnthropic, evaluateWithAnthropic } from "@/lib/anthropic";
import { getCodexKey, getCodexModel, generateWithCodex, evaluateWithCodex } from "@/lib/codex";
import { sanitizeDescription, sanitizeRefine, sanitizeEvaluation } from "@/lib/sanitize";

export interface ApiConfig {
  provider: Provider;
  geminiKey?: string;
  geminiModel?: string;
  opencodeConfig?: {
    apiKey: string;
    model: string;
    baseUrl: string;
  } | null;
  anthropicConfig?: {
    apiKey: string;
    model: string;
  } | null;
  codexConfig?: {
    apiKey: string;
    model: string;
  } | null;
}

// ---------------------------------------------------------------------------
// Config resolvers — each provider has its own storage shape
// ---------------------------------------------------------------------------

function resolveGeminiKey(geminiKey?: string): string | undefined {
  return geminiKey || getApiKey();
}

function resolveAnthropicConfig(
  anthropicConfig?: ApiConfig["anthropicConfig"],
): ApiConfig["anthropicConfig"] {
  const key = anthropicConfig?.apiKey || getAnthropicKey();
  if (!key) return null;
  return {
    apiKey: key,
    model: anthropicConfig?.model || getAnthropicModel(),
  };
}

function resolveCodexConfig(
  codexConfig?: ApiConfig["codexConfig"],
): ApiConfig["codexConfig"] {
  const key = codexConfig?.apiKey || getCodexKey();
  if (!key) return null;
  return {
    apiKey: key,
    model: codexConfig?.model || getCodexModel(),
  };
}

function resolveOpenCodeConfig(
  opencodeConfig?: ApiConfig["opencodeConfig"],
): ApiConfig["opencodeConfig"] {
  return opencodeConfig || getOpenCodeConfig();
}

/** Throw if config is nullish. Returns the narrowed config. */
function requireConfig<T>(config: T | null | undefined, providerName: string): T {
  if (config == null) throw new Error(`${providerName} API key is missing. Click Settings to add your API key.`);
  return config;
}

// ---------------------------------------------------------------------------
// Shared system prompts — used across multiple functions
// ---------------------------------------------------------------------------

const GENERATOR_SYSTEM_PROMPT = `You are PromptForge, an expert prompt crafter for freelancers.
Your job is to transform short natural language descriptions into precise, highly optimized prompts.

Rules:
- Return ONLY the optimized prompt — no preamble, no explanation, no markdown wrapping
- Tailor the prompt to the selected category and model capabilities
- Use clear structure: role, context, task, constraints, output format when appropriate
- For client work prompts: specify deliverables, format, and professional tone
- For creative prompts: set tone, style, constraints
- For analysis prompts: define scope, output format, depth
- Keep prompts sharp and actionable — no fluff
- If the input is already detailed, enhance and restructure it; if vague, expand it intelligently`;

const REFINER_SYSTEM_PROMPT =
  "You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting. Do not include explanations.";

const ENHANCER_SYSTEM_PROMPT =
  "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.";

const AUTOFIX_SYSTEM_PROMPT =
  "You are an expert prompt crafter. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.";

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("Failed to parse evaluation results.");
  }
}

// ---------------------------------------------------------------------------
// Provider-specific text generation (wraps each SDK's API)
// ---------------------------------------------------------------------------

async function geminiGenerate(
  apiKey: string,
  model: string,
  systemInstruction: string,
  contents: string,
  temperature: number,
  signal?: AbortSignal,
): Promise<string> {
  const ai = createClient(apiKey);
  const text = await generateWithRetry(ai, {
    model,
    contents,
    config: { systemInstruction, temperature },
  }, 3, signal);
  if (!text) throw new Error("No response generated from the model.");
  return text;
}

async function anthropicGenerate(
  cfg: NonNullable<ApiConfig["anthropicConfig"]>,
  systemInstruction: string,
  content: string,
  temperature: number,
  signal?: AbortSignal,
): Promise<string> {
  return generateWithAnthropic(
    cfg.apiKey,
    systemInstruction,
    [{ role: "user", content }],
    { model: cfg.model, temperature },
    signal,
  );
}

async function codexGenerate(
  cfg: NonNullable<ApiConfig["codexConfig"]>,
  systemInstruction: string,
  content: string,
  temperature: number,
  signal?: AbortSignal,
): Promise<string> {
  return generateWithCodex(
    cfg.apiKey,
    systemInstruction,
    [{ role: "user", content }],
    { model: cfg.model, temperature },
    signal,
  );
}

async function opencodeGenerate(
  cfg: NonNullable<ApiConfig["opencodeConfig"]>,
  systemInstruction: string,
  content: string,
  temperature: number,
  maxTokens?: number,
): Promise<string> {
  const text = await openCodeGenerateWithRetry(
    cfg,
    [{ role: "user", content }],
    { systemInstruction, temperature, ...(maxTokens ? { maxTokens } : {}) },
  );
  if (!text) throw new Error("No response generated from the model.");
  return text;
}

// ---------------------------------------------------------------------------
// Unified dispatch — routes to the right provider
// ---------------------------------------------------------------------------

async function dispatchGenerate(
  config: ApiConfig,
  systemInstruction: string,
  content: string,
  temperature: number,
  signal?: AbortSignal,
  maxTokens?: number,
): Promise<string> {
  const { provider } = config;

  if (provider === "anthropic") {
    const cfg = requireConfig(resolveAnthropicConfig(config.anthropicConfig), "Anthropic");
    return anthropicGenerate(cfg, systemInstruction, content, temperature, signal);
  }

  if (provider === "codex") {
    const cfg = requireConfig(resolveCodexConfig(config.codexConfig), "Codex");
    return codexGenerate(cfg, systemInstruction, content, temperature, signal);
  }

  if (provider === "opencode") {
    const cfg = requireConfig(resolveOpenCodeConfig(config.opencodeConfig), "OpenCode");
    return opencodeGenerate(cfg, systemInstruction, content, temperature, maxTokens);
  }

  // Default: Gemini
  const apiKey = requireConfig(resolveGeminiKey(config.geminiKey), "Gemini");
  const model = config.geminiModel || "gemini-3.1-pro-preview";
  return geminiGenerate(apiKey, model, systemInstruction, content, temperature, signal);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generatePrompt(
  description: string,
  category: string,
  config: ApiConfig,
  signal?: AbortSignal,
): Promise<string> {
  const safeDescription = sanitizeDescription(description).text;
  return dispatchGenerate(
    config,
    GENERATOR_SYSTEM_PROMPT,
    `Category: ${category}\nDescription: ${safeDescription}`,
    0.7,
    signal,
  );
}

export async function refinePrompt(
  originalPrompt: string,
  instruction: string,
  config: ApiConfig,
  signal?: AbortSignal,
): Promise<string> {
  const safeInstruction = sanitizeRefine(instruction).text;
  const content = `Original Prompt:\n${originalPrompt}\n\nInstruction:\n${safeInstruction}`;
  return dispatchGenerate(config, REFINER_SYSTEM_PROMPT, content, 0.4, signal);
}

export async function smartEnhance(
  description: string,
  config: ApiConfig,
  signal?: AbortSignal,
): Promise<string> {
  const safeDescription = sanitizeDescription(description).text;
  const content = `Enhance this short prompt description to be more detailed and clear for a freelancer. Keep it under 200 characters. Original: "${safeDescription}"`;
  // Gemini uses a smaller model for enhancement
  if (config.provider === "gemini" || !config.provider) {
    const apiKey = requireConfig(resolveGeminiKey(config.geminiKey), "Gemini");
    return geminiGenerate(apiKey, "gemini-3.1-pro-preview", ENHANCER_SYSTEM_PROMPT, content, 0.7, signal);
  }
  return dispatchGenerate(config, ENHANCER_SYSTEM_PROMPT, content, 0.7, signal, 200);
}

export async function evaluatePrompt(
  prompt: string,
  config: ApiConfig,
  signal?: AbortSignal,
): Promise<EvaluationData> {
  const safePrompt = sanitizeEvaluation(prompt).text;
  const { provider } = config;

  if (provider === "anthropic") {
    const cfg = requireConfig(resolveAnthropicConfig(config.anthropicConfig), "Anthropic");
    const raw = await evaluateWithAnthropic(
      safePrompt,
      "You are a Prompt Quality Evaluator. Analyze the provided prompt based on three key criteria: Clarity, Specificity, and Misinterpretation Risk. Return ONLY valid JSON with no markdown wrapping, no code fences, no preamble.",
      "Provide a JSON object with these fields: rating (number 1-10), criteria (object with clarity, specificity, misinterpretationRisk, each 1-10), strengths (string array), weaknesses (string array), suggestions (string array). Return ONLY the JSON object.",
      cfg.apiKey,
      cfg.model,
      signal,
    );
    if (!raw) throw new Error("Could not evaluate the prompt.");
    return parseJsonResponse<EvaluationData>(raw);
  }

  if (provider === "codex") {
    const cfg = requireConfig(resolveCodexConfig(config.codexConfig), "Codex");
    const raw = await evaluateWithCodex(
      safePrompt,
      "You are a Prompt Quality Evaluator. Analyze the provided prompt based on three key criteria: Clarity, Specificity, and Misinterpretation Risk. Return ONLY valid JSON with no markdown wrapping, no code fences, no preamble.",
      "Provide a JSON object with these fields: rating (number 1-10), criteria (object with clarity, specificity, misinterpretationRisk, each 1-10), strengths (string array), weaknesses (string array), suggestions (string array). Return ONLY the JSON object.",
      cfg.apiKey,
      cfg.model,
      signal,
    );
    if (!raw) throw new Error("Could not evaluate the prompt.");
    return parseJsonResponse<EvaluationData>(raw);
  }

  if (provider === "opencode") {
    const cfg = requireConfig(resolveOpenCodeConfig(config.opencodeConfig), "OpenCode");
    const raw = await openCodeEvaluate(cfg, safePrompt);
    if (!raw) throw new Error("Could not evaluate the prompt.");
    return parseJsonResponse<EvaluationData>(raw);
  }

  // Gemini — uses structured output via responseSchema
  const apiKey = requireConfig(resolveGeminiKey(config.geminiKey), "Gemini");
  const ai = createClient(apiKey);
  const response = await ai.models.generateContent({
    model: config.geminiModel || "gemini-3.1-pro-preview",
    contents: `Evaluate this prompt for a Gemini model:\n\n${safePrompt}`,
    config: {
      systemInstruction: `You are a Prompt Quality Evaluator specializing in Google Gemini models.
Your job is to analyze the provided prompt based on three key criteria:
1. Clarity: How easy is it for the model to understand the core intent?
2. Specificity: Does the prompt provide enough detail, context, and constraints?
3. Misinterpretation Risk: Are there ambiguous terms or conflicting instructions that could lead to unexpected results?

Provide a score from 1-10 for each criterion and an overall rating. Give constructive, actionable feedback.`,
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.NUMBER, description: "Overall rating out of 10" },
          criteria: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.NUMBER, description: "Clarity score 1-10" },
              specificity: { type: Type.NUMBER, description: "Specificity score 1-10" },
              misinterpretationRisk: {
                type: Type.NUMBER,
                description: "Risk of misinterpretation 1-10",
              },
            },
            required: ["clarity", "specificity", "misinterpretationRisk"],
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["rating", "criteria", "strengths", "weaknesses", "suggestions"],
      },
    },
  });

  if (!response.text) throw new Error("Could not evaluate the prompt.");
  return parseJsonResponse<EvaluationData>(response.text);
}

export async function autoFixPrompt(
  prompt: string,
  evaluation: EvaluationData,
  config: ApiConfig,
  signal?: AbortSignal,
): Promise<string> {
  const weaknesses = evaluation.weaknesses.join("\n");
  const suggestions = evaluation.suggestions.join("\n");
  const content = `Original Prompt:\n${prompt}\n\nEvaluation Weaknesses:\n${weaknesses}\n\nEvaluation Suggestions:\n${suggestions}`;
  return dispatchGenerate(config, AUTOFIX_SYSTEM_PROMPT, content, 0.4, signal);
}
