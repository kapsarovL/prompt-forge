"use client";

import { motion } from "motion/react";
import { Sparkles, Wand2, Loader2, X, ChevronDown, Cpu, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Provider } from "@/lib/types";
import { sectionVariants } from "@/components/forge-generator-variants";

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

interface InputPanelProps {
  description: string;
  setDescription: (desc: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  model: string;
  setModel: (model: string) => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  handleGenerate: () => Promise<void>;
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
}

const PROVIDERS: { id: Provider; label: string; Icon: typeof Cpu | typeof Bot }[] = [
  { id: "gemini", label: "Gemini", Icon: Cpu },
  { id: "opencode", label: "OpenCode", Icon: Bot },
  { id: "anthropic", label: "Anthropic", Icon: Cpu },
  { id: "codex", label: "Codex", Icon: Bot },
];

export function InputPanel(props: InputPanelProps) {
  const {
    description, setDescription,
    category, setCategory,
    model, setModel,
    isGenerating, isEnhancing,
    handleGenerate, handleSmartEnhance, handleSaveTemplate,
    onOpenSettings,
    hasCustomKey, hasApiKey,
    categories, models,
    provider, setProvider,
    opencodeModel, onSetOpencodeModel,
    anthropicModel, onSetAnthropicModel,
    codexModel, onSetCodexModel,
  } = props;

  return (
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
        <div className="relative group/dropdown">
          <select
            id="model"
            value={provider === "opencode" ? opencodeModel : provider === "anthropic" && anthropicModel ? anthropicModel : provider === "codex" && codexModel ? codexModel : model}
            onChange={(e) => {
              const val = e.target.value;
              if (provider === "opencode") {
                onSetOpencodeModel(val);
              } else if (provider === "anthropic" && onSetAnthropicModel) {
                onSetAnthropicModel(val);
              } else if (provider === "codex" && onSetCodexModel) {
                onSetCodexModel(val);
              } else {
                setModel(val);
              }
            }}
            className="w-full bg-gradient-to-b from-zinc-800/60 to-black/40 border border-white/10 rounded-xl px-4 py-3 pr-10 text-xs text-zinc-200 appearance-none focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)] hover:border-white/20 transition-all cursor-pointer"
          >
            {models.map(m => (
              <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-200">{m.label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none transition-colors duration-200 group-focus-within/dropdown:text-amber-400 text-zinc-600">
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover/dropdown:scale-110" />
          </div>
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
  );
}
