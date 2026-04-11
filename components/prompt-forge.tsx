"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Copy, Check, Loader2, Wand2, Terminal, PenTool, BarChart, MessageSquare, History, Trash2, ArrowRight, Download, MessageSquarePlus, Star, X, Save, GitCommit, BookmarkPlus, Library, Search, CheckCircle2, AlertTriangle, Lightbulb, Zap, Shield, Cpu, ChevronDown } from "lucide-react";
import { ForgeNavbar } from "@/components/forge-navbar";
import { ForgeFooter } from "@/components/forge-footer";
import { ForgeHero } from "@/components/forge-hero";
import { ForgeFeatures } from "@/components/forge-features";
import { ForgeGenerator } from "@/components/forge-generator";
import { ForgeVault } from "@/components/forge-vault";
import { ForgeToast } from "@/components/forge-toast";
import { VersionsModal } from "@/components/versions-modal";
import { GalleryModal } from "@/components/gallery-modal";
import { EvaluationModal } from "@/components/evaluation-modal";
import { FeedbackModal } from "@/components/feedback-modal";

interface EvaluationData {
  rating: number;
  criteria: {
    clarity: number;
    specificity: number;
    misinterpretationRisk: number;
  };
  strength: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface PromptHistory {
  id: string;
  description: string;
  category: string;
  model: string;
  prompt: string;
  timestamp: number;
}

interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: number;
}

const CATEGORIES = [
  { id: "coding", label: "Coding", icon: Terminal, description: "Software development, debuging, and architecture" },
  { id: "creative", label: "Creative", icon: PenTool, description: "Writing, storytelling, and content creation" },
  { id: "analysis", label: "Analysis", icon: BarChart, description: "Data interpretation, research, and summaries" },
  { id: "general", label: "General", icon: MessageSquare, description: "Everyday tasks, Q&A, and general assistance" },
];

const MODELS = [
  { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview", description: "Frontier reasoning, latest generation" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Complex reasoning, deep analysis" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Fast responses, high-volume" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", description: "Lowest latency, lightest tasks" },
];

const TEMPLATES: Record<string, string[]> = {
  coding: [
    "Build a React hook that debounces API calls with retry logic",
    "Write a Python script to scrape a website and save data to CSV",
    "Explain the difference between useMemo and useCallback with examples"
  ],
  creative: [
    "Write a sci-fi short story about a time traveler who is always 5 minutes late",
    "Create marketing copy for a new eco-friendly coffee brand",
    "Write a poem about the ocean in the style of Edgar Allan Poe"
  ],
  analysis: [
    "Summarize the key findings of a quarterly earnings report",
    "Analyze the pros and cons of migrating from REST to GraphQL",
    "Extract the main entities and their relationships from a legal contract"
  ],
  general: [
    "Draft a polite email declining a job offer",
    "Plan a 5-day itinerary for a trip to Tokyo",
    "Explain quantum computing to a 5-year-old"
  ]
};

