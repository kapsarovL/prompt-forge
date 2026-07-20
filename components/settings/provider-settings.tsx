"use client";

import { Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2, Trash2, Globe } from "lucide-react";
import { OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";
import type { ProviderSettingsProps } from "./types";

export function ProviderSettings({
  state, setState, name, description, accentColor, placeholder, docUrl, docLabel, hasKey, onSave, onClear,
}: ProviderSettingsProps) {
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
