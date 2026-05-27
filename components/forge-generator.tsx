"use client";

import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check, Sparkles, Wand2, Download, Loader2, X, ChevronDown, Bot, Cpu, History, Library, AlertTriangle, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Provider } from "@/lib/types";
import type { Variants } from "motion/react";
import { OutputPanelSkeleton } from "@/components/forge-skeleton";

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
  onOpenVersions: () => void;
  onOpenGallery?: () => void;
}

const PROVIDERS: { id: Provider; label: string; Icon: typeof Cpu | typeof Bot }[] = [
  { id: "gemini", label: "Gemini", Icon: Cpu },
  { id: "opencode", label: "OpenCode", Icon: Bot },
  { id: "anthropic", label: "Anthropic", Icon: Cpu },
  { id: "codex", label: "Codex", Icon: Bot },
];

const springEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: springEase },
  }),
} satisfies Variants;

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
    onOpenVersions, onOpenGallery,
  } = props;

  return (
    <section id="generator" className="pt-16 pb-24 px-6 relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto">
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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-5/12 space-y-8">
            <motion.div
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent pointer-events-none rounded-3xl" />

              {/* Description Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="intent" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Intent</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" title={hasCustomKey ? "Custom API key active" : "Using default API key"}>
                      <div className={`w-2 h-2 rounded-full ${hasCustomKey ? "bg-green-400" : "bg-zinc-600"}`} />
                      <span className="text-[10px] text-zinc-600">{hasCustomKey ? "Custom" : "Default"}</span>
                    </div>
                    <button onClick={onOpenSettings} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors">
                      Settings
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="intent"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder="What are we building today?"
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-5 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_32px_-12px_rgba(245,158,11,0.4)] transition-all resize-none font-light leading-relaxed"
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-700 font-mono">
                      {description.trim() ? `${description.length} chars` : "\u00A0"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSmartEnhance}
                        disabled={isEnhancing || !description.trim()}
                        className="p-2 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-all disabled:opacity-50"
                        title="Smart Enhance"
                      >
                        {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDescription("")}
                        className="p-2 bg-white/5 text-zinc-500 rounded-xl hover:bg-white/10 transition-all"
                        title="Clear"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-zinc-700 font-mono">Ctrl+Enter to generate</span>
                  <button onClick={handleSaveTemplate} disabled={!description.trim()} className="md:hidden text-[10px] font-bold tracking-widest uppercase text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
                    Save Template
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <motion.div
                custom={1}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Category</span>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                        category === cat.id
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_16px_-6px_rgba(245,158,11,0.15)]"
                          : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                      }`}
                    >
                      <cat.icon className={`w-4 h-4 ${category === cat.id ? "text-amber-400" : "text-zinc-600"}`} />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Provider Toggle */}
              <motion.div
                custom={2}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Provider</span>
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-black/40 border border-white/10 rounded-xl">
                  {PROVIDERS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setProvider(id)}
                      className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                        provider === id
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_-4px_rgba(245,158,11,0.12)]"
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Model Selection */}
              <motion.div
                custom={3}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <label htmlFor="model" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Model</label>
                <div className="relative">
                  <select
                    id="model"
                    value={provider === "opencode" ? opencodeModel : model}
                    onChange={(e) =>
                      provider === "opencode"
                        ? onSetOpencodeModel(e.target.value)
                        : setModel(e.target.value)
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-300 appearance-none focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                  >
                    {models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </motion.div>

              {/* Generate Button */}
              <motion.div
                custom={4}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  onClick={handleGenerate}
                  disabled={!description.trim() || isGenerating || !hasApiKey}
                  title={!hasApiKey ? "No API key configured. Open Settings to add one." : undefined}
                  className="forge-ember w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-2xl shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_-4px_rgba(245,158,11,0.4)] hover:from-amber-500 hover:to-orange-600 hover:scale-[1.02] transition-all active:scale-[0.97] disabled:opacity-50 disabled:shadow-none disabled:bg-zinc-800 disabled:from-zinc-800 disabled:to-zinc-800 disabled:hover:scale-100 disabled:hover:from-zinc-800 disabled:hover:to-zinc-800 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? "Forging..." : "Generate Prompt"}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Output */}
          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-7/12 flex flex-col"
          >
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl flex flex-col min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/[0.03] to-transparent pointer-events-none rounded-3xl" />
              <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35] group-hover:opacity-50 transition-opacity" />
              <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/30 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Output</span>
                </div>

                <div className="flex items-center gap-1">
                  {generatedPrompt ? (
                    <>
                      <ToolbarButton onClick={handleCopy} title="Copy">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                      </ToolbarButton>
                      <ToolbarButton onClick={handleEvaluate} title="Evaluate" className="text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton onClick={() => setShowRefineInput(!showRefineInput)} title="Refine">
                        <Wand2 className="w-4 h-4 text-zinc-500" />
                      </ToolbarButton>
                      <ToolbarButton onClick={handleExport} title="Export">
                        <Download className="w-4 h-4 text-zinc-500" />
                      </ToolbarButton>
                      <ToolbarButton onClick={onOpenVersions} title="Versions">
                        <History className="w-4 h-4 text-zinc-500" />
                      </ToolbarButton>
                    </>
                  ) : (
                    <span className="text-[10px] text-zinc-700 font-mono">awaiting input</span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showRefineInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden shrink-0"
                  >
                    <div className="px-8 py-4 border-b border-amber-500/20 bg-amber-500/[0.03] refine-bar">
                      <div className="flex gap-4">
                        <label htmlFor="refine-instruction" className="sr-only">Refine instruction</label>
                        <input
                          id="refine-instruction"
                          type="text"
                          value={refineInstruction}
                          onChange={(e) => setRefineInstruction(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleRefine(); }
                          }}
                          placeholder="Refine this prompt..."
                          className="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-700 focus:outline-none"
                        />
                        <button
                          onClick={handleRefine}
                          disabled={isRefining || !refineInstruction.trim()}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                          Apply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 p-8 relative">
                <AnimatePresence mode="wait">
                  {isGenerating || isRefining ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <OutputPanelSkeleton />
                    </motion.div>
                  ) : generatedPrompt ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full"
                    >
                      <label htmlFor="output" className="sr-only">Generated prompt output</label>
                      <textarea
                        id="output"
                        readOnly
                        value={generatedPrompt}
                        aria-describedby="output-description"
                        className="w-full h-full bg-transparent text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none line-numbers"
                      />
                      <span id="output-description" className="sr-only">Generated prompt ready for copy or export</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                        <div className="w-24 h-24 rounded-3xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center group-hover:bg-zinc-800/50 group-hover:border-zinc-700/50 transition-all">
                          <Terminal className="w-10 h-10 text-zinc-700 group-hover:text-zinc-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-500 mb-1">Awaiting Input</p>
                          <p className="text-xs text-zinc-700 font-light max-w-[260px] mx-auto leading-relaxed">
                            Describe what you need, then forge your prompt.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ToolbarButton({ onClick, children, title, className = "" }: {
  onClick: () => void; children: React.ReactNode; title: string; className?: string;
}) {
  return (
    <button onClick={onClick} title={title} className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${className}`}>
      {children}
    </button>
  );
}
