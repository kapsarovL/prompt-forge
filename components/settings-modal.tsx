"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Key } from "lucide-react";
import { OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";
import { useModal } from "@/hooks/use-modal";
import { ProviderSettings } from "./settings/provider-settings";
import { EncryptionSettings } from "./settings/encryption-settings";
import { PROVIDER_TABS, TAB_COLORS, DEFAULT_MODELS } from "./settings/types";
import type { SettingsTab, ProviderFormState } from "./settings/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGeminiKey: (key: string) => Promise<boolean>;
  onClearGeminiKey: () => void;
  hasGeminiKey: boolean;
  onSaveOpenCodeKey: (key: string, modelOverride?: string, baseUrlOverride?: string) => Promise<{ success: boolean; validation?: { valid: boolean; status?: number; error?: string } }>;
  onClearOpenCodeKey: () => void;
  hasOpenCodeKey: boolean;
  opencodeModel: string;
  onSetOpencodeModel: (model: string) => void;
  opencodeBaseUrl: string;
  onSetOpencodeBaseUrl: (url: string) => void;
  onSaveAnthropicKey: (key: string) => Promise<boolean>;
  onClearAnthropicKey: () => void;
  hasAnthropicKey: boolean;
  anthropicModel: string;
  onSetAnthropicModel: (model: string) => void;
  onSaveCodexKey: (key: string) => Promise<boolean>;
  onClearCodexKey: () => void;
  hasCodexKey: boolean;
  codexModel: string;
  onSetCodexModel: (model: string) => void;
  // Encryption
  isEncryptionActive: boolean;
  onEnableEncryption: (passphrase: string) => Promise<boolean>;
  onDisableEncryption: () => void;
}

