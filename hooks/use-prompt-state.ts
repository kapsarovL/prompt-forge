"use client";

import { useState, useCallback } from "react";
import { CATEGORIES, MODELS } from "@/lib/types";
import type { Provider, EvaluationData } from "@/lib/types";
import { generatePrompt, refinePrompt, smartEnhance, evaluatePrompt, autoFixPrompt } from "@/lib/api";
import type { ApiConfig } from "@/lib/api";
import { getErrorMessage } from "@/lib/gemini";

/**
 * Options for the usePromptState hook.
 */
export interface UsePromptStateOptions {
  /**
   * Current API configuration from the provider hook.
   * Accepts optional geminiModel to pass the user-selected model for Gemini.
   */
  getApiConfig: (geminiModel?: string) => ApiConfig;
  /** Called to save a version snapshot of the generated prompt. */
  addVersion: (prompt: string) => void;
  /** Called to save a history entry after generation/refinement/auto-fix. */
  addHistory: (item: { description: string; category: string; model: string; prompt: string }) => void;
  /** Called to show a toast notification. */
  showToast: (message: string, type?: "success" | "info") => void;
  /** Current provider (needed for model name resolution). */
  provider: Provider;
  /** Current opencode model (needed for model name in history). */
  opencodeModel: string;
  /** Current anthropic model (needed for model name in history). */
  anthropicModel: string;
  /** Current codex model (needed for model name in history). */
  codexModel: string;
  /** Called to open the evaluation modal with results. */
  onOpenEvaluation: () => void;
  /** Called to set evaluation results. */
  onSetEvaluationResult: (result: EvaluationData | null) => void;
  /** Called to set evaluation error. */
  onSetEvaluationError: (error: string) => void;
}

/**
 * Manages all prompt generation, refinement, evaluation, and auto-fix state.
 */
export function usePromptState(options: UsePromptStateOptions) {
  const {
    getApiConfig,
    addVersion,
    addHistory,
    showToast,
    provider,
    opencodeModel,
    anthropicModel,
    codexModel,
    onOpenEvaluation,
    onSetEvaluationResult,
    onSetEvaluationError,
  } = options;

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [modelSelection, setModelSelection] = useState(MODELS[0].id);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [showRefineInput, setShowRefineInput] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");

  // Resolve the active model name for history/display
  const effectiveModelName = provider === "opencode"
    ? opencodeModel
    : provider === "anthropic"
      ? anthropicModel
      : provider === "codex"
        ? codexModel
        : modelSelection;

  const handleGenerate = useCallback(async () => {
    if (!description.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedPrompt("");
    try {
      const text = await generatePrompt(description, category, getApiConfig(modelSelection));
      setGeneratedPrompt(text);
      addVersion(text);
      addHistory({ description, category, model: effectiveModelName, prompt: text });
    } catch (err) {
      console.error("Error generating prompt:", err);
      showToast(getErrorMessage(err), "info");
    } finally {
      setIsGenerating(false);
    }
  }, [description, category, isGenerating, getApiConfig, addVersion, addHistory, effectiveModelName, modelSelection, showToast]);

  const handleSmartEnhance = useCallback(async () => {
    if (!description.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const text = await smartEnhance(description, getApiConfig(modelSelection));
      setDescription(text);
      showToast("Description enhanced!", "info");
    } catch (err) {
      console.error(err);
      showToast("Enhancement failed", "info");
    } finally {
      setIsEnhancing(false);
    }
  }, [description, isEnhancing, getApiConfig, modelSelection, showToast]);

  const handleRefine = useCallback(async () => {
    if (!generatedPrompt || !refineInstruction.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const text = await refinePrompt(generatedPrompt, refineInstruction, getApiConfig(modelSelection));
      setGeneratedPrompt(text);
      addVersion(text);
      addHistory({ description: description + " (Refined)", category, model: effectiveModelName, prompt: text });
      setRefineInstruction("");
      setShowRefineInput(false);
    } catch (err) {
      console.error("Error refining prompt:", err);
      showToast(getErrorMessage(err), "info");
    } finally {
      setIsRefining(false);
    }
  }, [generatedPrompt, refineInstruction, isRefining, description, category, getApiConfig, addVersion, addHistory, effectiveModelName, modelSelection, showToast]);

  const handleEvaluate = useCallback(async () => {
    if (!generatedPrompt || isEvaluating) return;
    setIsEvaluating(true);
    onSetEvaluationResult(null);
    onSetEvaluationError("");
    onOpenEvaluation();
    try {
      const result = await evaluatePrompt(generatedPrompt, getApiConfig(modelSelection));
      onSetEvaluationResult(result);
    } catch (err) {
      console.error("Error evaluating prompt:", err);
      onSetEvaluationError(getErrorMessage(err));
    } finally {
      setIsEvaluating(false);
    }
  }, [generatedPrompt, isEvaluating, getApiConfig, modelSelection, onOpenEvaluation, onSetEvaluationResult, onSetEvaluationError]);

  const handleAutoFix = useCallback(
    async (evaluationResult: EvaluationData) => {
      if (!generatedPrompt || isAutoFixing) return;
      setIsAutoFixing(true);
      try {
        const text = await autoFixPrompt(generatedPrompt, evaluationResult, getApiConfig(modelSelection));
        setGeneratedPrompt(text);
        showToast("Prompt optimized based on evaluation!", "success");
        addVersion(text);
        addHistory({ description: description + " (Auto-Optimized)", category, model: effectiveModelName, prompt: text });
      } catch (err) {
        console.error(err);
        showToast("Auto-fix failed", "info");
      } finally {
        setIsAutoFixing(false);
      }
    },
    [generatedPrompt, isAutoFixing, description, category, getApiConfig, addVersion, addHistory, effectiveModelName, modelSelection, showToast],
  );

  const handleCopy = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(() => showToast("Copy failed", "info"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt, showToast]);

  const handleExport = useCallback(() => {
    if (!generatedPrompt) return;
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = `promptforge-${category}-${new Date().toISOString().split("T")[0].replace(/[:.]/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    showToast("Prompt exported successfully!");
  }, [generatedPrompt, category, showToast]);

  const handleRecall = useCallback((item: { description: string; category: string; model: string; prompt: string }) => {
    setDescription(item.description);
    setCategory(item.category);
    setModelSelection(item.model);
    setGeneratedPrompt(item.prompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    // State
    description,
    setDescription,
    category,
    setCategory,
    model: modelSelection,
    setModel: setModelSelection,
    generatedPrompt,
    setGeneratedPrompt,
    copied,
    isGenerating,
    isRefining,
    isEnhancing,
    isAutoFixing,
    isEvaluating,
    showRefineInput,
    setShowRefineInput,
    refineInstruction,
    setRefineInstruction,
    effectiveModelName,
    // Handlers
    handleGenerate,
    handleSmartEnhance,
    handleRefine,
    handleEvaluate,
    handleAutoFix,
    handleCopy,
    handleExport,
    handleRecall,
  };
}
