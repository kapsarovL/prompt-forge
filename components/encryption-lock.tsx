"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Unlock, Loader2, AlertTriangle, Shield, Trash2 } from "lucide-react";
import { clearEncryption } from "@/lib/crypto";

interface EncryptionLockProps {
  onUnlock: (passphrase: string) => Promise<boolean>;
}

/**
 * Overlay shown when API keys are encrypted and the user needs to
 * enter their passphrase to unlock them.
 */
export function EncryptionLock({ onUnlock }: EncryptionLockProps) {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!passphrase.trim()) return;
    setIsUnlocking(true);
    setError(null);
    try {
      const success = await onUnlock(passphrase.trim());
      if (!success) {
        setError("Incorrect passphrase. Please try again.");
      }
    } catch {
      setError("An error occurred while decrypting. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-zinc-900/80 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Keys Encrypted</h1>
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs">
              Your API keys are encrypted. Enter your passphrase to unlock them for this session.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="unlock-passphrase" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                Passphrase
              </label>
              <div className="relative">
                <input
                  id="unlock-passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUnlock();
                  }}
                  placeholder="Enter your encryption passphrase"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all"
                  autoFocus
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </motion.div>
            )}

            <button
              onClick={handleUnlock}
              disabled={!passphrase.trim() || isUnlocking}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)] hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.35)] hover:from-amber-500 hover:to-orange-600 transition-all active:scale-[0.97] disabled:opacity-50 disabled:shadow-none disabled:bg-zinc-800 disabled:from-zinc-800 disabled:to-zinc-800 flex items-center justify-center gap-2"
            >
              {isUnlocking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              {isUnlocking ? "Decrypting..." : "Unlock Keys"}
            </button>
          </div>

          <p className="mt-6 text-[10px] text-zinc-700 text-center leading-relaxed">
            Your passphrase is never stored. If you lose it, your encrypted API keys
            cannot be recovered.
          </p>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-zinc-700 text-center mb-3 leading-relaxed">
              Forgot your passphrase? You can reset encryption and re-enter your keys.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Reset encryption? This will delete all encrypted API keys. You will need to re-enter them in Settings.")) {
                  clearEncryption();
                  window.location.reload();
                }
              }}
              className="w-full py-2.5 border border-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Reset Encryption
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
