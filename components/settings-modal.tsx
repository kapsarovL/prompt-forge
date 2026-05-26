"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2, Trash2, Cpu, Globe } from "lucide-react";
import { OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";
import { useModal } from "@/hooks/use-modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGeminiKey: (key: string) => Promise<boolean>;
  onClearGeminiKey: () => void;
  hasGeminiKey: boolean;
  onSaveOpenCodeKey: (key: string) => Promise<boolean>;
  onClearOpenCodeKey: () => void;
  hasOpenCodeKey: boolean;
  opencodeModel: string;
  onSetOpencodeModel: (model: string) => void;
  opencodeBaseUrl: string;
  onSetOpencodeBaseUrl: (url: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSaveGeminiKey,
  onClearGeminiKey,
  hasGeminiKey,
  onSaveOpenCodeKey,
  onClearOpenCodeKey,
  hasOpenCodeKey,
  opencodeModel,
  onSetOpencodeModel,
  opencodeBaseUrl,
  onSetOpencodeBaseUrl,
}: SettingsModalProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isSavingGemini, setIsSavingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [opencodeKey, setOpencodeKey] = useState("");
  const [showOpencodeKey, setShowOpencodeKey] = useState(false);
  const [isSavingOpenCode, setIsSavingOpenCode] = useState(false);
  const [opencodeStatus, setOpencodeStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [modelInput, setModelInput] = useState(opencodeModel);
  const [baseUrlInput, setBaseUrlInput] = useState(opencodeBaseUrl);

  const handleSaveGemini = async () => {
    if (!geminiKey.trim()) return;
    setIsSavingGemini(true);
    setGeminiStatus(null);
    const success = await onSaveGeminiKey(geminiKey.trim());
    setIsSavingGemini(false);
    if (success) {
      setGeminiStatus({ type: "success", message: "Gemini API key saved and validated." });
      setGeminiKey("");
    } else {
      setGeminiStatus({ type: "error", message: "Failed to validate Gemini API key." });
    }
  };

  const handleSaveOpenCode = async () => {
    if (!opencodeKey.trim()) return;
    setIsSavingOpenCode(true);
    setOpencodeStatus(null);
    const success = await onSaveOpenCodeKey(opencodeKey.trim());
    setIsSavingOpenCode(false);
    if (success) {
      setOpencodeStatus({ type: "success", message: "OpenCode API key saved and validated." });
      onSetOpencodeModel(modelInput.trim() || "opencode/big-pickle");
      onSetOpencodeBaseUrl(baseUrlInput.trim() || OPENCODE_DEFAULT_BASE_URL);
      setOpencodeKey("");
    } else {
      setOpencodeStatus({ type: "error", message: "Failed to validate OpenCode API key." });
    }
  };

  const handleClose = () => {
    setGeminiKey("");
    setShowGeminiKey(false);
    setGeminiStatus(null);
    setOpencodeKey("");
    setShowOpencodeKey(false);
    setOpencodeStatus(null);
    setModelInput(opencodeModel);
    setBaseUrlInput(opencodeBaseUrl);
    onClose();
  };

  const { handleBackdropClick } = useModal(handleClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="API settings" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API Settings</h3>
                  <p className="text-xs text-zinc-500">Manage your provider API keys.</p>
                </div>
              </div>
              <button
                aria-label="Close settings"
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
              {/* ===== Gemini Section ===== */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Key className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Google Gemini</h4>
                    <p className="text-[10px] text-zinc-500">Primary prompt generation provider</p>
                  </div>
                </div>

                {/* Status */}
                {hasGeminiKey && !geminiStatus && (
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-sm text-green-300">Custom Gemini API key is active.</p>
                  </div>
                )}
                {!hasGeminiKey && !geminiStatus && (
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-zinc-500 shrink-0" />
                    <p className="text-sm text-zinc-400">Using default environment Gemini API key.</p>
                  </div>
                )}
                {geminiStatus && (
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                    geminiStatus.type === "success"
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}>
                    {geminiStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
                    <p className={`text-sm ${geminiStatus.type === "success" ? "text-green-300" : "text-red-300"}`}>{geminiStatus.message}</p>
                  </div>
                )}

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSaveGemini(); }}
                  className="space-y-3"
                >
                  <label htmlFor="gemini-api-key" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">API Key</label>
                  <div className="relative">
                    <input
                      id="gemini-api-key"
                      name="gemini-api-key"
                      type={showGeminiKey ? "text" : "password"}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIza..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                    />
                    <button
                      type="button"
                      aria-label={showGeminiKey ? "Hide Gemini key" : "Show Gemini key"}
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Get one at{" "}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                      Google AI Studio
                    </a>
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!geminiKey.trim() || isSavingGemini}
                      className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
                    >
                      {isSavingGemini ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {isSavingGemini ? "Validating..." : "Save & Validate"}
                    </button>
                    {hasGeminiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Clear your Gemini API key?")) return;
                          onClearGeminiKey();
                          setGeminiStatus({ type: "success", message: "Custom Gemini API key removed. Using default." });
                        }}
                        className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* ===== OpenCode Section ===== */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">OpenCode</h4>
                    <p className="text-[10px] text-zinc-500">Alternative provider via Zen API</p>
                  </div>
                </div>

                {/* Status */}
                {hasOpenCodeKey && !opencodeStatus && (
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-sm text-green-300">OpenCode API key is active.</p>
                  </div>
                )}
                {!hasOpenCodeKey && !opencodeStatus && (
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-zinc-500 shrink-0" />
                    <p className="text-sm text-zinc-400">No OpenCode API key configured.</p>
                  </div>
                )}
                {opencodeStatus && (
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                    opencodeStatus.type === "success"
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}>
                    {opencodeStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
                    <p className={`text-sm ${opencodeStatus.type === "success" ? "text-green-300" : "text-red-300"}`}>{opencodeStatus.message}</p>
                  </div>
                )}

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSaveOpenCode(); }}
                  className="space-y-3"
                >
                  <label htmlFor="opencode-api-key" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">API Key</label>
                  <div className="relative">
                    <input
                      id="opencode-api-key"
                      name="opencode-api-key"
                      type={showOpencodeKey ? "text" : "password"}
                      value={opencodeKey}
                      onChange={(e) => setOpencodeKey(e.target.value)}
                      placeholder="oc_..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                    />
                    <button
                      type="button"
                      aria-label={showOpencodeKey ? "Hide OpenCode key" : "Show OpenCode key"}
                      onClick={() => setShowOpencodeKey(!showOpencodeKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showOpencodeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Your OpenCode Zen API key. Get one at{" "}
                    <a href="https://opencode.ai/zen" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                      opencode.ai/zen
                    </a>
                  </p>

                  {/* Model Selection */}
                  <div className="space-y-3">
                    <label htmlFor="opencode-model" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Model</label>
                    <input
                      id="opencode-model"
                      name="opencode-model"
                      type="text"
                      value={modelInput}
                      onChange={(e) => setModelInput(e.target.value)}
                      placeholder="opencode/big-pickle"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                    />
                    <p className="text-xs text-zinc-600">
                      The model ID used when OpenCode is the active provider.
                    </p>
                  </div>

                  {/* Base URL */}
                  <div className="space-y-3">
                    <label htmlFor="opencode-base-url" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Base URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <input
                        id="opencode-base-url"
                        name="opencode-base-url"
                        type="text"
                        value={baseUrlInput}
                        onChange={(e) => setBaseUrlInput(e.target.value)}
                        placeholder={OPENCODE_DEFAULT_BASE_URL}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                      />
                    </div>
                    <p className="text-xs text-zinc-600">
                      The API endpoint URL. Leave as default for OpenCode Zen.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!opencodeKey.trim() || isSavingOpenCode}
                      className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
                    >
                      {isSavingOpenCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {isSavingOpenCode ? "Validating..." : "Save & Validate"}
                    </button>
                    {hasOpenCodeKey && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Clear your OpenCode API key?")) return;
                          onClearOpenCodeKey();
                          setOpencodeStatus({ type: "success", message: "OpenCode API key removed." });
                        }}
                        className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
