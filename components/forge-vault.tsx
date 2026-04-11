"use client";

import { History, Search, ArrowRight, Copy, Trash2 } from "lucide-react";

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
  icon: any;
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

export function ForgeVault({
  history,
  historySearch,
  setHistorySearch,
  visibleHistoryCount,
  setVisibleHistoryCount,
  handleRecall,
  handleDeleteHistory,
  handleClearAllHistory,
  categories,
  showToast
}: ForgeVaultProps) {
  const filteredHistory = history.filter(item => {
    const searchLower = historySearch.toLowerCase();
    const categoryLabel = categories.find(c => c.id === item.category)?.label.toLowerCase() || "";
    return (
      item.description.toLowerCase().includes(searchLower) ||
      categoryLabel.includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section id="history" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-white tracking-tight">Vault</h2>
            <p className="text-zinc-500 font-light">Your previously engineered prompts.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                className="bg-zinc-900/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 w-64"
              />
            </div>
            <button
              onClick={handleClearAllHistory}
              className="text-[10px] font-bold tracking-widest uppercase text-zinc-600 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-20 text-center bg-zinc-900/20 border border-white/5 rounded-3xl">
            <History className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-light">No history found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.slice(0, visibleHistoryCount).map((item) => (
              <div key={item.id} className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/5 text-zinc-500 rounded-md">
                      {categories.find(c => c.id === item.category)?.label || item.category}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md">
                      {item.model.split('-')[1]}
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
                  <button onClick={() => handleRecall(item)} className="text-[10px] font-bold tracking-widest uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                    Recall <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                      navigator.clipboard.writeText(item.prompt);
                      showToast("Copied!");
                    }} className="text-zinc-600 hover:text-zinc-300"><Copy className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteHistory(item.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredHistory.length > visibleHistoryCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleHistoryCount(prev => prev + 6)}
              className="px-8 py-3 bg-zinc-900 text-zinc-400 text-xs font-bold rounded-xl border border-white/5 hover:bg-zinc-800 transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
