"use client";

import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check, Sparkles, Wand2, Download, Loader2, X, ChevronDown, Settings } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: any;
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
  categories: Category[];
  models: Model[];
}

export function ForgeGenerator({
  description,
  setDescription,
  category,
  setCategory,
  model,
  setModel,
  isGenerating,
  generatedPrompt,
  copied,
  isEnhancing,
  isRefining,
  showRefineInput,
  setShowRefineInput,
  refineInstruction,
  setRefineInstruction,
  handleGenerate,
  handleCopy,
  handleEvaluate,
  handleRefine,
  handleExport,
  handleSmartEnhance,
  handleSaveTemplate,
  onOpenSettings,
  hasCustomKey,
  categories,
  models
}: ForgeGeneratorProps) {
  return (
    <section id="generator" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-5/12 space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-white tracking-tight">The Forge</h2>
              <p className="text-zinc-500 font-light">Configure your parameters and generate.</p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
              {/* Description Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Intent</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" title={hasCustomKey ? "Custom API key active" : "Using default API key"}>
                      <div className={`w-2 h-2 rounded-full ${hasCustomKey ? "bg-green-400" : "bg-zinc-600"}`} />
                      <span className="text-[10px] text-zinc-600">{hasCustomKey ? "Custom" : "Default"}</span>
                    </div>
                    <button
                      onClick={onOpenSettings}
                      className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      disabled={!description.trim()}
                      className="text-[10px] font-bold tracking-widest uppercase text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                    >
                      Save Template
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What are we building today?"
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all resize-none font-light leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={handleSmartEnhance}
                      disabled={isEnhancing || !description.trim()}
                      className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all disabled:opacity-50"
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

              {/* Category Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        category === cat.id
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                          : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/10"
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Model</label>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-300 appearance-none focus:outline-none focus:border-indigo-500/50"
                  >
                    {models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!description.trim() || isGenerating}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? "Forging..." : "Generate Prompt"}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-7/12 flex flex-col"
          >
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl flex flex-col h-full min-h-150px overflow-hidden">
              <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-600" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Output</span>
                </div>

                <div className="flex items-center gap-2">
                  {generatedPrompt && (
                    <>
                      <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Copy">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                      </button>
                      <button onClick={handleEvaluate} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-indigo-400" title="Evaluate">
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button onClick={() => setShowRefineInput(!showRefineInput)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500" title="Refine">
                        <Wand2 className="w-4 h-4" />
                      </button>
                      <button onClick={handleExport} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500" title="Export">
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showRefineInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 py-4 border-b border-white/5 bg-indigo-500/5"
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={refineInstruction}
                        onChange={(e) => setRefineInstruction(e.target.value)}
                        placeholder="Refine this prompt..."
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-700 focus:outline-none"
                      />
                      <button onClick={handleRefine} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Apply</button>
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
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500/40 mb-4" />
                      <p className="text-xs text-zinc-600 tracking-widest uppercase font-bold">Forging...</p>
                    </motion.div>
                  ) : generatedPrompt ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full"
                    >
                      <textarea
                        readOnly
                        value={generatedPrompt}
                        className="w-full h-full bg-transparent text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                      />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                      <Terminal className="w-16 h-16 text-zinc-500 mb-4" />
                      <p className="text-xs tracking-widest uppercase font-bold">Awaiting Input</p>
                    </div>
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
