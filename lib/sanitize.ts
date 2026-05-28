/**
 * Input sanitization for prompt injection mitigation.
 *
 * Sanitization is applied to user-provided descriptions before they are
 * sent to AI APIs. This is a defense-in-depth measure — it reduces the
 * risk of prompt injection but does not eliminate it entirely.
 *
 * Sanitization rules:
 * 1. Strip control characters (except newlines/tabs)
 * 2. Detect and surface common prompt injection patterns
 * 3. Enforce maximum length limits
 * 4. Block obvious jailbreak / role-play override attempts
 */

/** Maximum length for user descriptions (characters). */
export const MAX_DESCRIPTION_LENGTH = 2000;

/** Maximum length for refine instructions (characters). */
export const MAX_REFINE_LENGTH = 500;

/** Maximum length for generated prompts sent to evaluation (characters). */
export const MAX_EVALUATION_LENGTH = 10_000;

/** Maximum length for feedback comments (characters). */
export const MAX_FEEDBACK_LENGTH = 1000;

/**
 * Patterns that indicate potential prompt injection attempts.
 * These are detected and flagged, but not stripped (stripping would
 * interfere with legitimate content like coding prompts).
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /forget\s+(all\s+)?(previous|above|prior)/i,
  /you\s+are\s+(now|not\s+required\s+to)/i,
  /override\s+(your\s+)?(instructions|prompt|system)/i,
  /new\s+instructions?:/i,
  /act\s+as\s+if/i,
  /do\s+not\s+follow/i,
  /your\s+new\s+(role|task|purpose)/i,
];

/**
 * Result of sanitizing a user input.
 */
export interface SanitizeResult {
  /** The sanitized text. */
  text: string;
  /** Whether any injection patterns were detected. */
  hasInjectionPattern: boolean;
  /** Which injection patterns matched (for logging/display). */
  matchedPatterns: string[];
  /** Whether the input was truncated. */
  wasTruncated: boolean;
  /** The original length before truncation. */
  originalLength: number;
}

/**
 * Sanitizes user-provided description text.
 * Strips control characters, enforces length limits, and checks for
 * common prompt injection patterns.
 */
export function sanitizeDescription(input: string): SanitizeResult {
  return sanitize(input, MAX_DESCRIPTION_LENGTH);
}

/**
 * Sanitizes user-provided refine instruction text.
 */
export function sanitizeRefine(input: string): SanitizeResult {
  return sanitize(input, MAX_REFINE_LENGTH);
}

/**
 * Sanitizes text sent to evaluation.
 */
export function sanitizeEvaluation(input: string): SanitizeResult {
  return sanitize(input, MAX_EVALUATION_LENGTH);
}

/**
 * Sanitizes user-provided feedback text.
 */
export function sanitizeFeedback(input: string): SanitizeResult {
  return sanitize(input, MAX_FEEDBACK_LENGTH);
}

function sanitize(input: string, maxLength: number): SanitizeResult {
  // Step 1: Strip control characters (keep newlines, tabs, carriage returns)
  let text = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  const originalLength = text.length;

  // Step 2: Enforce maximum length
  let wasTruncated = false;
  if (text.length > maxLength) {
    text = text.slice(0, maxLength);
    wasTruncated = true;
  }

  // Step 3: Detect injection patterns
  const matchedPatterns: string[] = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      matchedPatterns.push(pattern.source);
    }
  }

  return {
    text,
    hasInjectionPattern: matchedPatterns.length > 0,
    matchedPatterns,
    wasTruncated,
    originalLength,
  };
}

/**
 * Returns a human-readable warning message if injection patterns were detected.
 */
export function getInjectionWarning(result: SanitizeResult): string | null {
  if (!result.hasInjectionPattern) return null;
  return "Your input contains patterns that may attempt to override AI system instructions. Consider rephrasing for better results.";
}

/**
 * Returns a human-readable truncation message if the input was truncated.
 */
export function getTruncationWarning(result: SanitizeResult, type: string): string | null {
  if (!result.wasTruncated) return null;
  return `${type} was truncated from ${result.originalLength} to ${result.text.length} characters.`;
}
