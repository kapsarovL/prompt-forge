"use client";

import { useMemo, useState } from "react";
import { ForgeNavbar } from "@/components/forge-navbar";
import { EncryptionLock } from "@/components/encryption-lock";
import { ForgeHero } from "@/components/forge-hero";
import { ForgeFooter } from "@/components/forge-footer";
import { ForgeFeatures } from "@/components/forge-features";
import { ForgeGenerator } from "@/components/forge-generator";
import { ForgeVault } from "@/components/forge-vault";
import { ForgeToast } from "@/components/forge-toast";
import { GalleryModal } from "@/components/gallery-modal";
import { VersionsModal } from "@/components/versions-modal";
import { EvaluationModal } from "@/components/evaluation-modal";
import { FeedbackModal } from "@/components/feedback-modal";
import { SettingsModal } from "@/components/settings-modal";
import { CATEGORIES, MODELS, OPENCODE_MODELS, ANTHROPIC_MODELS, CODEX_MODELS } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useProviderState } from "@/hooks/use-provider-state";
import { useHistoryState } from "@/hooks/use-history-state";
import { useModalState } from "@/hooks/use-modal-state";
import { usePromptState } from "@/hooks/use-prompt-state";

export function PromptForge() {
  // --- Toast ---
  const { toast, showToast, dismissToast } = useToast();

  // --- Provider state ---
  const providerState = useProviderState();

  // --- History state ---
  const historyState = useHistoryState();

  // --- Modal state ---
  const modalState = useModalState();

  // --- Prompt state (depends on provider, history, modal, toast) ---
  const promptState = usePromptState({
    getApiConfig: providerState.getApiConfig,
    addVersion: historyState.addVersion,
    addHistory: historyState.addHistory,
    showToast,
    provider: providerState.provider,
    opencodeModel: providerState.opencodeModel,
    anthropicModel: providerState.anthropicModel,
    codexModel: providerState.codexModel,
    onOpenEvaluation: modalState.openEvaluation,
    onSetEvaluationResult: modalState.setEvaluationResult,
    onSetEvaluationError: modalState.setEvaluationError,
  });

  // Resolve effective model list based on active provider
  const effectiveModels = providerState.provider === "opencode"
    ? OPENCODE_MODELS
    : providerState.provider === "anthropic"
      ? ANTHROPIC_MODELS
      : providerState.provider === "codex"
        ? CODEX_MODELS
        : MODELS;

  // --- Filtered templates (depends on history state templates) ---
  const filteredTemplates = useMemo(() => {
    return historyState.allTemplates.filter((t) => {
      const matchesCategory = modalState.galleryCategory === "all" || t.category === modalState.galleryCategory;
      const matchesSearch = !modalState.gallerySearch || t.text.toLowerCase().includes(modalState.gallerySearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [historyState.allTemplates, modalState.gallerySearch, modalState.galleryCategory]);

  // --- Encryption lock state ---
  const [isEncryptionInitialized, setIsEncryptionInitialized] = useState(false);

  const handleEncryptionUnlock = async (passphrase: string): Promise<boolean> => {
    const success = await providerState.handleUnlockKeys(passphrase);
    if (success) {
      setIsEncryptionInitialized(true);
    }
    return success;
  };

  // If encryption is locked, show the unlock overlay
  if (providerState.isEncryptionLocked && !isEncryptionInitialized) {
    return <EncryptionLock onUnlock={handleEncryptionUnlock} />;
  }

  // --- Feedback submit handler ---
  const handleFeedbackSubmit = () => {
    if (modalState.feedbackRating === 0 && !modalState.feedbackComment.trim()) return;
    const feedback = {
      id: Math.random().toString(36).substring(2),
      prompt: promptState.generatedPrompt,
      rating: modalState.feedbackRating,
      comment: modalState.feedbackComment,
      timestamp: Date.now(),
    };
    const savedFeedback = localStorage.getItem("promptforge_feedback");
    let parsedFeedback: unknown[] = [];
    if (savedFeedback) {
      try {
        parsedFeedback = JSON.parse(savedFeedback) as unknown[];
      } catch {
        parsedFeedback = [];
      }
    }
    localStorage.setItem("promptforge_feedback", JSON.stringify([feedback, ...parsedFeedback]));
    modalState.setFeedbackSubmitted(true);
    setTimeout(() => {
      modalState.closeFeedback();
    }, 1500);
  };

  // --- Delete template handler ---
  const handleDeleteTemplate = (e: React.MouseEvent, text: string, catId: string) => {
    e.stopPropagation();
    historyState.deleteTemplate(text, catId);
    showToast("Template deleted");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-amber-500/30 relative">
      {/* Ambient glow blobs + noise overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] h-[50%] w-[50%] rounded-full bg-amber-600/8 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[50%] w-[50%] rounded-full bg-orange-600/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        <ForgeNavbar
          onOpenFeedback={modalState.openFeedback}
          onOpenSettings={modalState.openSettings}
          onOpenVersions={modalState.openVersions}
          hasGeneratedPrompt={promptState.generatedPrompt.length > 0}
        />

        <ForgeHero />

        <ForgeGenerator
          description={promptState.description}
          setDescription={promptState.setDescription}
          category={promptState.category}
          setCategory={promptState.setCategory}
          model={promptState.model}
          setModel={promptState.setModel}
          isGenerating={promptState.isGenerating}
          generatedPrompt={promptState.generatedPrompt}
          copied={promptState.copied}
          isEnhancing={promptState.isEnhancing}
          isRefining={promptState.isRefining}
          showRefineInput={promptState.showRefineInput}
          setShowRefineInput={promptState.setShowRefineInput}
          refineInstruction={promptState.refineInstruction}
          setRefineInstruction={promptState.setRefineInstruction}
          handleGenerate={promptState.handleGenerate}
          handleCopy={promptState.handleCopy}
          handleEvaluate={promptState.handleEvaluate}
          handleRefine={promptState.handleRefine}
          handleExport={promptState.handleExport}
          handleSmartEnhance={promptState.handleSmartEnhance}
          handleSaveTemplate={() => historyState.saveTemplate(promptState.category, promptState.description)}
          onOpenSettings={modalState.openSettings}
          hasCustomKey={providerState.hasCustomKey}
          hasApiKey={providerState.hasApiKey}
          categories={CATEGORIES}
          models={effectiveModels}
          provider={providerState.provider}
          setProvider={providerState.setProvider}
          opencodeModel={providerState.opencodeModel}
          onSetOpencodeModel={providerState.handleSetOpencodeModel}
          anthropicModel={providerState.anthropicModel}
          onSetAnthropicModel={providerState.handleSetAnthropicModel}
          codexModel={providerState.codexModel}
          onSetCodexModel={providerState.handleSetCodexModel}
          onOpenVersions={modalState.openVersions}
          onOpenGallery={modalState.openGallery}
        />

        <ForgeVault
          history={historyState.history}
          historySearch={historyState.historySearch}
          setHistorySearch={historyState.setHistorySearch}
          visibleHistoryCount={historyState.visibleHistoryCount}
          setVisibleHistoryCount={historyState.setVisibleHistoryCount}
          handleRecall={promptState.handleRecall}
          handleDeleteHistory={(id: string) => {
            if (!window.confirm("Delete this history item?")) return;
            historyState.deleteHistoryItem(id);
          }}
          handleClearAllHistory={() => {
            if (window.confirm("Clear all history? This cannot be undone.")) historyState.clearAllHistory();
          }}
          categories={CATEGORIES}
          showToast={showToast}
        />

        <ForgeFeatures />

        <ForgeFooter />

        {/* Modals */}
        <VersionsModal
          isOpen={modalState.isVersionsOpen}
          onClose={modalState.closeVersions}
          versions={historyState.versions}
          setGeneratedPrompt={promptState.setGeneratedPrompt}
          showToast={showToast}
        />

        <EvaluationModal
          isOpen={modalState.isEvaluationOpen}
          onClose={modalState.closeEvaluation}
          isEvaluating={promptState.isEvaluating}
          evaluationResult={modalState.evaluationResult}
          evaluationError={modalState.evaluationError}
          handleAutoFix={() => promptState.handleAutoFix(modalState.evaluationResult!)}
          isAutoFixing={promptState.isAutoFixing}
        />

        <FeedbackModal
          isOpen={modalState.isFeedbackOpen}
          onClose={modalState.closeFeedback}
          feedbackSubmitted={modalState.feedbackSubmitted}
          feedbackRating={modalState.feedbackRating}
          setFeedbackRating={modalState.setFeedbackRating}
          feedbackComment={modalState.feedbackComment}
          setFeedbackComment={modalState.setFeedbackComment}
          handleFeedbackSubmit={handleFeedbackSubmit}
        />

        <SettingsModal
          isOpen={modalState.isSettingsOpen}
          onClose={modalState.closeSettings}
          onSaveGeminiKey={providerState.handleSaveGeminiKey}
          onClearGeminiKey={() => {
            if (window.confirm("Clear Gemini API key?")) providerState.handleClearGeminiKey();
          }}
          hasGeminiKey={providerState.geminiKey !== null}
          onSaveOpenCodeKey={providerState.handleSaveOpenCodeKey}
          onClearOpenCodeKey={() => {
            if (window.confirm("Clear OpenCode API key?")) providerState.handleClearOpenCodeKey();
          }}
          hasOpenCodeKey={providerState.opencodeKey !== null}
          opencodeModel={providerState.opencodeModel}
          onSetOpencodeModel={providerState.handleSetOpencodeModel}
          opencodeBaseUrl={providerState.opencodeBaseUrl}
          onSetOpencodeBaseUrl={providerState.handleSetOpencodeBaseUrl}
          onSaveAnthropicKey={providerState.handleSaveAnthropicKey}
          onClearAnthropicKey={() => {
            if (window.confirm("Clear Anthropic API key?")) providerState.handleClearAnthropicKey();
          }}
          hasAnthropicKey={providerState.anthropicKey !== null}
          anthropicModel={providerState.anthropicModel}
          onSetAnthropicModel={providerState.handleSetAnthropicModel}
          onSaveCodexKey={providerState.handleSaveCodexKey}
          onClearCodexKey={() => {
            if (window.confirm("Clear OpenAI Codex API key?")) providerState.handleClearCodexKey();
          }}
          hasCodexKey={providerState.codexKey !== null}
          codexModel={providerState.codexModel}
          onSetCodexModel={providerState.handleSetCodexModel}
          isEncryptionActive={!!providerState.passphrase || providerState.isEncryptionLocked}
          onEnableEncryption={providerState.handleEnableEncryption}
          onDisableEncryption={providerState.handleDisableEncryption}
        />

        <GalleryModal
          isOpen={modalState.isGalleryOpen}
          onClose={modalState.closeGallery}
          gallerySearch={modalState.gallerySearch}
          setGallerySearch={modalState.setGallerySearch}
          galleryCategory={modalState.galleryCategory}
          setGalleryCategory={modalState.setGalleryCategory}
          filteredTemplates={filteredTemplates}
          categories={CATEGORIES}
          setDescription={promptState.setDescription}
          setCategory={promptState.setCategory}
          handleDeleteTemplate={handleDeleteTemplate}
          showToast={showToast}
        />

        <ForgeToast toast={toast} onClose={dismissToast} />
      </div>
    </div>
  );
}
