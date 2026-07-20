import type { LucideIcon } from "lucide-react";
import { Cpu, Bot, Shield } from "lucide-react";
import { MODELS, OPENCODE_MODELS, ANTHROPIC_MODELS, CODEX_MODELS } from "@/lib/types";

export type SettingsTab = "gemini" | "opencode" | "anthropic" | "codex" | "security";

export interface ProviderFormState {
  keyInput: string;
  showKey: boolean;
  isSaving: boolean;
  status: { type: "success" | "error"; message: string } | null;
  modelInput?: string;
  baseUrlInput?: string;
}

/** Canonical default model ID per provider — single source of truth. */
export const DEFAULT_MODELS = {
  gemini: MODELS[0].id,
  opencode: OPENCODE_MODELS[0].id,
  anthropic: ANTHROPIC_MODELS[0].id,
  codex: CODEX_MODELS[0].id,
} as const;

export const PROVIDER_TABS: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
  { id: "gemini", label: "Gemini", icon: Cpu },
  { id: "opencode", label: "OpenCode", icon: Bot },
  { id: "anthropic", label: "Anthropic", icon: Cpu },
  { id: "codex", label: "Codex", icon: Bot },
  { id: "security", label: "Security", icon: Shield },
];

export const TAB_COLORS: Record<string, string> = {
  gemini: "bg-emerald-500/10 text-emerald-400",
  opencode: "bg-amber-500/10 text-amber-400",
  anthropic: "bg-purple-500/10 text-purple-400",
  codex: "bg-green-500/10 text-green-400",
  security: "bg-red-500/10 text-red-400",
};

export interface ProviderSettingsProps {
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
}

export interface EncryptionSettingsProps {
  isEncryptionActive: boolean;
  onEnableEncryption: (passphrase: string) => Promise<boolean>;
  onDisableEncryption: () => void;
}
