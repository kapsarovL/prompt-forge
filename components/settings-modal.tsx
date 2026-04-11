"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => Promise<boolean>;
  onClearKey: () => void;
  hasCustomKey: boolean;
}

export function SettingsModal({ isOpen, onClose, onSaveKey, onClearKey, hasCustomKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    setStatus(null);

    const success = await onSaveKey(apiKey.trim());
    setIsSaving(false);

    if (success) {
      setStatus({ type: "success", message: "API key saved and validated successfully." });
      setApiKey("");
    } else {
      setStatus({ type: "error", message: "Failed to validate API key. Please check and try again." });
    }
  };

  const handleClose = () => {
    setApiKey("");
    setShowKey(false);
    setStatus(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API Settings</h3>
                  <p className="text-xs text-zinc-500">Manage your Gemini API key.</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {/* Status indicator */}
              {hasCustomKey && !status && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <p className="text-sm text-green-300">Custom API key is active.</p>
                </div>
              )}
              {!hasCustomKey && !status && (
                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 text-zinc-500 shrink-0" />
                  <p className="text-sm text-zinc-400">Using default environment API key.</p>
                </div>
              )}

              {/* Status messages */}
              {status && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                  status.type === "success"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}>
                  {status.type === "success"
                    ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  }
                  <p className={`text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>
                    {status.message}
                  </p>
                </div>
              )}

              {/* API Key Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && apiKey.trim() && !isSaving) handleSave();
                    }}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-600">
                  Your key is stored locally and never sent anywhere except Google's Gemini API.
                  Get one at{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim() || isSaving}
                  className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isSaving ? "Validating..." : "Save & Validate"}
                </button>
                {hasCustomKey && (
                  <button
                    onClick={() => {
                      onClearKey();
                      setStatus({ type: "success", message: "Custom API key removed. Using default." });
                    }}
                    className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
