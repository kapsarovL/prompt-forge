import { Type } from "@google/genai";
import type { EvaluationData, Provider } from "@/lib/types";
import { getApiKey, createClient, generateWithRetry } from "@/lib/gemini";
import { getOpenCodeConfig, openCodeGenerateWithRetry, openCodeEvaluate } from "@/lib/opencode";
import { getAnthropicKey, getAnthropicModel, generateWithAnthropic, evaluateWithAnthropic } from "@/lib/anthropic";
import { getCodexKey, getCodexModel, generateWithCodex, evaluateWithCodex } from "@/lib/codex";

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

const SYSTEM_PROMPT = `You are PromptForge, an expert prompt engineer.
Your job is to transform short natural language descriptions into precise, highly optimized prompts.

Rules:
- Return ONLY the optimized prompt — no preamble, no explanation, no markdown wrapping
- Tailor the prompt to the selected category and model capabilities
- Use clear structure: role, context, task, constraints, output format when appropriate
- For code prompts: specify language, expected output, edge cases
- For creative prompts: set tone, style, constraints
- For analysis prompts: define scope, output format, depth
- Keep prompts sharp and actionable — no fluff
- If the input is already detailed, enhance and restructure it; if vague, expand it intelligently`;

export async function generatePrompt(
  description: string,
  category: string,
  config: ApiConfig,
): Promise<string> {
  if (config.provider === "anthropic") {
    const cfg = resolveAnthropicConfig(config.anthropicConfig);
    if (!cfg) {
      throw new Error("Anthropic API key is missing. Click Settings to add your API key.");
    }
    const text = await generateWithAnthropic(
      cfg.apiKey,
      SYSTEM_PROMPT,
      [{ role: "user", content: `Category: ${category}\nDescription: ${description}` }],
      { model: cfg.model, temperature: 0.7 },
    );
    return text;
  }

  if (config.provider === "codex") {
    const cfg = resolveCodexConfig(config.codexConfig);
    if (!cfg) throw new Error("OpenAI API key is missing. Click Settings to add your API key.");
    const text = await generateWithCodex(
      cfg.apiKey,
      SYSTEM_PROMPT,
      [{ role: "user", content: `Category: ${category}\nDescription: ${description}` }],
      { model: cfg.model, temperature: 0.7 },
    );
    return text;
  }

  if (config.provider === "opencode") {
    const cfg = resolveOpenCodeConfig(config.opencodeConfig);
    if (!cfg) {
      throw new Error("OpenCode API key is missing. Click Settings to add your API key.");
    }
    const text = await openCodeGenerateWithRetry(cfg, [
      { role: "user", content: `Category: ${category}\nDescription: ${description}` },
    ], { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 });
    if (!text) throw new Error("No response generated from the model.");
    return text;
  }

  const apiKey = resolveGeminiKey(config.geminiKey);
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Click Settings to add your own API key.");
  }
  const ai = createClient(apiKey);
  const text = await generateWithRetry(ai, {
    model: config.geminiModel || "gemini-2.5-flash",
    contents: `Category: ${category}\nDescription: ${description}`,
    config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 },
  });
  if (!text) throw new Error("No response generated from the model.");
  return text;
}

export async function refinePrompt(
  originalPrompt: string,
  instruction: string,
  config: ApiConfig,
): Promise<string> {
  const content = `Original Prompt:\n${originalPrompt}\n\nInstruction:\n${instruction}`;

  if (config.provider === "anthropic") {
    const cfg = resolveAnthropicConfig(config.anthropicConfig);
    if (!cfg) throw new Error("Anthropic API key is missing.");

    const text = await generateWithAnthropic(
      cfg.apiKey,
      "You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting. Do not include explanations.",
      [{ role: "user", content }],
      { model: cfg.model, temperature: 0.4 },
    );
    return text;
  }

  if (config.provider === "codex") {
    const cfg = resolveCodexConfig(config.codexConfig);
    if (!cfg) throw new Error("OpenAI API key is missing.");

    const text = await generateWithCodex(
      cfg.apiKey,
      "You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting. Do not include explanations.",
      [{ role: "user", content }],
      { model: cfg.model, temperature: 0.4 },
    );
    return text;
  }

  if (config.provider === "opencode") {
    const cfg = resolveOpenCodeConfig(config.opencodeConfig);
    if (!cfg) throw new Error("OpenCode API key is missing.");

    const text = await openCodeGenerateWithRetry(cfg, [{ role: "user", content }], {
      systemInstruction:
        "You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting. Do not include explanations.",
      temperature: 0.4,
    });
    if (!text) throw new Error("No response from refinement.");
    return text;
  }

  const apiKey = resolveGeminiKey(config.geminiKey);
  if (!apiKey) throw new Error("Gemini API key is missing.");

  const ai = createClient(apiKey);
  const text = await generateWithRetry(ai, {
    model: config.geminiModel || "gemini-2.5-flash",
    contents: content,
    config: {
      systemInstruction:
        "You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting like ```markdown unless it is part of the prompt itself. Do not include explanations.",
      temperature: 0.4,
    },
  });
  if (!text) throw new Error("No response from refinement.");
  return text;
}

