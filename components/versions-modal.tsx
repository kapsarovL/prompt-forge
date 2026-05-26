"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, GitCommit, History } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: number;
}

interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: PromptVersion[];
  setGeneratedPrompt: (prompt: string) => void;
  showToast: (message: string) => void;
}

export function VersionsModal({ isOpen, onClose, versions, setGeneratedPrompt, showToast }: VersionsModalProps) {
  const { handleBackdropClick } = useModal(onClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Prompt versions" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <GitCommit className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Prompt Versions</h3>
                  <p className="text-xs text-zinc-500">Restore or compare previous iterations.</p>
                </div>
              </div>
              <button
                aria-label="Close versions"
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-4">
              {versions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-light">No versions saved yet.</p>
                </div>
              ) : (
                versions.map((v, i) => (
                  <div key={v.id} className="p-6 bg-black/40 border border-white/5 rounded-3xl hover:border-white/10 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                        Version {versions.length - i} • {new Date(v.timestamp).toLocaleTimeString()}
                      </span>
                      <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                        <button
                          aria-label="Copy version"
                          onClick={() => {
                            navigator.clipboard.writeText(v.prompt).catch(() => showToast("Copy failed"));
                            showToast("Copied!");
                          }}
                          className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          aria-label="Restore version"
                          onClick={() => {
                            setGeneratedPrompt(v.prompt);
                            onClose();
                          }}
                          className="text-[10px] font-bold tracking-widest uppercase text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 font-mono line-clamp-3 leading-relaxed">{v.prompt}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
