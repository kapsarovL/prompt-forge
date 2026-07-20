"use client";

import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check, Sparkles, Wand2, Download, Loader2, History, ArrowRight } from "lucide-react";
import { OutputPanelSkeleton } from "@/components/forge-skeleton";
import { sectionVariants } from "@/components/forge-generator-variants";

interface OutputPanelProps {
  generatedPrompt: string;
  copied: boolean;
  isGenerating: boolean;
  isRefining: boolean;
  showRefineInput: boolean;
  setShowRefineInput: (show: boolean) => void;
  refineInstruction: string;
  setRefineInstruction: (instr: string) => void;
  handleCopy: () => void;
  handleEvaluate: () => Promise<void>;
  handleRefine: () => Promise<void>;
  handleExport: () => void;
  onOpenVersions: () => void;
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

export function OutputPanel(props: OutputPanelProps) {
  const {
    generatedPrompt, copied,
    isGenerating, isRefining,
    showRefineInput, setShowRefineInput,
    refineInstruction, setRefineInstruction,
    handleCopy, handleEvaluate, handleRefine, handleExport,
    onOpenVersions,
  } = props;

  return (
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

        {/* Toolbar */}
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

        {/* Refine Bar */}
        <AnimatePresence>
          {showRefineInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
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

        {/* Content */}
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
  );
}