export function PromptForge() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [model, setModel] = useState(MODELS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // History state
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(6);

  // Versions state
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  // Custom templates state
  const [customTemplates, setCustomTemplates] = useState<Record<string, string[]>>({});

  // Gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("all");

  // Feedback state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Evaluate state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationData | null>(null);
  const [evaluationError, setEvaluationError] = useState("");
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  // Refine state
  const [isRefining, setIsRefining] = useState(false);
  const [showRefineInput, setShowRefineInput] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load initial data from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem("promptforge_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }

    const savedCustomTemplates = localStorage.getItem("promptforge_custom_templates");
    if (savedCustomTemplates) {
      try {
        setCustomTemplates(JSON.parse(savedCustomTemplates));
      } catch (e) {}
    }

    const savedVersions = localStorage.getItem("promptforge_versions");
    if (savedVersions) {
      try {
        setVersions(JSON.parse(savedVersions));
      } catch (e) {}
    }
  }, []);

  // Persist data to local storage
  useEffect(() => {
    localStorage.setItem("promptforge_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("promptforge_custom_templates", JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem("promptforge_versions", JSON.stringify(versions));
  }, [versions]);

  const handleSmartEnhance = async () => {
      if (!description.trim()) return;
      setIsEnhancing(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("API key missing");
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: `Enhance this short prompt description to be more detailed and clear for a prompt engineer. Keep it under 200 characters. Original: "${description}"`,
          config: {
            systemInstruction: "You are a writing assistant. Expand vague descriptions into clear, detailed instructions. Return ONLY the enhanced text.",
            temperature: 0.7,
          }
        });
        if (response.text) {
          setDescription(response.text.trim());
          showToast("Description enhanced!", "info");
        }
      } catch (err) {
        console.error(err);
        showToast("Enhancement failed", "info");
      } finally {
        setIsEnhancing(false);
      }
    };

  const handleAutoFix = async () => {
      if (!generatedPrompt || !evaluationResult) return;
      setIsAutoFixing(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("API key missing");
        const ai = new GoogleGenAI({ apiKey });

        const maxRetries = 3;
        let response;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: model,
              contents: `Original Prompt:\n${generatedPrompt}\n\nEvaluation Weaknesses:\n${evaluationResult.weaknesses.join("\n")}\n\nEvaluation Suggestions:\n${evaluationResult.suggestions.join("\n")}`,
              config: {
                systemInstruction: "You are an expert prompt engineer. Rewrite the provided prompt to address all identified weaknesses and incorporate all suggestions. Return ONLY the improved prompt text.",
                temperature: 0.4,
              }
            });
            break;
          } catch (err: any) {
            const isRetryable = err?.status === 503 || err?.status === 429;
            if (!isRetryable || attempt === maxRetries - 1) throw err;
            await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          }
        }

        if (response?.text) {
          const newPrompt = response.text.trim();
          setGeneratedPrompt(newPrompt);
          setIsEvaluationOpen(false);
          showToast("Prompt optimized based on evaluation!", "success");

          const newVersion: PromptVersion = {
            id: Math.random().toString(36).substring(2),
            prompt: newPrompt,
            timestamp: Date.now(),
          };
          setVersions(prev => [newVersion, ...prev].slice(0, 20));

          const newHistoryItem: PromptHistory = {
            id: Math.random().toString(36).substring(2),
            description: description + " (Auto-Optimized)",
            category,
            model,
            prompt: newPrompt,
            timestamp: Date.now(),
          };
          setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error(err);
        showToast("Auto-fix failed", "info");
      } finally {
        setIsAutoFixing(false);
      }
    };

  const handleGenerate = async () => {
      if (!description.trim()) return;

      setIsGenerating(true);
      setError("");
      setGeneratedPrompt("");

      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Gemini API key is missing. Please configure it in the environment variables.");
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are PromptForge, an expert prompt engineer for Google Gemini models.
  Your job is to transform short natural language descriptions into precise, highly optimized prompts.

  Rules:
  - Return ONLY the optimized prompt — no preamble, no explanation, no markdown wrapping
  - Tailor the prompt to the selected category and model capabilities
  - Use clear structure: role, context, task, constraints, output format when appropriate
  - For code prompts: specify language, expected output, edge cases
  - For creative prompts: set tone, style, constraints
  - For analysis prompts: define scope, output format, depth
  - Keep prompts sharp and actionable — no fluff
  - If the input is already detailed, enhance and restructure it; if vague, expand it intelligently`;

        const promptText = `Category: ${category}\nDescription: ${description}`;

        const maxRetries = 3;
        let response;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: model,
              contents: promptText,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });
            break;
          } catch (err: any) {
            const isRetryable = err?.status === 503 || err?.status === 429;
            if (!isRetryable || attempt === maxRetries - 1) throw err;
            await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          }
        }

        if (response?.text) {
          const promptText = response.text.trim();
          setGeneratedPrompt(promptText);

          const newVersion: PromptVersion = {
            id: Math.random().toString(36).substring(2),
            prompt: promptText,
            timestamp: Date.now(),
          };
          setVersions(prev => [newVersion, ...prev].slice(0, 20));

          const newHistoryItem: PromptHistory = {
            id: Math.random().toString(36).substring(2),
            description,
            category,
            model,
            prompt: promptText,
            timestamp: Date.now(),
          };
          setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
        } else {
          throw new Error("No response generated from the model.");
        }
      } catch (err: any) {
        console.error("Error generating prompt:", err);
        const message = err?.status === 503
          ? "The service is temporarily unavailable. Please try again in a moment."
          : err?.status === 429
          ? "API quota exceeded. Please check your Gemini API key and billing, or try a different model."
          : err.message || "An unexpected error occurred while generating the prompt.";
        setError(message);
      } finally {
        setIsGenerating(false);
      }
  };

  const handleCopy = () => {
      if (!generatedPrompt) return;
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleRecall = (item: PromptHistory) => {
      setDescription(item.description);
      setCategory(item.category);
      setModel(item.model);
      setGeneratedPrompt(item.prompt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteHistory = (id: string) => {
      setHistory(prev => prev.filter(item => item.id !== id));
    };

    const handleSaveVersion = () => {
      if (!generatedPrompt) return;
      const newVersion: PromptVersion = {
        id: Math.random().toString(36).substring(2),
        prompt: generatedPrompt,
        timestamp: Date.now(),
      };
      setVersions(prev => [newVersion, ...prev].slice(0, 20));
    };

    const handleExport = () => {
      if (!generatedPrompt) return;

      const element = document.createElement("a");
      const file = new Blob([generatedPrompt], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `promptforge-${category}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showToast("Prompt exported successfully!");
    };

    const handleEvaluate = async () => {
      if (!generatedPrompt) return;

      setIsEvaluating(true);
      setEvaluationResult(null);
      setEvaluationError("");
      setIsEvaluationOpen(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Gemini API key is missing.");
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are a Prompt Quality Evaluator specializing in Google Gemini models.
  Your job is to analyze the provided prompt based on three key criteria:
  1. Clarity: How easy is it for the model to understand the core intent?
  2. Specificity: Does the prompt provide enough detail, context, and constraints?
  3. Misinterpretation Risk: Are there ambiguous terms or conflicting instructions that could lead to unexpected results?

  Provide a score from 1-10 for each criterion and an overall rating. Give constructive, actionable feedback.`;

        const maxRetries = 3;
        let lastError: any;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: model,
              contents: `Evaluate this prompt for a Gemini model:\n\n${generatedPrompt}`,
              config: {
                systemInstruction,
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    rating: { type: Type.NUMBER, description: "Overall rating out of 10" },
                    criteria: {
                      type: Type.OBJECT,
                      properties: {
                        clarity: { type: Type.NUMBER, description: "Clarity score 1-10" },
                        specificity: { type: Type.NUMBER, description: "Specificity score 1-10" },
                        misinterpretationRisk: { type: Type.NUMBER, description: "Risk of misinterpretation 1-10 (10 is high risk, 1 is low risk)" }
                      },
                      required: ["clarity", "specificity", "misinterpretationRisk"]
                    },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Identify 1-3 strengths" },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Identify 1-3 weaknesses or missing context" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggest 1-3 specific improvements" }
                  },
                  required: ["rating", "criteria", "strengths", "weaknesses", "suggestions"]
                }
              },
            });

            if (response.text) {
              try {
                const parsed = JSON.parse(response.text.trim());
                setEvaluationResult(parsed);
              } catch (e) {
                setEvaluationError("Failed to parse evaluation results.");
              }
            } else {
              setEvaluationError("Could not evaluate the prompt.");
            }
            return; // success
          } catch (err: any) {
            lastError = err;
            const isRetryable = err?.status === 503 || err?.status === 429;
            if (!isRetryable || attempt === maxRetries - 1) throw err;
            await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          }
        }
      } catch (err: any) {
        console.error("Error evaluating prompt:", err);
        const message = err?.status === 503
          ? "The service is temporarily unavailable. Please try again in a moment."
          : err?.status === 429
          ? "API quota exceeded. Please check your Gemini API key and billing, or try a different model."
          : "An error occurred while evaluating the prompt.";
        setEvaluationError(message);
      } finally {
        setIsEvaluating(false);
      }
    };

    const handleRefine = async () => {
        if (!generatedPrompt || !refineInstruction.trim()) return;

        setIsRefining(true);

        try {
          const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          if (!apiKey) {
            throw new Error("Gemini API key is missing.");
          }

          const ai = new GoogleGenAI({ apiKey });

          const systemInstruction = `You are an expert prompt editor. Modify the provided prompt strictly according to the user's instruction. Return ONLY the updated prompt text. Do not include markdown formatting like \`\`\`markdown unless it is part of the prompt itself. Do not include explanations.`;

          const maxRetries = 3;
          let response;
          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              response = await ai.models.generateContent({
                model: model,
                contents: `Original Prompt:\n${generatedPrompt}\n\nInstruction:\n${refineInstruction}`,
                config: {
                  systemInstruction,
                  temperature: 0.4,
                },
              });
              break;
            } catch (err: any) {
              const isRetryable = err?.status === 503 || err?.status === 429;
              if (!isRetryable || attempt === maxRetries - 1) throw err;
              await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
            }
          }

          if (response?.text) {
            const newPrompt = response.text.trim();
            setGeneratedPrompt(newPrompt);

            const newVersion: PromptVersion = {
              id: Math.random().toString(36).substring(2),
              prompt: newPrompt,
              timestamp: Date.now(),
            };
            setVersions(prev => [newVersion, ...prev].slice(0, 20));

            const updatedHistoryItem: PromptHistory = {
              id: Math.random().toString(36).substring(2),
              description: description + " (Refined)",
              category,
              model,
              prompt: newPrompt,
              timestamp: Date.now(),
            };
            setHistory(prev => [updatedHistoryItem, ...prev].slice(0, 50));

            setRefineInstruction("");
            setShowRefineInput(false);
          }
        } catch (err: any) {
          console.error("Error refining prompt:", err);
          const message = err?.status === 503
            ? "The service is temporarily unavailable. Please try again in a moment."
            : err?.status === 429
            ? "API quota exceeded. Please check your Gemini API key and billing, or try a different model."
            : "An error occurred while refining the prompt.";
          setError(message);
        } finally {
          setIsRefining(false);
        }
      };

    const handleFeedbackSubmit = () => {
       if (feedbackRating === 0 && !feedbackComment.trim()) return;

       const feedback = {
         id: Math.random().toString(36).substring(2),
         prompt: generatedPrompt,
         rating: feedbackRating,
         comment: feedbackComment,
         timestamp: Date.now(),
       };

       const savedFeedback = localStorage.getItem("promptforge_feedback");
       const parsedFeedback = savedFeedback ? JSON.parse(savedFeedback) : [];
       localStorage.setItem("promptforge_feedback", JSON.stringify([feedback, ...parsedFeedback]));

       setFeedbackSubmitted(true);
       setTimeout(() => {
         setIsFeedbackOpen(false);
         setTimeout(() => {
           setFeedbackSubmitted(false);
           setFeedbackRating(0);
           setFeedbackComment("");
         }, 300);
       }, 1500);
     };

     const handleSaveTemplate = () => {
       if (!description.trim()) return;

       const newDescription = description.trim();
       const current = customTemplates[category] || [];
       if (current.includes(newDescription)) return;

       const newTemplates = {
         ...customTemplates,
         [category]: [newDescription, ...current]
       };

       setCustomTemplates(newTemplates);
       showToast("Template saved successfully!");
     };

     const handleDeleteTemplate = (e: React.MouseEvent, templateToDelete: string, catId: string = category) => {
       e.stopPropagation();

       const current = customTemplates[catId] || [];
       const newTemplates = {
         ...customTemplates,
         [catId]: current.filter(t => t !== templateToDelete)
       };

       setCustomTemplates(newTemplates);
     };

     const allTemplates = (() => {
       const combined: { text: string; category: string; isCustom: boolean }[] = [];

       Object.entries(TEMPLATES).forEach(([cat, list]) => {
         list.forEach(text => combined.push({ text, category: cat, isCustom: false }));
       });

       Object.entries(customTemplates).forEach(([cat, list]) => {
         list.forEach(text => combined.push({ text, category: cat, isCustom: true }));
       });

       return combined;
     })();

     const filteredTemplates = allTemplates.filter(t => {
       const matchesSearch = t.text.toLowerCase().includes(gallerySearch.toLowerCase());
       const matchesCategory = galleryCategory === "all" || t.category === galleryCategory;
       return matchesSearch && matchesCategory;
     });

     const filteredHistory = history.filter(item => {
       const searchLower = historySearch.toLowerCase();
       const categoryLabel = CATEGORIES.find(c => c.id === item.category)?.label.toLowerCase() || "";
       return (
         item.description.toLowerCase().includes(searchLower) ||
         categoryLabel.includes(searchLower) ||
         item.category.toLowerCase().includes(searchLower)
       );
     });

     return (
         <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-indigo-500/30">
           <ForgeNavbar />

           <ForgeHero onBrowseGallery={() => setIsGalleryOpen(true)} />

           <ForgeFeatures />

           <ForgeGenerator
             description={description}
             setDescription={setDescription}
             category={category}
             setCategory={setCategory}
             model={model}
             setModel={setModel}
             isGenerating={isGenerating}
             generatedPrompt={generatedPrompt}
             copied={copied}
             isEnhancing={isEnhancing}
             isRefining={isRefining}
             showRefineInput={showRefineInput}
             setShowRefineInput={setShowRefineInput}
             refineInstruction={refineInstruction}
             setRefineInstruction={setRefineInstruction}
             handleGenerate={handleGenerate}
             handleCopy={handleCopy}
             handleEvaluate={handleEvaluate}
             handleRefine={handleRefine}
             handleExport={handleExport}
             handleSmartEnhance={handleSmartEnhance}
             handleSaveTemplate={handleSaveTemplate}
             categories={CATEGORIES}
             models={MODELS}
           />

           <ForgeVault
             history={history}
             historySearch={historySearch}
             setHistorySearch={setHistorySearch}
             visibleHistoryCount={visibleHistoryCount}
             setVisibleHistoryCount={setVisibleHistoryCount}
             handleRecall={handleRecall}
             handleDeleteHistory={handleDeleteHistory}
             handleClearAllHistory={() => {
               setHistory([]);
             }}
             categories={CATEGORIES}
             showToast={showToast}
           />

           <ForgeFooter />

           <VersionsModal
             isOpen={isVersionsOpen}
             onClose={() => setIsVersionsOpen(false)}
             versions={versions}
             setGeneratedPrompt={setGeneratedPrompt}
             showToast={showToast}
           />

           <GalleryModal
             isOpen={isGalleryOpen}
             onClose={() => setIsGalleryOpen(false)}
             gallerySearch={gallerySearch}
             setGallerySearch={setGallerySearch}
             galleryCategory={galleryCategory}
             setGalleryCategory={setGalleryCategory}
             filteredTemplates={filteredTemplates}
             categories={CATEGORIES}
             setDescription={setDescription}
             setCategory={setCategory}
             handleDeleteTemplate={handleDeleteTemplate}
             showToast={showToast}
           />

           <EvaluationModal
             isOpen={isEvaluationOpen}
             onClose={() => setIsEvaluationOpen(false)}
             isEvaluating={isEvaluating}
             evaluationResult={evaluationResult}
             evaluationError={evaluationError}
             handleAutoFix={handleAutoFix}
             isAutoFixing={isAutoFixing}
           />

           <FeedbackModal
             isOpen={isFeedbackOpen}
             onClose={() => setIsFeedbackOpen(false)}
             feedbackSubmitted={feedbackSubmitted}
             feedbackRating={feedbackRating}
             setFeedbackRating={setFeedbackRating}
             feedbackComment={feedbackComment}
             setFeedbackComment={setFeedbackComment}
             handleFeedbackSubmit={handleFeedbackSubmit}
           />

           <ForgeToast toast={toast} onClose={() => setToast(null)} />
         </div>
       );
     }
