"use client";

import { motion, AnimatePresence } from "motion/react";
import { History, Library, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Provider } from "@/lib/types";
import { InputPanel } from "@/components/forge-input-panel";
import { OutputPanel } from "@/components/forge-output-panel";

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface Model {
  id: string;
  label: string;
  description: string;
}

interface ForgeGeneratorProps {
  description: string;
  setDescription: (desc: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  model: string;
  setModel: (model: string) => void;
  isGenerating: boolean;
  generatedPrompt: string;
  copied: boolean;
  isEnhancing: boolean;
  isRefining: boolean;
  showRefineInput: boolean;
  setShowRefineInput: (show: boolean) => void;
  refineInstruction: string;
  setRefineInstruction: (instr: string) => void;
  handleGenerate: () => Promise<void>;
  handleCopy: () => void;
  handleEvaluate: () => Promise<void>;
  handleRefine: () => Promise<void>;
  handleExport: () => void;
  handleSmartEnhance: () => Promise<void>;
  handleSaveTemplate: () => void;
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  hasApiKey: boolean;
  categories: Category[];
  models: Model[];
  provider: Provider;
  setProvider: (p: Provider) => void;
  opencodeModel: string;
  onSetOpencodeModel: (model: string) => void;
  anthropicModel?: string;
  onSetAnthropicModel?: (model: string) => void;
  codexModel?: string;
  onSetCodexModel?: (model: string) => void;
  onOpenVersions: () => void;
  onOpenGallery?: () => void;
}

export function ForgeGenerator(props: ForgeGeneratorProps) {
  const {
    description, setDescription,
    category, setCategory,
    model, setModel,
    isGenerating, generatedPrompt, copied,
    isEnhancing, isRefining,
    showRefineInput, setShowRefineInput,
    refineInstruction, setRefineInstruction,
    handleGenerate, handleCopy, handleEvaluate, handleRefine, handleExport,
    handleSmartEnhance, handleSaveTemplate,
    onOpenSettings,
    hasCustomKey, hasApiKey,
    categories, models,
    provider, setProvider,
    opencodeModel, onSetOpencodeModel,
    anthropicModel, onSetAnthropicModel,
    codexModel, onSetCodexModel,
    onOpenVersions, onOpenGallery,
  } = props;

  return (
    <section id="generator" className="pt-16 pb-24 px-6 relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                The Forge
              </span>
            </h1>
            <p className="text-zinc-500 font-light mt-1">Configure your parameters and generate.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase">
            <button onClick={onOpenVersions} className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
              <History className="w-3 h-3" /> Versions
            </button>
            <button onClick={onOpenGallery} className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
              <Library className="w-3 h-3" /> Gallery
            </button>
            <button onClick={handleSaveTemplate} disabled={!description.trim()} className="text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
              Save Template
            </button>
          </div>
        </motion.div>

        {/* No API key banner */}
        <AnimatePresence>
          {!hasApiKey && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-sm text-amber-300/90">
                  No API key configured.{" "}
                  <button onClick={onOpenSettings} className="underline text-amber-200 hover:text-amber-100 font-medium">
                    Open Settings
                  </button>{" "}
                  to add your key before generating.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-5/12 space-y-8">
            <InputPanel
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              model={model}
              setModel={setModel}
              isGenerating={isGenerating}
              isEnhancing={isEnhancing}
              handleGenerate={handleGenerate}
              handleSmartEnhance={handleSmartEnhance}
              handleSaveTemplate={handleSaveTemplate}
              onOpenSettings={onOpenSettings}
              hasCustomKey={hasCustomKey}
              hasApiKey={hasApiKey}
              categories={categories}
              models={models}
              provider={provider}
              setProvider={setProvider}
              opencodeModel={opencodeModel}
              onSetOpencodeModel={onSetOpencodeModel}
              anthropicModel={anthropicModel}
              onSetAnthropicModel={onSetAnthropicModel}
              codexModel={codexModel}
              onSetCodexModel={onSetCodexModel}
            />
          </div>

          <OutputPanel
            generatedPrompt={generatedPrompt}
            copied={copied}
            isGenerating={isGenerating}
            isRefining={isRefining}
            showRefineInput={showRefineInput}
            setShowRefineInput={setShowRefineInput}
            refineInstruction={refineInstruction}
            setRefineInstruction={setRefineInstruction}
            handleCopy={handleCopy}
            handleEvaluate={handleEvaluate}
            handleRefine={handleRefine}
            handleExport={handleExport}
            onOpenVersions={onOpenVersions}
          />
        </div>
      </div>
    </section>
  );
}
