"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquarePlus, Check, Star } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackSubmitted: boolean;
  feedbackRating: number;
  setFeedbackRating: (rating: number) => void;
  feedbackComment: string;
  setFeedbackComment: (comment: string) => void;
  handleFeedbackSubmit: () => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  feedbackSubmitted,
  feedbackRating,
  setFeedbackRating,
  feedbackComment,
  setFeedbackComment,
  handleFeedbackSubmit
}: FeedbackModalProps) {
  const { handleBackdropClick } = useModal(onClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Feedback" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <MessageSquarePlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Feedback</h3>
                  <p className="text-xs text-zinc-500">Help us improve the forge.</p>
                </div>
              </div>
              <button
                aria-label="Close feedback"
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {feedbackSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Forged with Love</h4>
                  <p className="text-sm text-zinc-500 font-light">Your feedback has been recorded.</p>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => setFeedbackRating(star)}
                        className={`p-2 transition-all hover:scale-110 ${
                          feedbackRating >= star ? "text-amber-400" : "text-zinc-600"
                        }`}
                      >
                        <Star className="w-8 h-8" fill={feedbackRating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>

                  <label htmlFor="feedback-comment" className="sr-only">Feedback comment</label>
                  <textarea
                    id="feedback-comment"
                    name="feedback-comment"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="What can we improve?"
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all resize-none font-light"
                  />

                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={feedbackRating === 0 && !feedbackComment.trim()}
                    className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
