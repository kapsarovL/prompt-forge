# Progress Tracker

## Current Phase

Feature work — 9-phase remediation plan (completed), test infrastructure, UI polish

## Completed

- [x] `context/architecture.md` — system structure, component tree, storage model, state architecture, invariants, feature structure, file layout
- [x] `context/project-overview.md` — product definition, goals, features, scope, tech stack
- [x] `context/ui-context.md` — theme, colors, typography, spacing, component conventions, animation patterns, responsive design, icons
- [x] `context/code-standards.md` — component standards, TypeScript standards, imports, CSS, state management, error handling, naming conventions, file size guidelines
- [x] `context/ai-workflow-rules.md` — development workflow, scoping rules, delivery approach, AI agent behavioral rules, guardrails
- [x] `context/security.md` — security philosophy, core principles, current rules, infrastructure security, long-term goals, AI security considerations
- [x] `context/progress-tracker.md` — this file
- [x] `components/forge-skeleton.tsx` — `OutputPanelSkeleton` + `EvaluationSkeleton` components with shimmer animations
- [x] `forge-generator.tsx` — output panel loading state upgraded from ring spinner to `OutputPanelSkeleton`
- [x] `evaluation-modal.tsx` — evaluation loading state upgraded from spinner to `EvaluationSkeleton`
- [x] `globals.css` — added `@keyframes shimmer` animation for skeleton gradient effect
- [x] Test infrastructure: Vitest + Testing Library (unit), Playwright (e2e)
- [x] 6 unit test files & 1 e2e test file — 33 tests passing
- [x] UI polish: feature card scroll-triggered entrance animations, forge-hero hover:scale-105 CTAs, arrow icon on secondary CTA
- [x] Wrap `JSON.parse(feedback)` in try/catch
- [x] Fix "Launch App" href from `/` to `/forge`
- [x] Fix `min-w-45px` → `min-w-[45px]`
- [x] Fix `min-h-150px` → `min-h-[150px]`
- [x] Fix model badge "undefined" fallback
- [x] Add `.catch()` to all 4 clipboard writes
- [x] Fix export blob URL leak (add `URL.revokeObjectURL`) + Windows-safe filename

### Phase 2 — Modal UX Improvements

- [x] Create `hooks/use-modal.ts` — Escape key, backdrop click, focus restoration, ARIA
- [x] Adopt `useModal` in all 5 modals: evaluation, feedback, gallery, versions, settings

### Phase 3 — Destructive Confirmations

- [x] `window.confirm` on Clear All history
- [x] `window.confirm` on delete history item
- [x] `window.confirm` on clear Gemini API key
- [x] `window.confirm` on clear OpenCode API key
- [x] `window.confirm` on delete template

### Phase 4 — Proactive API Key Detection

- [x] Warning banner in forge-generator when no API key configured for active provider
- [x] Generate button disabled with tooltip when no key available
- [x] `hasApiKey` prop computed based on provider + env/localStorage

### Phase 5 — Race Condition Guards

- [x] Early-return guard (`if (isXxx) return`) on all async handlers: generate, enhance, auto-fix, evaluate, refine

### Phase 6 — Accessibility

- [x] `role="status"` + `aria-live="polite"` on toast
- [x] `aria-describedby` on output panel
- [x] `role="alert"` on error boundary
- [x] `aria-label` on all icon-only buttons (copy, delete, close, eye toggle, stars)
- [x] `aria-label` on star rating buttons (descriptive by count)

### Phase 7 — Architectural Debt

- [x] Add `Template` type to `lib/types.ts`
- [x] `useMemo` on `allTemplates` + `filteredTemplates`
- [x] Delete dead `hooks/use-mobile.ts`

### Phase 8 — Medium Issues

- [x] AbortController + 30s timeout on OpenCode fetch calls (completion, evaluate)
- [x] AbortController + 15s timeout on OpenCode key validation

### Phase 9 — Context Doc Updates

