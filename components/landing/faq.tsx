"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Key, Shield, Database, RefreshCw, Globe, CreditCard, Wallet, RotateCcw, FlaskConical } from "lucide-react";

const FAQS = [
  {
    question: "How does prompt generation work?",
    answer: "You describe what you want in natural language, and the AI transforms your intent into a structured, well-crafted prompt optimized for your target model. You can then refine it iteratively.",
    icon: RefreshCw,
  },
  {
    question: "Do I need my own API key?",
    answer: "Yes. PromptForge runs entirely in your browser and calls AI providers directly from the client. You supply your own API key for Gemini, Claude, GPT, or OpenCode — no data passes through any intermediary server.",
    icon: Key,
  },
  {
    question: "Is my data private?",
    answer: "Your prompts and API keys never leave your browser (except when sent directly to the AI provider you choose). Everything is stored in localStorage — there are no backend servers, no databases, and no user accounts.",
    icon: Shield,
  },
  {
    question: "How is PromptForge different from ChatGPT?",
    answer: "PromptForge is a dedicated prompt crafting workspace, not a chat interface. It provides structured evaluation, version history, template management, and iterative refinement tools that generic chat UIs don't offer.",
    icon: Globe,
  },
  {
    question: "Can I save and reuse my prompts?",
    answer: "Absolutely. Every generation is automatically saved to your history. You can save your best prompts as templates, organize them by category, and recall them anytime — all stored locally in your browser.",
    icon: Database,
  },
  {
    question: "How much does PromptForge cost?",
    answer: "Start with a 7-day free trial — no credit card required. After that, it's a one-time $5 purchase. Pay once, use forever. All future updates included. You still need your own API keys for the AI providers you use.",
    icon: CreditCard,
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital wallets through Stripe. Payment is processed securely — we never see or store your card details.",
    icon: Wallet,
  },
  {
    question: "What is the refund policy?",
    answer: "If PromptForge isn't right for you, contact us within 30 days for a full refund. No questions asked.",
    icon: RotateCcw,
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! Start with a 7-day free trial — no credit card needed. After the trial, PromptForge is a one-time $5 purchase. You'll need your own API keys from Gemini, Claude, GPT, or OpenCode to generate prompts.",
    icon: FlaskConical,
  },
];

function FAQItem({ question, answer, icon: Icon, isOpen, toggle }: {
  question: string;
  answer: string;
  icon: typeof Key;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-900/50 last:border-b-0">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 py-6 text-left group"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
          <Icon className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-base font-medium text-zinc-200 group-hover:text-white transition-colors">
            {question}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-14 text-sm text-zinc-400 font-light leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative z-10 py-28 md:py-36 px-6 md:px-8 border-t border-zinc-900/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left: heading */}
          <div className="md:w-[320px] shrink-0">
            <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-white mb-6 leading-[0.9]">
              FAQ.
            </h2>
            <p className="text-lg text-zinc-500 font-light tracking-tight">
              Quick answers to common questions.
            </p>
          </div>

          {/* Right: accordion list */}
          <div className="flex-1 min-w-0">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                icon={faq.icon}
                isOpen={openIndex === i}
                toggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
