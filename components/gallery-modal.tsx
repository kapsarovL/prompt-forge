"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Library, Search, ChevronDown, Trash2, Copy, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface Template {
  text: string;
  category: string;
  isCustom: boolean;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallerySearch: string;
  setGallerySearch: (search: string) => void;
  galleryCategory: string;
  setGalleryCategory: (category: string) => void;
  filteredTemplates: Template[];
  categories: Category[];
  setDescription: (desc: string) => void;
  setCategory: (cat: string) => void;
  handleDeleteTemplate: (e: React.MouseEvent, template: string, catId: string) => void;
  showToast: (message: string) => void;
}

export function GalleryModal({
  isOpen,
  onClose,
  gallerySearch,
  setGallerySearch,
  galleryCategory,
  setGalleryCategory,
  filteredTemplates,
  categories,
  setDescription,
  setCategory,
  handleDeleteTemplate,
  showToast
}: GalleryModalProps) {
  const { handleBackdropClick } = useModal(onClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Template gallery" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <Library className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Template Gallery</h3>
                  <p className="text-xs text-zinc-500">Curated starting points for your next project.</p>
                </div>
              </div>
              <button
                aria-label="Close gallery"
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6 border-b border-white/5 bg-black/10 flex flex-col sm:flex-row gap-4 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <label htmlFor="gallery-search" className="sr-only">Search templates</label>
                <input
                  id="gallery-search"
                  name="gallery-search"
                  type="text"
                  placeholder="Search templates..."
                  value={gallerySearch}
                  onChange={e => setGallerySearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
              <div className="relative group/dropdown">
                <label htmlFor="gallery-category" className="sr-only">Category filter</label>
                <select
                  id="gallery-category"
                  name="gallery-category"
                  value={galleryCategory}
                  onChange={e => setGalleryCategory(e.target.value)}
                  className="bg-gradient-to-b from-zinc-800/60 to-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)] hover:border-white/20 transition-all min-w-[140px] cursor-pointer"
                >
                  <option value="all" className="bg-zinc-900 text-zinc-200">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">{c.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none transition-colors duration-200 group-focus-within/dropdown:text-amber-400 text-zinc-600">
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover/dropdown:scale-110" />
                </div>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-zinc-950/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((t, i) => (
                  <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/5 text-zinc-500 rounded-md">
                        {categories.find(c => c.id === t.category)?.label}
                      </span>
                      {t.isCustom && (
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 flex-1 mb-6 leading-relaxed font-light">{t.text}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        {t.isCustom && (
                          <button
                            aria-label="Delete template"
                            onClick={(e) => handleDeleteTemplate(e, t.text, t.category)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          aria-label="Copy template"
                          onClick={() => {
                            navigator.clipboard.writeText(t.text).catch(() => showToast("Copy failed"));
                            showToast("Copied!");
                          }}
                          className="text-zinc-600 hover:text-zinc-300 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setDescription(t.text);
                          setCategory(t.category);
                          onClose();
                        }}
                        className="text-[10px] font-bold tracking-widest uppercase text-amber-400 hover:text-amber-300 flex items-center gap-2"
                      >
                        Use <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <Library className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600 font-light">No templates found.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
