"use client";

import { motion } from "motion/react";
import { Search, ArrowRight, Copy, Trash2, Archive } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PromptHistory {
  id: string;
  description: string;
  category: string;
  model: string;
  prompt: string;
  timestamp: number;
}

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface ForgeVaultProps {
  history: PromptHistory[];
  historySearch: string;
  setHistorySearch: (search: string) => void;
  visibleHistoryCount: number;
  setVisibleHistoryCount: (count: (prev: number) => number) => void;
  handleRecall: (item: PromptHistory) => void;
  handleDeleteHistory: (id: string) => void;
  handleClearAllHistory: () => void;
  categories: Category[];
  showToast: (message: string) => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function ForgeVault(props: ForgeVaultProps) {
  const {
    history, historySearch, setHistorySearch,
    visibleHistoryCount, setVisibleHistoryCount,
    handleRecall, handleDeleteHistory, handleClearAllHistory,
    categories, showToast,
  } = props;

  const filteredHistory = history.filter(item => {
    const searchLower = historySearch.toLowerCase();
    const categoryLabel = categories.find(c => c.id === item.category)?.label.toLowerCase() || "";
    return (
      item.description.toLowerCase().includes(searchLower) ||
      categoryLabel.includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  const getCategoryIcon = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.icon || Archive;
  };

  const getCategoryLabel = (catId: string) => {
    return categories.find(c => c.id === catId)?.label || catId;
  };

  return (
    <section id="history" className="py-24 px-6 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-wide">
              <span className="bg-linear-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Vault
              </span>
            </h2>
            <p className="text-zinc-500 font-light">Your previously engineered prompts.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <label htmlFor="history-search" className="sr-only">Search history</label>
              <input
                id="history-search"
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                className="bg-black/30 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_16px_-8px_rgba(245,158,11,0.25)] transition-all w-64"
              />
            </div>
            <button
              onClick={handleClearAllHistory}
              className="text-[10px] font-bold tracking-widest uppercase text-zinc-600 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>
        </motion.div>

        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="py-24 text-center bg-zinc-900/20 border border-white/5 rounded-3xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center mx-auto mb-6">
              <Archive className="w-9 h-9 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium mb-1">Your vault is empty</p>
            <p className="text-sm text-zinc-700 font-light">
              {historySearch ? "No results match your search." : "Generated prompts will appear here."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredHistory.slice(0, visibleHistoryCount).map((item) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/15 hover:bg-zinc-900/50 transition-all group hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_rgba(245,158,11,0.08)]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/5 text-zinc-500 rounded-md flex items-center gap-1.5">
                        <Icon className="w-3 h-3" />
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md">
                        {item.model.split('-')[1] || item.model}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-light leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <button onClick={() => handleRecall(item)} className="text-[10px] font-bold tracking-widest uppercase text-amber-400 hover:text-amber-300 flex items-center gap-2 group/recall">
                      Recall <ArrowRight className="w-3 h-3 transition-transform group-hover/recall:translate-x-0.5" />
                    </button>
                    <div className="flex gap-3 opacity-30 group-hover:opacity-100 transition-all duration-300">
                      <button aria-label="Copy prompt" onClick={() => {
                        navigator.clipboard.writeText(item.prompt).catch(() => showToast("Copy failed"));
                        showToast("Copied!");
                      }} className="text-zinc-600 hover:text-zinc-300 hover:bg-white/5 p-1.5 rounded-lg transition-all"><Copy className="w-3.5 h-3.5" /></button>
                      <button aria-label="Delete item" onClick={() => handleDeleteHistory(item.id)} className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {filteredHistory.length > visibleHistoryCount && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => setVisibleHistoryCount(prev => prev + 6)}
              className="px-8 py-3 bg-zinc-900 text-zinc-400 text-xs font-bold rounded-xl border border-white/5 hover:bg-zinc-800 hover:border-amber-500/20 hover:text-zinc-200 transition-all active:scale-95"
            >
              Load More ({filteredHistory.length - visibleHistoryCount} remaining)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
