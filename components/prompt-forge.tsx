"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleGenAI } from "@google/genai";
import { ForgeNavbar } from "@/components/forge-navbar";
import { ForgeFooter } from "@/components/forge-footer";
import { ForgeHero } from "@/components/forge-hero";
import { ForgeFeatures } from "@/components/forge-features";
import { ForgeGenerator } from "@/components/forge-generator";
import { ForgeVault } from "@/components/forge-vault";
import { ForgeToast } from "@/components/forge-toast";
import { VersionsModal } from "@/components/versions-modal";
import { GalleryModal } from "@/components/gallery-modal";
import { EvaluationModal } from "@/components/evaluation-modal";
import { FeedbackModal } from "@/components/feedback-modal";
import { SettingsModal } from "@/components/settings-modal";
import { CATEGORIES, MODELS, OPENCODE_MODELS, BUILT_IN_TEMPLATES } from "@/lib/types";
import type { EvaluationData, PromptHistory, PromptVersion, Provider } from "@/lib/types";
import { generatePrompt, evaluatePrompt, refinePrompt, smartEnhance, autoFixPrompt } from "@/lib/api";
import type { ApiConfig } from "@/lib/api";
import { getErrorMessage, getApiKey } from "@/lib/gemini";
import { getOpenCodeConfig, validateOpenCodeKey, OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";
import type { OpenCodeConfig } from "@/lib/opencode";
import { OPENCODE_DEFAULT_MODEL } from "@/lib/opencode";

export function PromptForge() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [model, setModel] = useState(MODELS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(6);

  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  const [customTemplates, setCustomTemplates] = useState<Record<string, string[]>>({});

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("all");

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationData | null>(null);
  const [evaluationError, setEvaluationError] = useState("");
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  const [isRefining, setIsRefining] = useState(false);
  const [showRefineInput, setShowRefineInput] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Provider state
  const [provider, setProvider] = useState<Provider>("gemini");
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [opencodeKey, setOpencodeKey] = useState<string | null>(null);
  const [opencodeModel, setOpencodeModel] = useState(OPENCODE_DEFAULT_MODEL);
  const [opencodeBaseUrl, setOpencodeBaseUrl] = useState(OPENCODE_DEFAULT_BASE_URL);

  const getApiConfig = (): ApiConfig => ({
    provider,
    geminiKey: userApiKey ?? undefined,
    geminiModel: model,
    opencodeConfig: getEffectiveOpenCodeConfig(),
  });

  // Load provider state from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("promptforge_api_key");
    if (savedKey) setUserApiKey(savedKey);

    const savedOpenKey = localStorage.getItem("promptforge_opencode_api_key");
    if (savedOpenKey) setOpencodeKey(savedOpenKey);

    const savedModel = localStorage.getItem("promptforge_opencode_model");
    if (savedModel) setOpencodeModel(savedModel);

    const savedBaseUrl = localStorage.getItem("promptforge_opencode_base_url");
    if (savedBaseUrl) setOpencodeBaseUrl(savedBaseUrl);

    const savedProvider = localStorage.getItem("promptforge_provider") as Provider | null;
    if (savedProvider === "gemini" || savedProvider === "opencode") setProvider(savedProvider);
  }, []);

  // Persist provider preference
  useEffect(() => {
    localStorage.setItem("promptforge_provider", provider);
  }, [provider]);

  // Gemini API key handlers
  const handleSaveGeminiKey = async (key: string): Promise<boolean> => {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Reply with only the word OK.",
        config: { temperature: 0 },
      });
      setUserApiKey(key);
      localStorage.setItem("promptforge_api_key", key);
      return true;
    } catch {
      return false;
    }
  };

  const handleClearGeminiKey = () => {
    setUserApiKey(null);
    localStorage.removeItem("promptforge_api_key");
  };

  // OpenCode API key handlers
  const handleSaveOpenCodeKey = async (key: string): Promise<boolean> => {
    const valid = await validateOpenCodeKey(key, opencodeBaseUrl);
    if (valid) {
      setOpencodeKey(key);
      localStorage.setItem("promptforge_opencode_api_key", key);
      localStorage.setItem("promptforge_opencode_model", opencodeModel);
    }
    return valid;
  };

  const handleClearOpenCodeKey = () => {
    setOpencodeKey(null);
    localStorage.removeItem("promptforge_opencode_api_key");
  };

  const handleSetOpencodeModel = (model: string) => {
    setOpencodeModel(model);
    localStorage.setItem("promptforge_opencode_model", model);
  };

  const handleSetOpencodeBaseUrl = (url: string) => {
    setOpencodeBaseUrl(url);
    localStorage.setItem("promptforge_opencode_base_url", url);
  };

  const getEffectiveOpenCodeConfig = (): OpenCodeConfig | null => {
    const config = getOpenCodeConfig();
    if (config) return config;
    if (opencodeKey) {
      return { apiKey: opencodeKey, model: opencodeModel, baseUrl: opencodeBaseUrl };
    }
    return null;
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("promptforge_history");
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch {}
    }
    const savedCustomTemplates = localStorage.getItem("promptforge_custom_templates");
    if (savedCustomTemplates) {
      try { setCustomTemplates(JSON.parse(savedCustomTemplates)); } catch {}
    }
    const savedVersions = localStorage.getItem("promptforge_versions");
    if (savedVersions) {
      try { setVersions(JSON.parse(savedVersions)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("promptforge_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("promptforge_custom_templates", JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem("promptforge_versions", JSON.stringify(versions));
  }, [versions]);

  const addVersion = useCallback((prompt: string) => {
    const newVersion: PromptVersion = {
      id: Math.random().toString(36).substring(2),
      prompt,
      timestamp: Date.now(),
    };
    setVersions(prev => [newVersion, ...prev].slice(0, 20));
  }, []);

  const addHistory = useCallback((item: Omit<PromptHistory, "id" | "timestamp">) => {
    const newItem: PromptHistory = {
      id: Math.random().toString(36).substring(2),
      timestamp: Date.now(),
      ...item,
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  const handleGenerate = async () => {
    if (!description.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedPrompt("");
    try {
      const text = await generatePrompt(description, category, getApiConfig());
      setGeneratedPrompt(text);
      addVersion(text);
      const modelName = provider === "opencode" ? opencodeModel : model;
      addHistory({ description, category, model: modelName, prompt: text });
    } catch (err) {
      console.error("Error generating prompt:", err);
      showToast(getErrorMessage(err), "info");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSmartEnhance = async () => {
    if (!description.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const text = await smartEnhance(description, getApiConfig());
      setDescription(text);
      showToast("Description enhanced!", "info");
    } catch (err) {
      console.error(err);
      showToast("Enhancement failed", "info");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAutoFix = async () => {
    if (!generatedPrompt || !evaluationResult || isAutoFixing) return;
    setIsAutoFixing(true);
    try {
      const text = await autoFixPrompt(generatedPrompt, evaluationResult, getApiConfig());
      setGeneratedPrompt(text);
      setIsEvaluationOpen(false);
      showToast("Prompt optimized based on evaluation!", "success");
      addVersion(text);
      const modelName = provider === "opencode" ? opencodeModel : model;
      addHistory({ description: description + " (Auto-Optimized)", category, model: modelName, prompt: text });
    } catch (err) {
      console.error(err);
      showToast("Auto-fix failed", "info");
    } finally {
      setIsAutoFixing(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(() => showToast("Copy failed", "info"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecall = (item: PromptHistory) => {
    setDescription(item.description);
    setCategory(item.category);
    setModel(item.model);
    setGeneratedPrompt(item.prompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    if (!window.confirm("Delete this history item?")) return;
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleExport = () => {
    if (!generatedPrompt) return;
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], {type: 'text/plain'});
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = `promptforge-${category}-${new Date().toISOString().split('T')[0].replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    showToast("Prompt exported successfully!");
  };

  const handleEvaluate = async () => {
    if (!generatedPrompt || isEvaluating) return;
    setIsEvaluating(true);
    setEvaluationResult(null);
    setEvaluationError("");
    setIsEvaluationOpen(true);
    try {
      const result = await evaluatePrompt(generatedPrompt, getApiConfig());
      setEvaluationResult(result);
    } catch (err) {
      console.error("Error evaluating prompt:", err);
      setEvaluationError(getErrorMessage(err));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedPrompt || !refineInstruction.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const text = await refinePrompt(generatedPrompt, refineInstruction, getApiConfig());
      setGeneratedPrompt(text);
      addVersion(text);
      const modelName = provider === "opencode" ? opencodeModel : model;
      addHistory({ description: description + " (Refined)", category, model: modelName, prompt: text });
      setRefineInstruction("");
      setShowRefineInput(false);
    } catch (err) {
      console.error("Error refining prompt:", err);
      showToast(getErrorMessage(err), "info");
    } finally {
      setIsRefining(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0 && !feedbackComment.trim()) return;
    const feedback = {
      id: Math.random().toString(36).substring(2),
      prompt: generatedPrompt,
      rating: feedbackRating,
      comment: feedbackComment,
      timestamp: Date.now(),
    };
    const savedFeedback = localStorage.getItem("promptforge_feedback");
    let parsedFeedback: unknown[] = [];
    if (savedFeedback) {
      try { parsedFeedback = JSON.parse(savedFeedback) as unknown[]; } catch { parsedFeedback = []; }
    }
    localStorage.setItem("promptforge_feedback", JSON.stringify([feedback, ...parsedFeedback]));
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setIsFeedbackOpen(false);
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setFeedbackRating(0);
        setFeedbackComment("");
      }, 300);
    }, 1500);
  };

  const handleSaveTemplate = () => {
    if (!description.trim()) return;
    const current = customTemplates[category] || [];
    if (current.includes(description.trim())) return;
    setCustomTemplates(prev => ({
      ...prev,
      [category]: [description.trim(), ...current],
    }));
    showToast("Template saved successfully!");
  };

  const handleDeleteTemplate = (e: React.MouseEvent, templateToDelete: string, catId: string = category) => {
    e.stopPropagation();
    if (!window.confirm("Delete this template?")) return;
    setCustomTemplates(prev => ({
      ...prev,
      [catId]: (prev[catId] || []).filter(t => t !== templateToDelete),
    }));
  };

  const allTemplates = useMemo(() => {
    const combined: { text: string; category: string; isCustom: boolean }[] = [];
    Object.entries(BUILT_IN_TEMPLATES).forEach(([cat, list]) => {
      list.forEach(text => combined.push({ text, category: cat, isCustom: false }));
    });
    Object.entries(customTemplates).forEach(([cat, list]) => {
      list.forEach(text => combined.push({ text, category: cat, isCustom: true }));
    });
    return combined;
  }, [customTemplates]);

  const filteredTemplates = useMemo(() => allTemplates.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(gallerySearch.toLowerCase());
    const matchesCategory = galleryCategory === "all" || t.category === galleryCategory;
    return matchesSearch && matchesCategory;
  }), [allTemplates, gallerySearch, galleryCategory]);

  const effectiveModels = provider === "opencode" ? OPENCODE_MODELS : MODELS;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-amber-500/30">
      <ForgeNavbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      <ForgeHero onBrowseGallery={() => setIsGalleryOpen(true)} />

      <ForgeFeatures />

      <ForgeGenerator
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        model={model}
        setModel={setModel}
        isGenerating={isGenerating}
        generatedPrompt={generatedPrompt}
        copied={copied}
        isEnhancing={isEnhancing}
        isRefining={isRefining}
        showRefineInput={showRefineInput}
        setShowRefineInput={setShowRefineInput}
        refineInstruction={refineInstruction}
        setRefineInstruction={setRefineInstruction}
        handleGenerate={handleGenerate}
        handleCopy={handleCopy}
        handleEvaluate={handleEvaluate}
        handleRefine={handleRefine}
        handleExport={handleExport}
        handleSmartEnhance={handleSmartEnhance}
        handleSaveTemplate={handleSaveTemplate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={userApiKey !== null}
        hasApiKey={provider === "gemini" ? !!getApiKey() : !!(opencodeKey || getOpenCodeConfig())}
        categories={CATEGORIES}
        models={effectiveModels}
        provider={provider}
        setProvider={setProvider}
        opencodeModel={opencodeModel}
        onSetOpencodeModel={handleSetOpencodeModel}
        onOpenVersions={() => setIsVersionsOpen(true)}
      />

      <ForgeVault
        history={history}
        historySearch={historySearch}
        setHistorySearch={setHistorySearch}
        visibleHistoryCount={visibleHistoryCount}
        setVisibleHistoryCount={setVisibleHistoryCount}
        handleRecall={handleRecall}
        handleDeleteHistory={handleDeleteHistory}
        handleClearAllHistory={() => {
          if (window.confirm("Clear all history? This cannot be undone.")) setHistory([]);
        }}
        categories={CATEGORIES}
        showToast={showToast}
      />

      <ForgeFooter />

      <VersionsModal
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        versions={versions}
        setGeneratedPrompt={setGeneratedPrompt}
        showToast={showToast}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        gallerySearch={gallerySearch}
        setGallerySearch={setGallerySearch}
        galleryCategory={galleryCategory}
        setGalleryCategory={setGalleryCategory}
        filteredTemplates={filteredTemplates}
        categories={CATEGORIES}
        setDescription={setDescription}
        setCategory={setCategory}
        handleDeleteTemplate={handleDeleteTemplate}
        showToast={showToast}
      />

      <EvaluationModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        isEvaluating={isEvaluating}
        evaluationResult={evaluationResult}
        evaluationError={evaluationError}
        handleAutoFix={handleAutoFix}
        isAutoFixing={isAutoFixing}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        feedbackSubmitted={feedbackSubmitted}
        feedbackRating={feedbackRating}
        setFeedbackRating={setFeedbackRating}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        handleFeedbackSubmit={handleFeedbackSubmit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveGeminiKey={handleSaveGeminiKey}
        onClearGeminiKey={handleClearGeminiKey}
        hasGeminiKey={userApiKey !== null}
        onSaveOpenCodeKey={handleSaveOpenCodeKey}
        onClearOpenCodeKey={handleClearOpenCodeKey}
        hasOpenCodeKey={opencodeKey !== null}
        opencodeModel={opencodeModel}
        onSetOpencodeModel={handleSetOpencodeModel}
        opencodeBaseUrl={opencodeBaseUrl}
        onSetOpencodeBaseUrl={handleSetOpencodeBaseUrl}
      />

      <ForgeToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