export function SettingsModal(props: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("gemini");

  const [gemini, setGemini] = useState<ProviderFormState>({
    keyInput: "", showKey: false, isSaving: false, status: null,
  });
  const [opencode, setOpencode] = useState<ProviderFormState>({
    keyInput: "", showKey: false, isSaving: false, status: null,
    modelInput: props.opencodeModel,
    baseUrlInput: props.opencodeBaseUrl,
  });
  const [anthropic, setAnthropic] = useState<ProviderFormState>({
    keyInput: "", showKey: false, isSaving: false, status: null,
    modelInput: props.anthropicModel,
  });
  const [codex, setCodex] = useState<ProviderFormState>({
    keyInput: "", showKey: false, isSaving: false, status: null,
    modelInput: props.codexModel,
  });

  const updateField = <K extends keyof ProviderFormState>(
    setter: React.Dispatch<React.SetStateAction<ProviderFormState>>,
    field: K,
    value: ProviderFormState[K],
  ) => setter(prev => ({ ...prev, [field]: value }));

  /**
   * Result from a key save+validate operation.
   * Can be a simple boolean (true=validated) or a details object
   * (e.g., from OpenCode's permissive validation).
   */
  type SaveResult = boolean | { success: boolean; validation?: { valid: boolean; status?: number; error?: string } };

  const handleSaveKey = async (
    setter: React.Dispatch<React.SetStateAction<ProviderFormState>>,
    state: ProviderFormState,
    onSave: (key: string) => Promise<SaveResult>,
    name: string,
    onSuccess?: () => void,
  ) => {
    if (!state.keyInput.trim()) return;
    updateField(setter, "isSaving", true);
    updateField(setter, "status", null);
    const result = await onSave(state.keyInput.trim());
    updateField(setter, "isSaving", false);

    // Support both simple boolean and details-object returns
    const isSuccess = typeof result === "boolean" ? result : result.success;
    const validation = typeof result === "boolean" ? undefined : result.validation;

    if (isSuccess) {
      if (validation && !validation.valid) {
        // Key was saved but validation failed — show warning with details
        const detail = validation.status
          ? ` (HTTP ${validation.status}${validation.error ? `: ${validation.error}` : ""})`
          : validation.error
            ? ` (${validation.error})`
            : "";
        updateField(setter, "status", {
          type: "success",
          message: `${name} API key saved. Validation warning${detail}`,
        });
      } else {
        updateField(setter, "status", { type: "success", message: `${name} API key saved and validated.` });
      }
      updateField(setter, "keyInput", "");
      onSuccess?.();
    } else {
      const detail = validation?.error ? `: ${validation.error}` : "";
      updateField(setter, "status", { type: "error", message: `Failed to validate ${name} API key${detail}` });
    }
  };

  const handleClearKey = (
    setter: React.Dispatch<React.SetStateAction<ProviderFormState>>,
    onClear: () => void,
    name: string,
  ) => {
    if (!window.confirm(`Clear your ${name} API key?`)) return;
    onClear();
    updateField(setter, "status", { type: "success", message: `${name} API key removed.` });
  };

  const handleClose = () => {
    setGemini({ keyInput: "", showKey: false, isSaving: false, status: null });
    setOpencode({ keyInput: "", showKey: false, isSaving: false, status: null, modelInput: props.opencodeModel, baseUrlInput: props.opencodeBaseUrl });
    setAnthropic({ keyInput: "", showKey: false, isSaving: false, status: null, modelInput: props.anthropicModel });
    setCodex({ keyInput: "", showKey: false, isSaving: false, status: null, modelInput: props.codexModel });
    setActiveTab("gemini");
    props.onClose();
  };

  const { handleBackdropClick } = useModal(handleClose);

  const renderTabContent = () => {
    switch (activeTab) {
      case "gemini":
        return (
          <ProviderSettings
            state={gemini}
            setState={setGemini}
            name="Gemini"
            description="Primary prompt generation provider"
            accentColor={TAB_COLORS.gemini}
            placeholder="AIza..."
            docUrl="https://aistudio.google.com/app/apikey"
            docLabel="Google AI Studio"
            hasKey={props.hasGeminiKey}
            onSave={() => handleSaveKey(setGemini, gemini, props.onSaveGeminiKey, "Gemini")}
            onClear={() => handleClearKey(setGemini, props.onClearGeminiKey, "Gemini")}
          />
        );
      case "opencode":
        return (
          <ProviderSettings
            state={opencode}
            setState={setOpencode}
            name="OpenCode"
            description="Alternative provider via Zen API"
            accentColor={TAB_COLORS.opencode}
            placeholder="oc_..."
            docUrl="https://opencode.ai/zen"
            docLabel="opencode.ai/zen"
            hasKey={props.hasOpenCodeKey}
            onSave={() => {
            // Pass the form's model and baseUrl to validation so it uses
            // the values the user just typed, not the stale React state
            const modelInput = opencode.modelInput?.trim() || DEFAULT_MODELS.opencode;
            const baseUrlInput = opencode.baseUrlInput?.trim() || OPENCODE_DEFAULT_BASE_URL;
            handleSaveKey(
              setOpencode,
              opencode,
              (key) => props.onSaveOpenCodeKey(key, modelInput, baseUrlInput),
              "OpenCode",
              () => {
                props.onSetOpencodeModel(modelInput);
                props.onSetOpencodeBaseUrl(baseUrlInput);
              },
            );
          }}
            onClear={() => handleClearKey(setOpencode, props.onClearOpenCodeKey, "OpenCode")}
          />
        );
      case "anthropic":
        return (
          <ProviderSettings
            state={anthropic}
            setState={setAnthropic}
            name="Anthropic"
            description="Claude models by Anthropic"
            accentColor={TAB_COLORS.anthropic}
            placeholder="sk-ant-..."
            docUrl="https://console.anthropic.com/settings/keys"
            docLabel="console.anthropic.com"
            hasKey={props.hasAnthropicKey}
            onSave={() => handleSaveKey(setAnthropic, anthropic, props.onSaveAnthropicKey, "Anthropic", () => {
              props.onSetAnthropicModel(anthropic.modelInput?.trim() || DEFAULT_MODELS.anthropic);
            })}
            onClear={() => handleClearKey(setAnthropic, props.onClearAnthropicKey, "Anthropic")}
          />
        );
      case "codex":
        return (
          <ProviderSettings
            state={codex}
            setState={setCodex}
            name="OpenAI Codex"
            description="GPT-4o, GPT-4o Mini, o3-mini models"
            accentColor={TAB_COLORS.codex}
            placeholder="sk-..."
            docUrl="https://platform.openai.com/api-keys"
            docLabel="platform.openai.com"
            hasKey={props.hasCodexKey}
            onSave={() => handleSaveKey(setCodex, codex, props.onSaveCodexKey, "OpenAI", () => {
              props.onSetCodexModel(codex.modelInput?.trim() || DEFAULT_MODELS.codex);
            })}
            onClear={() => handleClearKey(setCodex, props.onClearCodexKey, "OpenAI")}
          />
        );
      case "security":
        return <EncryptionSettings
          isEncryptionActive={props.isEncryptionActive}
          onEnableEncryption={props.onEnableEncryption}
          onDisableEncryption={props.onDisableEncryption}
        />;
    }
  };

  return (
    <AnimatePresence>
      {props.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="API settings" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API Settings</h3>
                  <p className="text-xs text-zinc-500">Manage your provider API keys.</p>
                </div>
              </div>
              <button
                aria-label="Close settings"
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex p-1.5 mx-8 mt-6 bg-black/40 border border-white/10 rounded-xl">
              {PROVIDER_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
