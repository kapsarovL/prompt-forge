"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { PromptHistory, PromptVersion, Template } from "@/lib/types";
import { BUILT_IN_TEMPLATES } from "@/lib/types";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "@/lib/storage";

const MAX_HISTORY = 50;
const MAX_VERSIONS = 20;

/**
 * Manages generation history, version snapshots, and template state
 * with localStorage persistence.
 */
export function useHistoryState() {
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(6);

  const [versions, setVersions] = useState<PromptVersion[]>([]);

  const [customTemplates, setCustomTemplates] = useState<Record<string, string[]>>({});

  // Load persisted state on mount
  useEffect(() => {
    const savedHistory = getStorageItem<PromptHistory[]>(STORAGE_KEYS.HISTORY, []);
    setHistory(savedHistory);

    const savedTemplates = getStorageItem<Record<string, string[]>>(STORAGE_KEYS.CUSTOM_TEMPLATES, {});
    setCustomTemplates(savedTemplates);

    const savedVersions = getStorageItem<PromptVersion[]>(STORAGE_KEYS.VERSIONS, []);
    setVersions(savedVersions);
  }, []);

  // Persist on change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CUSTOM_TEMPLATES, customTemplates);
  }, [customTemplates]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.VERSIONS, versions);
  }, [versions]);

  const addHistory = useCallback((item: Omit<PromptHistory, "id" | "timestamp">) => {
    const newItem: PromptHistory = {
      id: Math.random().toString(36).substring(2),
      timestamp: Date.now(),
      ...item,
    };
    setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addVersion = useCallback((prompt: string) => {
    const newVersion: PromptVersion = {
      id: Math.random().toString(36).substring(2),
      prompt,
      timestamp: Date.now(),
    };
    setVersions((prev) => [newVersion, ...prev].slice(0, MAX_VERSIONS));
  }, []);

  // --- Templates ---
  const allTemplates = useMemo<Template[]>(() => {
    const builtIn: Template[] = [];
    for (const [cat, texts] of Object.entries(BUILT_IN_TEMPLATES)) {
      for (const text of texts) {
        builtIn.push({ text, category: cat, isCustom: false });
      }
    }
    const custom: Template[] = [];
    for (const [cat, texts] of Object.entries(customTemplates)) {
      for (const text of texts) {
        custom.push({ text, category: cat, isCustom: true });
      }
    }
    return [...builtIn, ...custom];
  }, [customTemplates]);

  const saveTemplate = useCallback(
    (category: string, description: string) => {
      if (!description.trim()) return;
      setCustomTemplates((prev) => {
        const current = prev[category] || [];
        if (current.includes(description.trim())) return prev;
        return {
          ...prev,
          [category]: [description.trim(), ...current],
        };
      });
    },
    [],
  );

  const deleteTemplate = useCallback((text: string, catId: string) => {
    setCustomTemplates((prev) => {
      const current = prev[catId] || [];
      return { ...prev, [catId]: current.filter((t) => t !== text) };
    });
  }, []);

  return {
    history,
    historySearch,
    setHistorySearch,
    visibleHistoryCount,
    setVisibleHistoryCount,
    versions,
    customTemplates,
    allTemplates,
    addHistory,
    deleteHistoryItem,
    clearAllHistory,
    addVersion,
    saveTemplate,
    deleteTemplate,
  };
}