export async function smartEnhance(
  description: string,
  config: ApiConfig,
): Promise<string> {
  if (config.provider === "anthropic") {
    const cfg = resolveAnthropicConfig(config.anthropicConfig);
    if (!cfg) throw new Error("Anthropic API key missing");

    const text = await generateWithAnthropic(
      cfg.apiKey,
      "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.",
      [{ role: "user", content: `Enhance this short prompt description to be more detailed and clear for a prompt engineer. Keep it under 200 characters. Original: "${description}"` }],
      { model: cfg.model, temperature: 0.7, maxTokens: 200 },
    );
    return text;
  }

  if (config.provider === "codex") {
    const cfg = resolveCodexConfig(config.codexConfig);
    if (!cfg) throw new Error("OpenAI API key missing");

    const text = await generateWithCodex(
      cfg.apiKey,
      "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.",
      [{ role: "user", content: `Enhance this short prompt description to be more detailed and clear for a prompt engineer. Keep it under 200 characters. Original: "${description}"` }],
      { model: cfg.model, temperature: 0.7, maxTokens: 200 },
    );
    return text;
  }

  if (config.provider === "opencode") {
    const cfg = resolveOpenCodeConfig(config.opencodeConfig);
    if (!cfg) throw new Error("OpenCode API key missing");

    const text = await openCodeGenerateWithRetry(
      cfg,
      [
        {
          role: "user",
          content: `Enhance this short prompt description to be more detailed and clear for a prompt engineer. Keep it under 200 characters. Original: "${description}"`,
        },
      ],
      {
        systemInstruction:
          "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.",
        temperature: 0.7,
        maxTokens: 200,
      },
    );
    if (!text) throw new Error("Enhancement failed.");
    return text;
  }

  const apiKey = resolveGeminiKey(config.geminiKey);
  if (!apiKey) throw new Error("API key missing");

  const ai = createClient(apiKey);
  const text = await generateWithRetry(ai, {
    model: "gemini-2.5-flash-lite",
    contents: `Enhance this short prompt description to be more detailed and clear for a prompt engineer. Keep it under 200 characters. Original: "${description}"`,
    config: {
      systemInstruction:
        "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.",
      temperature: 0.7,
    },
  });
  if (!text) throw new Error("Enhancement failed.");
  return text;
}

