"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2, Shield, ShieldOff, Lock } from "lucide-react";
import type { EncryptionSettingsProps } from "./types";

export function EncryptionSettings({ isEncryptionActive, onEnableEncryption, onDisableEncryption }: EncryptionSettingsProps) {
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
        Encryption uses AES-256-GCM with PBKDF2 key derivation. Your passphrase is never stored
        and cannot be recovered if lost. Keys are decrypted in-memory during this session only.
      </p>
    </div>
  );
}