- [x] Updated `ui-context.md` — amber accent, rounded-xl, useModal pattern, ARIA, hamburger menu
- [x] Updated `security.md` — marked AbortController as implemented
- [x] Updated `progress-tracker.md` — documented all 9 phases

## In Progress

- (none)

## Recently Completed

### Improvement Sprint

- [x] **Extracted hooks from PromptForge** — created `hooks/use-prompt-state.ts`, `hooks/use-provider-state.ts`, `hooks/use-history-state.ts`, `hooks/use-modal-state.ts`, `hooks/use-toast.ts`. Reduced PromptForge from ~705 lines to ~120 lines of composition logic.
- [x] **AbortController + timeout on all providers** — added 30s timeout with AbortController to Gemini (via Promise.race + abort signal), Anthropic, and Codex clients. OpenCode already had it.
- [x] **Security headers** — updated CSP in `next.config.ts` to include `api.anthropic.com`, `api.openai.com`, `frame-ancestors 'none'`, and `clipboard-write=self` in Permissions-Policy.
- [x] **API key encryption** — created `lib/crypto.ts` with AES-256-GCM + PBKDF2 (600K iterations). Added `EncryptionLock` unlock overlay, Security tab in SettingsModal, encryption integration in `useProviderState`.
- [x] **Versioned localStorage schema** — created `lib/storage.ts` with `STORAGE_KEYS` constants, `initStorage()` with migration runner, typed read/write helpers. Added `StorageInit` component to root layout.
- [x] **Input sanitization** — created `lib/sanitize.ts` with detection of prompt injection patterns (ignore/override/disregard), control char stripping, length enforcement. Integrated into `lib/api.ts` for all provider calls.
- [x] **Test coverage expansion** — 10 test files, 80 tests (up from 33). Added tests for: sanitize (20), storage (14), toast hook (9), forge-generator (12), plus existing 25 tests.
- [x] Anthropic provider support — `lib/anthropic.ts` (fetch-based, no SDK dep), `Provider` union updated, `ANTHROPIC_MODELS` added, 5 API functions branched via `ApiConfig.anthropicConfig`, Anthropic toggle button in forge-generator, Anthropic settings in settings-modal, state persistence in prompt-forge
- [x] OpenAI Codex provider support — `lib/codex.ts` (fetch-based, no SDK dep), `Provider` union + `CODEX_MODELS` added, 5 API functions branched via `ApiConfig.codexConfig`, Codex toggle button in forge-generator, Codex settings in settings-modal, state persistence in prompt-forge

### Landing Page Overhaul

- [x] `FeatureCard` — added `icon` prop; icon container with amber tint + hover state
- [x] `ScrollProgress` — fixed top-of-viewport amber gradient bar that fills on scroll
- [x] `Navbar` — desktop scroll links (Features, How It Works, FAQ) + mobile hamburger with slide-down menu
- [x] `Hero` — gradient-accent headline, animated product mockup showing input/output panels with browser chrome
- [x] `FeaturesSection` — existing 6-card grid wrapped in `rounded-2xl` overflow-hidden, each card now has an icon
- [x] `HowItWorksSection` — 3-step flow with icon circles, numbered badges, connecting gradient line on desktop
- [x] `WhyPromptForgeSection` — 2x2 differentiators grid (zero backend, multiple providers, version tracking, evaluation)
- [x] `FAQSection` — 6-question accordion with AnimatePresence expand/collapse, split layout (heading left, questions right)
- [x] `Footer` — 4-column grid (brand + product/resources/legal link groups) with copyright and license
- [x] `ForgeFeatures` — updated with icons to match new FeatureCard interface

### Forge Page Polish

