import { Terminal, PenTool, BarChart, MessageSquare } from "lucide-react";

export interface EvaluationData {
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

export interface PromptHistory {
  id: string;
  description: string;
  category: string;
  model: string;
  prompt: string;
  timestamp: number;
}

export interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: number;
}

export interface Category {
  id: string;
  label: string;
  icon: typeof Terminal;
  description: string;
}

export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "coding", label: "Coding", icon: Terminal, description: "Software development, debuging, and architecture" },
  { id: "creative", label: "Creative", icon: PenTool, description: "Writing, storytelling, and content creation" },
  { id: "analysis", label: "Analysis", icon: BarChart, description: "Data interpretation, research, and summaries" },
  { id: "general", label: "General", icon: MessageSquare, description: "Everyday tasks, Q&A, and general assistance" },
];

export const MODELS: ModelOption[] = [
  { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview", description: "Frontier reasoning, latest generation" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Complex reasoning, deep analysis" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Fast responses, high-volume" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", description: "Lowest latency, lightest tasks" },
];

export interface OpenCodeModelOption {
  id: string;
  label: string;
  description: string;
}

export const OPENCODE_MODELS: OpenCodeModelOption[] = [
  { id: "opencode/big-pickle", label: "Big Pickle", description: "Default powerful model" },
  { id: "opencode/big-pickle-2", label: "Big Pickle 2", description: "Latest generation" },
];

export type Provider = "gemini" | "opencode";

export interface Template {
  text: string;
  category: string;
  isCustom: boolean;
}

export const BUILT_IN_TEMPLATES: Record<string, string[]> = {
  coding: [
    "Build a React hook that debounces API calls with retry logic",
    "Write a Python script to scrape a website and save data to CSV",
    "Explain the difference between useMemo and useCallback with examples",
  ],
  creative: [
    "Write a sci-fi short story about a time traveler who is always 5 minutes late",
    "Create marketing copy for a new eco-friendly coffee brand",
    "Write a poem about the ocean in the style of Edgar Allan Poe",
  ],
  analysis: [
    "Summarize the key findings of a quarterly earnings report",
    "Analyze the pros and cons of migrating from REST to GraphQL",
    "Extract the main entities and their relationships from a legal contract",
  ],
  general: [
    "Draft a polite email declining a job offer",
    "Plan a 5-day itinerary for a trip to Tokyo",
    "Explain quantum computing to a 5-year-old",
  ],
};
