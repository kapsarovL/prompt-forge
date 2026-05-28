"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import type { Provider } from "@/lib/types";
import type { ApiConfig } from "@/lib/api";
import type { OpenCodeConfig } from "@/lib/opencode";
import { getApiKey } from "@/lib/gemini";
import { getOpenCodeConfig, validateOpenCodeKey, OPENCODE_DEFAULT_BASE_URL, OPENCODE_DEFAULT_MODEL } from "@/lib/opencode";
import type { ValidationResult } from "@/lib/opencode";
import { ANTHROPIC_MODELS, CODEX_MODELS } from "@/lib/types";
import * as anthropicLib from "@/lib/anthropic";
import * as codexLib from "@/lib/codex";
import { STORAGE_KEYS, getStorageString, setStorageString, removeStorageItem } from "@/lib/storage";
import { isEncryptionActive, initEncryption, decryptAllKeys, clearEncryption } from "@/lib/crypto";

/**
 * Manages all AI provider state: API keys, model selections, base URLs,
 * and persistence to localStorage.
 *
 * Supports optional passphrase-based encryption for stored API keys.
 * When encryption is active, keys are encrypted via AES-GCM and the
 * passphrase is held in memory only (never persisted).
 */
export function useProviderState() {
  const [provider, setProvider] = useState<Provider>("gemini");

  // Encryption state
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [isEncryptionLocked, setIsEncryptionLocked] = useState(false);

  // Gemini
  const [geminiKey, setGeminiKey] = useState<string | null>(null);

  // OpenCode
  const [opencodeKey, setOpencodeKey] = useState<string | null>(null);
  const [opencodeModel, setOpencodeModel] = useState(OPENCODE_DEFAULT_MODEL);
  const [opencodeBaseUrl, setOpencodeBaseUrl] = useState(OPENCODE_DEFAULT_BASE_URL);

  // Anthropic
  const [anthropicKey, setAnthropicKeyState] = useState<string | null>(null);
  const [anthropicModel, setAnthropicModelState] = useState(ANTHROPIC_MODELS[0].id);

  // Codex
  const [codexKey, setCodexKeyState] = useState<string | null>(null);
  const [codexModel, setCodexModelState] = useState(CODEX_MODELS[0].id);

  // Load persisted state on mount
  useEffect(() => {
    // Check if encryption is active — if so, don't load plaintext keys
    if (isEncryptionActive()) {
      setIsEncryptionLocked(true);
      // Models and base URLs are not sensitive, load them normally
      const savedModel = getStorageString(STORAGE_KEYS.OPENCODE_MODEL, OPENCODE_DEFAULT_MODEL);
      if (savedModel) setOpencodeModel(savedModel);

      const savedBaseUrl = getStorageString(STORAGE_KEYS.OPENCODE_BASE_URL, OPENCODE_DEFAULT_BASE_URL);
      if (savedBaseUrl) setOpencodeBaseUrl(savedBaseUrl);

      const savedAnthropicModel = getStorageString(STORAGE_KEYS.ANTHROPIC_MODEL, ANTHROPIC_MODELS[0].id);
      if (savedAnthropicModel) setAnthropicModelState(savedAnthropicModel);

      const savedCodexModel = getStorageString(STORAGE_KEYS.CODEX_MODEL, CODEX_MODELS[0].id);
      if (savedCodexModel) setCodexModelState(savedCodexModel);

      const savedProvider = getStorageString(STORAGE_KEYS.PROVIDER, "gemini") as Provider;
      if (savedProvider === "gemini" || savedProvider === "opencode" || savedProvider === "anthropic" || savedProvider === "codex") {
        setProvider(savedProvider);
      }
      return;
    }

    // No encryption: load keys from plaintext localStorage
    const savedKey = getStorageString(STORAGE_KEYS.GEMINI_KEY, "");
    if (savedKey) setGeminiKey(savedKey);

    const savedOpenKey = getStorageString(STORAGE_KEYS.OPENCODE_KEY, "");
    if (savedOpenKey) setOpencodeKey(savedOpenKey);

    const savedModel = getStorageString(STORAGE_KEYS.OPENCODE_MODEL, OPENCODE_DEFAULT_MODEL);
    if (savedModel) setOpencodeModel(savedModel);

    const savedBaseUrl = getStorageString(STORAGE_KEYS.OPENCODE_BASE_URL, OPENCODE_DEFAULT_BASE_URL);
    if (savedBaseUrl) setOpencodeBaseUrl(savedBaseUrl);

    const savedAnthropicKey = getStorageString(STORAGE_KEYS.ANTHROPIC_KEY, "");
    if (savedAnthropicKey) setAnthropicKeyState(savedAnthropicKey);

    const savedAnthropicModel = getStorageString(STORAGE_KEYS.ANTHROPIC_MODEL, ANTHROPIC_MODELS[0].id);
    if (savedAnthropicModel) setAnthropicModelState(savedAnthropicModel);

    const savedCodexKey = getStorageString(STORAGE_KEYS.CODEX_KEY, "");
    if (savedCodexKey) setCodexKeyState(savedCodexKey);

    const savedCodexModel = getStorageString(STORAGE_KEYS.CODEX_MODEL, CODEX_MODELS[0].id);
    if (savedCodexModel) setCodexModelState(savedCodexModel);

    const savedProvider = getStorageString(STORAGE_KEYS.PROVIDER, "gemini") as Provider;
    if (savedProvider === "gemini" || savedProvider === "opencode" || savedProvider === "anthropic" || savedProvider === "codex") {
      setProvider(savedProvider);
    }
  }, []);

  // Persist provider preference
  useEffect(() => {
    setStorageString(STORAGE_KEYS.PROVIDER, provider);
  }, [provider]);

  // --- Gemini handlers ---
  const handleSaveGeminiKey = useCallback(async (key: string): Promise<boolean> => {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Reply with only the word OK.",
        config: { temperature: 0 },
      });
      setGeminiKey(key);
      setStorageString(STORAGE_KEYS.GEMINI_KEY, key);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleClearGeminiKey = useCallback(() => {
    setGeminiKey(null);
    removeStorageItem(STORAGE_KEYS.GEMINI_KEY);
  }, []);

  // --- OpenCode handlers ---
  /**
   * Validates an OpenCode API key.
   * Optionally accepts a model and baseUrl override (needed when the user
   * changes these in the settings form before the provider state updates).
   *
   * Always saves the key to state/localStorage regardless of validation
   * result — validation failures are treated as warnings, not blockers.
   * Returns the validation result for the UI to display appropriate
   * success/warning messages.
   */
  const handleSaveOpenCodeKey = useCallback(async (
    key: string,
    modelOverride?: string,
    baseUrlOverride?: string,
  ): Promise<{ success: true; validation: ValidationResult }> => {
    const model = modelOverride ?? opencodeModel;
    const baseUrl = baseUrlOverride ?? opencodeBaseUrl;
    const validation = await validateOpenCodeKey(key, baseUrl, model);

    // Always save the key — validation failure is not a blocker
    setOpencodeKey(key);
    setStorageString(STORAGE_KEYS.OPENCODE_KEY, key);
    setStorageString(STORAGE_KEYS.OPENCODE_MODEL, model);
    if (baseUrlOverride) {
      setStorageString(STORAGE_KEYS.OPENCODE_BASE_URL, baseUrl);
    }

    return { success: true, validation };
  }, [opencodeBaseUrl, opencodeModel]);

  const handleClearOpenCodeKey = useCallback(() => {
    setOpencodeKey(null);
    removeStorageItem(STORAGE_KEYS.OPENCODE_KEY);
  }, []);

  const handleSetOpencodeModel = useCallback((model: string) => {
    setOpencodeModel(model);
    setStorageString(STORAGE_KEYS.OPENCODE_MODEL, model);
  }, []);

  const handleSetOpencodeBaseUrl = useCallback((url: string) => {
    setOpencodeBaseUrl(url);
    setStorageString(STORAGE_KEYS.OPENCODE_BASE_URL, url);
  }, []);

  const getEffectiveOpenCodeConfig = useCallback((): OpenCodeConfig | null => {
    const config = getOpenCodeConfig();
    if (config) return config;
    if (opencodeKey) {
      return { apiKey: opencodeKey, model: opencodeModel, baseUrl: opencodeBaseUrl };
    }
    return null;
  }, [opencodeKey, opencodeModel, opencodeBaseUrl]);

  // --- Anthropic handlers ---
  const handleSaveAnthropicKey = useCallback(async (key: string): Promise<boolean> => {
    const valid = await anthropicLib.validateAnthropicKey(key);
    if (valid) {
      setAnthropicKeyState(key);
      anthropicLib.setAnthropicKey(key);
      anthropicLib.setAnthropicModel(anthropicModel);
    }
    return valid;
  }, [anthropicModel]);

  const handleClearAnthropicKey = useCallback(() => {
    setAnthropicKeyState(null);
    anthropicLib.removeAnthropicKey();
  }, []);

  const handleSetAnthropicModel = useCallback((model: string) => {
    setAnthropicModelState(model);
    anthropicLib.setAnthropicModel(model);
  }, []);

  const getEffectiveAnthropicConfig = useCallback((): { apiKey: string; model: string } | null => {
    const envKey = anthropicLib.getAnthropicKey();
    if (envKey) return { apiKey: envKey, model: anthropicModel };
    if (anthropicKey) return { apiKey: anthropicKey, model: anthropicModel };
    return null;
  }, [anthropicKey, anthropicModel]);

  // --- Codex handlers ---
  const handleSaveCodexKey = useCallback(async (key: string): Promise<boolean> => {
    const valid = await codexLib.validateCodexKey(key);
    if (valid) {
      setCodexKeyState(key);
      codexLib.setCodexKey(key);
      codexLib.setCodexModel(codexModel);
    }
    return valid;
  }, [codexModel]);

  const handleClearCodexKey = useCallback(() => {
    setCodexKeyState(null);
    codexLib.removeCodexKey();
  }, []);

  const handleSetCodexModel = useCallback((model: string) => {
    setCodexModelState(model);
    codexLib.setCodexModel(model);
  }, []);

  const getEffectiveCodexConfig = useCallback((): { apiKey: string; model: string } | null => {
    const envKey = codexLib.getCodexKey();
    if (envKey) return { apiKey: envKey, model: codexModel };
    if (codexKey) return { apiKey: codexKey, model: codexModel };
    return null;
  }, [codexKey, codexModel]);

  // --- Encryption handlers ---

  /**
   * Enables encryption: encrypts all current in-memory keys with the given
   * passphrase and stores the encrypted bundle. Clears plaintext localStorage keys.
   */
  const handleEnableEncryption = useCallback(async (newPassphrase: string): Promise<boolean> => {
    try {
      const currentKeys = {
        gemini: geminiKey,
        opencode: opencodeKey,
        anthropic: anthropicKey,
        codex: codexKey,
      };

      await initEncryption(newPassphrase, currentKeys);

      // Clear plaintext keys from localStorage
      removeStorageItem(STORAGE_KEYS.GEMINI_KEY);
      removeStorageItem(STORAGE_KEYS.OPENCODE_KEY);
      removeStorageItem(STORAGE_KEYS.ANTHROPIC_KEY);
      removeStorageItem(STORAGE_KEYS.CODEX_KEY);

      setPassphrase(newPassphrase);
      setIsEncryptionLocked(false);
      return true;
    } catch {
      return false;
    }
  }, [geminiKey, opencodeKey, anthropicKey, codexKey]);

  /**
   * Unlocks encrypted keys by decrypting them with the given passphrase.
   */
  const handleUnlockKeys = useCallback(async (unlockPassphrase: string): Promise<boolean> => {
    try {
      const decrypted = await decryptAllKeys(unlockPassphrase);
      if (!decrypted) return false;

      if (decrypted.gemini) setGeminiKey(decrypted.gemini);
      if (decrypted.opencode) setOpencodeKey(decrypted.opencode);
      if (decrypted.anthropic) setAnthropicKeyState(decrypted.anthropic);
      if (decrypted.codex) setCodexKeyState(decrypted.codex);

      setPassphrase(unlockPassphrase);
      setIsEncryptionLocked(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Disables encryption: removes encrypted bundle and stores keys in plaintext.
   */
  const handleDisableEncryption = useCallback(() => {
    // First, write in-memory keys to plaintext localStorage
    if (geminiKey) setStorageString(STORAGE_KEYS.GEMINI_KEY, geminiKey);
    if (opencodeKey) setStorageString(STORAGE_KEYS.OPENCODE_KEY, opencodeKey);
    if (anthropicKey) setStorageString(STORAGE_KEYS.ANTHROPIC_KEY, anthropicKey);
    if (codexKey) setStorageString(STORAGE_KEYS.CODEX_KEY, codexKey);

    // Then clear the encrypted bundle
    clearEncryption();
    setPassphrase(null);
    setIsEncryptionLocked(false);
  }, [geminiKey, opencodeKey, anthropicKey, codexKey]);

  // --- Computed ---
  const hasApiKey = provider === "gemini"
    ? !!(geminiKey || getApiKey())
    : provider === "opencode"
      ? !!(opencodeKey || getOpenCodeConfig())
      : provider === "anthropic"
        ? !!(anthropicKey || anthropicLib.getAnthropicKey())
        : !!(codexKey || codexLib.getCodexKey());

  const hasCustomKey = geminiKey !== null;

  const getApiConfig = useCallback((geminiModel?: string): ApiConfig => ({
    provider,
    geminiKey: geminiKey ?? undefined,
    geminiModel,
    opencodeConfig: getEffectiveOpenCodeConfig(),
    anthropicConfig: getEffectiveAnthropicConfig(),
    codexConfig: getEffectiveCodexConfig(),
  }), [provider, geminiKey, getEffectiveOpenCodeConfig, getEffectiveAnthropicConfig, getEffectiveCodexConfig]);

  return {
    provider,
    setProvider,
    geminiKey,
    opencodeKey,
    opencodeModel,
    opencodeBaseUrl,
    anthropicKey,
    anthropicModel,
    codexKey,
    codexModel,
    passphrase,
    isEncryptionLocked,
    hasApiKey,
    hasCustomKey,
    getApiConfig,
    handleSaveGeminiKey,
    handleClearGeminiKey,
    handleSaveOpenCodeKey,
    handleClearOpenCodeKey,
    handleSetOpencodeModel,
    handleSetOpencodeBaseUrl,
    getEffectiveOpenCodeConfig,
    handleSaveAnthropicKey,
    handleClearAnthropicKey,
    handleSetAnthropicModel,
    getEffectiveAnthropicConfig,
    handleSaveCodexKey,
    handleClearCodexKey,
    handleSetCodexModel,
    getEffectiveCodexConfig,
    handleEnableEncryption,
    handleUnlockKeys,
    handleDisableEncryption,
  };
}
