# Progress Tracker

## Current Phase
Phase 1 — MVP / Foundation

## Mục tiêu hiện tại
Build passes clean with Tailwind v4 migration. Fix CSP violations for Webflow/Cloudflare deployment.

## Đã hoàn thành
- ✅ Migrated Tailwind v3 → v4 syntax (`bg-gradient-*` → `bg-linear-*`, etc.)
- ✅ Fix `tsconfig.json` to exclude `forge-prompt/` sub-project
- ✅ Build passes: Next.js 16.2.6 + Turbopack, 7 static pages
- ✅ CSP fix: added `CSP_ASSET_ORIGINS` env var → injected into `font-src`, `style-src`, `script-src`
- ✅ State extracted into 5 custom hooks (PromptForge: 705 → 285 lines)
- ✅ API key encryption (AES-256-GCM + PBKDF2)
- ✅ Input sanitization + prompt injection detection
- ✅ AbortController on all 4 providers
- ✅ Security headers in next.config.ts (CSP, X-Frame-Options, etc.)
- ✅ Schema-versioned localStorage with migration support
- ✅ Updated stale context docs (architecture.md, code-standards.md, ai-workflow-rules.md)
- ✅ Refactored settings-modal.tsx (705 → ~260 lines) into 4 files with shared components
- ✅ Refactored lib/api.ts (459 → 358 lines) — unified dispatcher, helpers, error messages
- ✅ Default Gemini model changed to `gemini-3.1-pro-preview`
- ✅ All hero badges: "Multi-model prompt engineering"
- ✅ Landing page: pricing section, FAQ pricing Q, navbar pricing link
- ✅ Provider naming standardized: Gemini, Claude, GPT, OpenCode (all user-facing text)
- ✅ Forge footer: "One-time purchase — $10" + GitHub link
- ✅ Landing footer: provider names, pricing text, Privacy link fixed
- ✅ Forge vault model badge: proper label display via MODEL_LABELS lookup
- ✅ Settings modal: Claude tab description, Codex description lists GPT-4o/o3-mini
- ✅ Forge hero: BYOK subtitle with provider names
- ✅ Error messages: Codex-specific "Codex API key is missing"
- ✅ All 110 tests pass, lint clean (0 errors), build succeeds
- ✅ Both footers: Terms of Service link added to Legal section
- ✅ FAQ: 3 new questions — payment methods, refund policy, trial period
- ✅ Settings modal: DEFAULT_MODELS constant replaces all hardcoded model IDs
- ✅ Pricing changed: $10 one-time → 7-day free trial, then $5 one-time (all 9 references updated)
- ✅ Audience pivot: developer/engineer → freelancer across all user-facing copy and context docs
- ✅ Playwright e2e tests: 11 tests (8 forge-flow + 3 landing) — all passing

## Đang làm
- (none)

## Tiếp theo
- [ ] Deployment setup (Vercel or equivalent)
- [ ] Additional e2e coverage: evaluation flow, refine flow, gallery save/delete

## Open Questions
- (none)