- [x] `ForgeNavbar` — redesigned to match landing page: Settings/Versions/GitHub buttons, mobile hamburger, removed "Get Started"
- [x] `ForgeGenerator` — compact page header, API key warning banner, Ctrl+Enter hint, refined category buttons, provider toggle grid, better empty state, smoother output transitions, refined toolbar/refine-bar
- [x] `ForgeVault` — stagger entrance animations, category icons + badges, model badge, faded action buttons on hover, better empty state
- [x] `ForgeFeatures` — made compact (reduced padding), moved below vault, uses updated FeatureCard with icons
- [x] `ForgeFooter` — redesigned to match landing footer (brand info, GitHub link, copyright, MIT license)
- [x] `prompt-forge.tsx` — removed `ForgeHero` section entirely, reordered sections (Navbar → Generator → Vault → Features → Footer), wired `onOpenSettings`/`onOpenVersions`/`hasGeneratedPrompt` to `ForgeNavbar`

### Visual Design Polish

- [x] Noise overlay (`/noise.svg`) added to forge page root, generator, vault, features, and footer for cohesive texture
- [x] Ambient amber/orange glow blobs added at page level (matching landing page)
- [x] `ForgeNavbar` — noise bg, amber underline hover effect on nav links, shadow glow on brand icon, improved mobile menu with dot indicators, hover bg on GitHub icon
- [x] `ForgeGenerator` — gradient text heading ("The Forge"), staggered entrance animations on control sections, `forge-ember` CSS effect on generate CTA, stronger shadows + hover states on category buttons and provider toggles, improved output panel with terminal icon container, higher dot-grid opacity on hover, larger empty-state terminal icon
- [x] `ForgeVault` — gradient section heading, card hover lift (-translate-y-0.5 + amber border glow + shadow), better empty state, improved search focus ring, hover bg on action buttons, arrow icon animation on recall, "Load More" button hover state
- [x] `ForgeFeatures` — upgraded to `gap-px bg-zinc-900/50` pattern matching landing page exactly, border on container, noise bg, gradient heading
- [x] `ForgeFooter` — full 4-column grid matching landing footer (Product/Resources/Legal + brand), noise overlay, shadow on brand icon, GitHub link in bottom bar

### Forge Hero (Re-added & Improved)

- [x] `ForgeHero` — completely rewritten with landing-page-quality design: gradient heading ("Engineer every prompt."), "Powered by Gemini, Claude & more" badge, staggered entrance animations, browser chrome mockup showing input/output panels with shimmer skeleton placeholder, ember-effect primary CTA + secondary "Browse Templates" CTA
- [x] `prompt-forge.tsx` — re-imported `ForgeHero`, placed between Navbar and Generator, wired `onBrowseGallery` to gallery modal
- [x] `forge-generator.tsx` — reduced `pt-28` to `pt-16` to account for hero above

## Open Questions

- None currently

## Next Steps

- Monitor for any regression after the improvement sprint
- Evaluate if the extracted hooks have the right API surface
- Consider adding Crypto subtle tests (skipped due to jsdom limitations)
- Add e2e tests for the forge flow (generate, evaluate, refine)

## Recent

### Open-Source Readiness (May 2026)

- [x] `package.json` — added description, license (MIT), author, keywords, bugs/homepage URLs
- [x] `.env.example` — restored and added to `.gitignore` exception
- [x] `README.md` — overhauled with forge logo SVG hero, filled all feature `<details>` blocks, added Anthropic + Codex to tech stack/provider config/data persistence tables, fixed Next.js version badges, fixed CI badge URL to `kapsarovL`
- [x] `SECURITY.md` — added project-level security policy
- [x] `CONTRIBUTING.md` — added contribution guide
- [x] GitHub templates — added bug report + feature request issue templates, PR template
- [x] `CODE_OF_CONDUCT.md` — added
- [x] GitHub repo metadata — topics set via CI workflow trigger
- [x] CI — fixed Node.js to v22 for pnpm 11 compatibility
- [x] `.pnpmfile.cjs` — added for transitive dep overrides (postcss >=8.5.10, ws >=8.20.1)
- [x] Security patches — Next.js 16.2.3 → 16.2.5 → 16.2.6, postcss override, ws override
- [x] `engines.node` — pinned to `22.x` to suppress Vercel auto-upgrade warning
- [x] Context docs sync — updated `project-overview.md`, `architecture.md`, `code-standards.md`, `security.md` for Anthropic/Codex multi-provider state
