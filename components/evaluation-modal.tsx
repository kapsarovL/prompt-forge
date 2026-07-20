"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, BarChart, Loader2, AlertTriangle, CheckCircle2, Lightbulb, Zap } from "lucide-react";
import { EvaluationSkeleton } from "@/components/forge-skeleton";
import { useModal } from "@/hooks/use-modal";

interface EvaluationData {
  rating: number;
  criteria: {
    clarity: number;
    specificity: number;
    misinterpretationRisk: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEvaluating: boolean;
  evaluationResult: EvaluationData | null;
  evaluationError: string;
  handleAutoFix: () => Promise<void>;
  isAutoFixing: boolean;
}

export function EvaluationModal({
  isOpen,
  onClose,
  isEvaluating,
  evaluationResult,
  evaluationError,
  handleAutoFix,
  isAutoFixing
}: EvaluationModalProps) {
  const { handleBackdropClick } = useModal(onClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Prompt evaluation" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Prompt Evaluation</h3>
                  <p className="text-xs text-zinc-500">AI-driven analysis of your crafted prompt.</p>
                </div>
              </div>
              <button
                aria-label="Close evaluation"
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {isEvaluating ? (
                <EvaluationSkeleton />
              ) : evaluationError ? (
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl text-red-400 text-sm flex items-start">
                  <AlertTriangle className="w-5 h-5 mr-4 shrink-0" />
                  <span>{evaluationError}</span>
                </div>
              ) : evaluationResult ? (
                <div className="space-y-12">
                  {/* Score Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded-3xl">
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className={`text-4xl font-bold mb-1 block ${
                          evaluationResult.rating >= 8 ? 'text-emerald-400' :
                          evaluationResult.rating >= 5 ? 'text-amber-400' : 'text-red-400'
                        }`}
                      >
                        {evaluationResult.rating}
                      </motion.span>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">Score</div>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                      {[
                        { label: "Clarity", val: evaluationResult.criteria.clarity },
                        { label: "Specificity", val: evaluationResult.criteria.specificity },
                        { label: "Risk", val: evaluationResult.criteria.misinterpretationRisk, invert: true }
                      ].map((c, i) => (
                        <div key={i} className="p-4 bg-black/20 border border-white/5 rounded-2xl text-center">
                          <div className="text-xl font-bold text-white mb-1">{c.val}<span className="text-[10px] text-zinc-700">/10</span></div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">{c.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Strengths
                      </h4>
                      <div className="space-y-3">
                        {evaluationResult.strengths.map((s, i) => (
                          <div key={i} className="text-sm text-zinc-400 font-light leading-relaxed flex gap-3">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Weaknesses
                      </h4>
                      <div className="space-y-3">
                        {evaluationResult.weaknesses.map((w, i) => (
                          <div key={i} className="text-sm text-zinc-400 font-light leading-relaxed flex gap-3">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Optimization Path
                      </h4>
                      <button
                        onClick={handleAutoFix}
                        disabled={isAutoFixing}
                        className="px-4 py-2 bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isAutoFixing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        Auto-Fix
                      </button>
                    </div>
                    <div className="space-y-3">
                      {evaluationResult.suggestions.map((s, i) => (
                        <div key={i} className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-3xl text-sm text-zinc-300 font-light leading-relaxed">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
