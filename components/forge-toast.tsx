"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, X } from "lucide-react";

interface ForgeToastProps {
  toast: { message: string; type: 'success' | 'info' } | null;
  onClose: () => void;
}

export function ForgeToast({ toast, onClose }: ForgeToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50"
        >
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          )}
          <p className="text-sm font-medium text-zinc-200 pr-2">{toast.message}</p>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
