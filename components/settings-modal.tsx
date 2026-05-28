"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2, Trash2, Cpu, Globe, Bot, Shield, ShieldOff, Lock } from "lucide-react";
import { OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";
import { useModal } from "@/hooks/use-modal";

type SettingsTab = "gemini" | "opencode" | "anthropic" | "codex" | "security";

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

const PROVIDER_TABS: { id: SettingsTab; label: string; icon: typeof Key | typeof Shield }[] = [
  { id: "gemini", label: "Gemini", icon: Cpu },
  { id: "opencode", label: "OpenCode", icon: Bot },
  { id: "anthropic", label: "Anthropic", icon: Cpu },
  { id: "codex", label: "Codex", icon: Bot },
  { id: "security", label: "Security", icon: Shield },
];

const TAB_COLORS: Record<string, string> = {
  gemini: "bg-emerald-500/10 text-emerald-400",
  opencode: "bg-amber-500/10 text-amber-400",
  anthropic: "bg-purple-500/10 text-purple-400",
  codex: "bg-green-500/10 text-green-400",
  security: "bg-red-500/10 text-red-400",
};

interface ProviderFormState {
  keyInput: string;
  showKey: boolean;
  isSaving: boolean;
  status: { type: "success" | "error"; message: string } | null;
  modelInput?: string;
  baseUrlInput?: string;
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
          <OpenCodeSettings
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
            const modelInput = opencode.modelInput?.trim() || "opencode/big-pickle";
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
            description="Claude model provider"
            accentColor={TAB_COLORS.anthropic}
            placeholder="sk-ant-..."
            docUrl="https://console.anthropic.com/settings/keys"
            docLabel="console.anthropic.com"
            hasKey={props.hasAnthropicKey}
            onSave={() => handleSaveKey(setAnthropic, anthropic, props.onSaveAnthropicKey, "Anthropic", () => {
              props.onSetAnthropicModel(anthropic.modelInput?.trim() || "claude-sonnet-4-20250514");
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
            description="GPT-4o, o3-mini models"
            accentColor={TAB_COLORS.codex}
            placeholder="sk-..."
            docUrl="https://platform.openai.com/api-keys"
            docLabel="platform.openai.com"
            hasKey={props.hasCodexKey}
            onSave={() => handleSaveKey(setCodex, codex, props.onSaveCodexKey, "OpenAI", () => {
              props.onSetCodexModel(codex.modelInput?.trim() || "gpt-4o");
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

// Shared provider settings form
function ProviderSettings({
  state, setState, name, description, accentColor, placeholder, docUrl, docLabel, hasKey, onSave, onClear,
}: {
  state: ProviderFormState;
  setState: React.Dispatch<React.SetStateAction<ProviderFormState>>;
  name: string;
  description: string;
  accentColor: string;
  placeholder: string;
  docUrl: string;
  docLabel: string;
  hasKey: boolean;
  onSave: () => void | Promise<void>;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accentColor.split(" ")[0]}`}>
          <Key className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{name}</h4>
          <p className="text-[10px] text-zinc-500">{description}</p>
        </div>
      </div>

      {hasKey && !state.status && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">{name} API key is active.</p>
        </div>
      )}
      {!hasKey && !state.status && (
        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-zinc-500 shrink-0" />
          <p className="text-sm text-zinc-400">No {name} API key configured.</p>
        </div>
      )}
      {state.status && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${
          state.status.type === "success"
            ? "bg-green-500/10 border border-green-500/20"
            : "bg-red-500/10 border border-red-500/20"
        }`}>
          {state.status.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
          <p className={`text-sm ${state.status.type === "success" ? "text-green-300" : "text-red-300"}`}>{state.status.message}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-3">
        <label htmlFor={`${name.toLowerCase().replace(/\s+/g, "-")}-api-key`} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">API Key</label>
        <div className="relative">
          <input
            id={`${name.toLowerCase().replace(/\s+/g, "-")}-api-key`}
            type={state.showKey ? "text" : "password"}
            value={state.keyInput}
            onChange={(e) => setState(prev => ({ ...prev, keyInput: e.target.value }))}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
          />
          <button
            type="button"
            aria-label={state.showKey ? `Hide ${name} key` : `Show ${name} key`}
            onClick={() => setState(prev => ({ ...prev, showKey: !prev.showKey }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {state.showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-zinc-600">
          Get one at{" "}
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
            {docLabel}
          </a>
        </p>

        {/* Model input (not for Gemini which uses dropdown) */}
        {state.modelInput !== undefined && (
          <div className="space-y-3">
            <label htmlFor={`${name.toLowerCase().replace(/\s+/g, "-")}-model`} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Model</label>
            <input
              id={`${name.toLowerCase().replace(/\s+/g, "-")}-model`}
              type="text"
              value={state.modelInput}
              onChange={(e) => setState(prev => ({ ...prev, modelInput: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
            />
            <p className="text-xs text-zinc-600">The model ID used when {name} is the active provider.</p>
          </div>
        )}

        {/* Base URL input (OpenCode only) */}
        {state.baseUrlInput !== undefined && (
          <div className="space-y-3">
            <label htmlFor="opencode-base-url" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Base URL</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
              <input
                id="opencode-base-url"
                type="text"
                value={state.baseUrlInput}
                onChange={(e) => setState(prev => ({ ...prev, baseUrlInput: e.target.value }))}
                placeholder={OPENCODE_DEFAULT_BASE_URL}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
              />
            </div>
            <p className="text-xs text-zinc-600">
              The API endpoint URL (without the path). Examples:
            </p>
            <div className="space-y-1.5 px-1">
              <p className="text-[10px] font-mono text-zinc-500">OpenCode Zen: <span className="text-zinc-400">https://opencode.ai/zen/v1</span></p>
              <p className="text-[10px] font-mono text-zinc-500">OpenAI-compatible: <span className="text-zinc-400">https://api.example.com/v1</span></p>
              <p className="text-[10px] font-mono text-zinc-500">Self-hosted: <span className="text-zinc-400">http://localhost:8080/v1</span></p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-400/70 leading-relaxed">
                The server must support CORS for browser-based access. If you see
                &quot;Failed to fetch&quot; errors, the URL may be wrong or the server
                blocks browser requests. Check your provider&apos;s API documentation.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!state.keyInput.trim() || state.isSaving}
            className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
          >
            {state.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {state.isSaving ? "Validating..." : "Save & Validate"}
          </button>
          {hasKey && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// OpenCode variant with model + base URL
function OpenCodeSettings(props: {
  state: ProviderFormState;
  setState: React.Dispatch<React.SetStateAction<ProviderFormState>>;
  name: string;
  description: string;
  accentColor: string;
  placeholder: string;
  docUrl: string;
  docLabel: string;
  hasKey: boolean;
  onSave: () => void | Promise<void>;
  onClear: () => void;
}) {
  return <ProviderSettings {...props} />;
}

function EncryptionSettings({ isEncryptionActive, onEnableEncryption, onDisableEncryption }: {
  isEncryptionActive: boolean;
  onEnableEncryption: (passphrase: string) => Promise<boolean>;
  onDisableEncryption: () => void;
}) {
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEnable = async () => {
    if (passphrase.length < 8) {
      setStatus({ type: "error", message: "Passphrase must be at least 8 characters." });
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setStatus({ type: "error", message: "Passphrases do not match." });
      return;
    }

    setIsSaving(true);
    setStatus(null);
    try {
      const success = await onEnableEncryption(passphrase);
      if (success) {
        setStatus({ type: "success", message: "Encryption enabled. API keys are now encrypted at rest." });
        setPassphrase("");
        setConfirmPassphrase("");
        setShowForm(false);
      } else {
        setStatus({ type: "error", message: "Failed to enable encryption. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEncryptionActive) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Encryption Active</h4>
            <p className="text-[10px] text-zinc-500">API keys are encrypted at rest</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <Lock className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">
            Your API keys are encrypted with AES-256-GCM. They will be unlocked during this session.
          </p>
        </div>

        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl ${
            status.type === "success"
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            {status.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <p className={`text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>{status.message}</p>
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm("Disable encryption? Your API keys will be stored in plaintext.")) {
              onDisableEncryption();
              setStatus({ type: "success", message: "Encryption disabled. Keys will be saved in plaintext." });
            }
          }}
          className="w-full py-3 border border-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShieldOff className="w-4 h-4" />
          Disable Encryption
        </button>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Disabling encryption will store your API keys in plaintext in the browser&apos;s
          localStorage. Anyone with access to this device can read them.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center">
            <Shield className="w-4 h-4 text-zinc-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Encryption</h4>
            <p className="text-[10px] text-zinc-500">Protect your API keys at rest</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-zinc-500 shrink-0" />
          <p className="text-sm text-zinc-400">API keys are currently stored in plaintext.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)] hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.35)] hover:from-amber-500 hover:to-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Enable Encryption
        </button>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Encryption uses AES-256-GCM with PBKDF2 key derivation. Your passphrase is never stored
          and cannot be recovered if lost.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Set Encryption Passphrase</h4>
          <p className="text-[10px] text-zinc-500">Choose a passphrase to protect your keys</p>
        </div>
      </div>

      {status && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${
          status.type === "success"
            ? "bg-green-500/10 border border-green-500/20"
            : "bg-red-500/10 border border-red-500/20"
        }`}>
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <p className={`text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>{status.message}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleEnable(); }} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="encryption-passphrase" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
            Passphrase
          </label>
          <input
            id="encryption-passphrase"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="encryption-confirm" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
            Confirm Passphrase
          </label>
          <input
            id="encryption-confirm"
            type="password"
            value={confirmPassphrase}
            onChange={(e) => setConfirmPassphrase(e.target.value)}
            placeholder="Re-enter passphrase"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={passphrase.length < 8 || passphrase !== confirmPassphrase || isSaving}
            className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-zinc-800 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {isSaving ? "Encrypting..." : "Enable Encryption"}
          </button>
          <button
            type="button"
            onClick={() => { setShowForm(false); setStatus(null); setPassphrase(""); setConfirmPassphrase(""); }}
            className="px-4 py-3 border border-white/10 text-zinc-400 font-medium rounded-xl hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-xs text-zinc-600 leading-relaxed">
        ⚠️ Your passphrase cannot be recovered if lost. If you lose it, you will need to
        re-enter your API keys. Write it down or use a password manager.
      </p>
    </div>
  );
}