export async function evaluatePrompt(
  prompt: string,
  config: ApiConfig,
): Promise<EvaluationData> {
  if (config.provider === "anthropic") {
    const cfg = resolveAnthropicConfig(config.anthropicConfig);
    if (!cfg) throw new Error("Anthropic API key is missing.");

    const raw = await evaluateWithAnthropic(
      prompt,
      "You are a Prompt Quality Evaluator. Analyze the provided prompt based on three key criteria: Clarity, Specificity, and Misinterpretation Risk. Return ONLY valid JSON with no markdown wrapping, no code fences, no preamble.",
      "Provide a JSON object with these fields: rating (number 1-10), criteria (object with clarity, specificity, misinterpretationRisk, each 1-10), strengths (string array), weaknesses (string array), suggestions (string array). Return ONLY the JSON object.",
      cfg.apiKey,
      cfg.model,
    );
    if (!raw) throw new Error("Could not evaluate the prompt.");
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    try {
      return JSON.parse(cleaned) as EvaluationData;
    } catch {
      throw new Error("Failed to parse evaluation results.");
    }
  }

  if (config.provider === "codex") {
    const cfg = resolveCodexConfig(config.codexConfig);
    if (!cfg) throw new Error("OpenAI API key is missing.");

    const raw = await evaluateWithCodex(
      prompt,
      "You are a Prompt Quality Evaluator. Analyze the provided prompt based on three key criteria: Clarity, Specificity, and Misinterpretation Risk. Return ONLY valid JSON with no markdown wrapping, no code fences, no preamble.",
      "Provide a JSON object with these fields: rating (number 1-10), criteria (object with clarity, specificity, misinterpretationRisk, each 1-10), strengths (string array), weaknesses (string array), suggestions (string array). Return ONLY the JSON object.",
      cfg.apiKey,
      cfg.model,
    );
    if (!raw) throw new Error("Could not evaluate the prompt.");
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    try {
      return JSON.parse(cleaned) as EvaluationData;
    } catch {
      throw new Error("Failed to parse evaluation results.");
    }
  }

  if (config.provider === "opencode") {
    const cfg = resolveOpenCodeConfig(config.opencodeConfig);
    if (!cfg) throw new Error("OpenCode API key is missing.");

    const raw = await openCodeEvaluate(cfg, prompt);
    if (!raw) throw new Error("Could not evaluate the prompt.");
    try {
      return JSON.parse(raw) as EvaluationData;
    } catch {
      throw new Error("Failed to parse evaluation results.");
    }
  }

  const apiKey = resolveGeminiKey(config.geminiKey);
  if (!apiKey) throw new Error("Gemini API key is missing.");

  const ai = createClient(apiKey);
  const response = await ai.models.generateContent({
    model: config.geminiModel || "gemini-2.5-flash",
    contents: `Evaluate this prompt for a Gemini model:\n\n${prompt}`,
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
  try {
    return JSON.parse(response.text.trim()) as EvaluationData;
  } catch {
    throw new Error("Failed to parse evaluation results.");
  }
}

export async function autoFixPrompt(
  prompt: string,
  evaluation: EvaluationData,
  config: ApiConfig,
): Promise<string> {
  const weaknesses = evaluation.weaknesses.join("\n");
  const suggestions = evaluation.suggestions.join("\n");
  const content = `Original Prompt:\n${prompt}\n\nEvaluation Weaknesses:\n${weaknesses}\n\nEvaluation Suggestions:\n${suggestions}`;

  if (config.provider === "anthropic") {
    const cfg = resolveAnthropicConfig(config.anthropicConfig);
    if (!cfg) throw new Error("Anthropic API key missing");

    const text = await generateWithAnthropic(
      cfg.apiKey,
      "You are an expert prompt engineer. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.",
      [{ role: "user", content }],
      { model: cfg.model, temperature: 0.4 },
    );
    return text;
  }

  if (config.provider === "codex") {
    const cfg = resolveCodexConfig(config.codexConfig);
    if (!cfg) throw new Error("OpenAI API key missing");

    const text = await generateWithCodex(
      cfg.apiKey,
      "You are an expert prompt engineer. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.",
      [{ role: "user", content }],
      { model: cfg.model, temperature: 0.4 },
    );
    return text;
  }

  if (config.provider === "opencode") {
    const cfg = resolveOpenCodeConfig(config.opencodeConfig);
    if (!cfg) throw new Error("OpenCode API key missing");

    const text = await openCodeGenerateWithRetry(cfg, [{ role: "user", content }], {
      systemInstruction:
        "You are an expert prompt engineer. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.",
      temperature: 0.4,
    });
    if (!text) throw new Error("Auto-fix failed.");
    return text;
  }

  const apiKey = resolveGeminiKey(config.geminiKey);
  if (!apiKey) throw new Error("Gemini API key missing");

  const ai = createClient(apiKey);
  const text = await generateWithRetry(ai, {
    model: config.geminiModel || "gemini-2.5-flash",
    contents: content,
    config: {
      systemInstruction:
        "You are an expert prompt engineer. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.",
      temperature: 0.4,
    },
  });
  if (!text) throw new Error("Auto-fix failed.");
  return text;
}
