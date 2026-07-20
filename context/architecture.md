# Architecture

## System Structure

### Overview

PromptForge is a **client-side only** Next.js 16 application (React 19) with zero backend. All logic runs in the browser. AI providers (Gemini, Anthropic Claude, OpenCode, OpenAI Codex) are called directly from the client via their APIs — no proxy server.

```bash

┌─────────────────────────────────────────────────────┐
│                     Browser                          │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │              Next.js App Router                   ││
│  │                                                    ││
│  │  / (landing page)     /forge (forge app)           ││
│  │     ┌─────────┐         ┌──────────────────┐       ││
│  │     │ Home    │         │ PromptForgePage   │       ││
│  │     │ (page)  │         │ ┌──────────────┐  │       ││
│  │     └─────────┘         │ │ ErrorBoundary│  │       ││
│  │                         │ │ ┌──────────┐ │  │       ││
│  │                         │ │ │PromptForge│ │  │       ││
│  │                         │ │ │(orchestr.)│ │  │       ││
│  │                         │ │ └──────────┘ │  │       ││
│  │                         │ └──────────────┘  │       ││
│  │                         └──────────────────┘       ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │           State: React useState/useEffect          ││
│  │      Persistence: localStorage (9 keys)            ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │        AI Providers (direct client calls)          ││
│  │                                                    ││
│  │  Gemini ─── @google/genai SDK ────► api.google.com         ││
│  │  Anthropic ─ @anthropic-ai/sdk ───► api.anthropic.com      ││
│  │  OpenCode ── fetch() ─────────────► user's base URL        ││
│  │  Codex ───── fetch() ─────────────► api.openai.com         ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Key Characteristics

- **Zero backend**: No API routes, no database, no server-side data processing
- **Static-first**: The forge page is fully client-rendered ("use client")
- **Single-page application**: Within `/forge`, all navigation is state-driven (modal toggles, scroll sections)
- **State extracted into hooks**: `components/prompt-forge.tsx` (285 lines) composes 5 custom hooks that own all state

---

## Component Architecture

### Component Tree

```bash
RootLayout (app/layout.tsx)
  ├── Home (app/page.tsx) — landing/marketing page
  │     ├── Navbar, Hero, FeaturesSection
  │     ├── HowItWorksSection, WhyPromptForgeSection
  │     ├── PricingSection, FAQSection, Footer
  │     └── ScrollProgress
  │
  └── PromptForgePage (app/forge/page.tsx)
        └── ErrorBoundary
              └── PromptForge (components/prompt-forge.tsx) — *** orchestrator ***
                    ├── ForgeNavbar — top navigation
                    ├── ForgeHero — animated headline + CTA
                    ├── ForgeFeatures — feature highlight cards
                    │     └── FeatureCard (×3)
                    ├── ForgeGenerator — main input/output panel (486 lines)
                    ├── ForgeVault — history browser
                    ├── ForgeFooter — branding + GitHub link
                    ├── VersionsModal — version history
                    ├── GalleryModal — template gallery
                    ├── EvaluationModal — evaluation results
                    ├── FeedbackModal — user feedback form
                    ├── SettingsModal — API key management (300 lines)
                    │     ├── ProviderSettings
                    │     └── EncryptionSettings
                    └── ForgeToast — notification popup
```

### Component Roles

| Component | Role | State Owner | Lines |

|-----------|------|-------------|-------|
| `PromptForge` | Orchestrator — composes 5 hooks, renders children | Hooks (via composed state) | 285 |
| `ForgeGenerator` | Primary input/output panel | PromptForge (props) | 486 |
| `SettingsModal` | API key + model config | PromptForge (props) + local transient state | 300 |
| `ForgeVault` | History list with search/pagination | PromptForge (props) | 200 |
| `GalleryModal` | Template browser with filters | PromptForge (props) | 177 |
| `EvaluationModal` | Evaluation results with auto-fix | PromptForge (props) | 173 |
| `EncryptionLock` | Unlock overlay for encrypted API keys | Local state | 132 |
| `ForgeNavbar` | Top navigation bar | PromptForge (props) | 121 |
| `FeedbackModal` | Star rating + comment form | PromptForge (props) + local transient | 113 |
| `VersionsModal` | Version history browser | PromptForge (props) | 98 |
| `ForgeSkeleton` | Loading skeleton with shimmer | Self-contained | 87 |
| `ForgeFooter` | Footer | Self-contained | 88 |
| `ForgeFeatures` | Feature cards section | Self-contained | 66 |
| `ForgeToast` | Notification popup | PromptForge (props) | 42 |
| `ErrorBoundary` | React class-based error boundary | Self (hasError) | 45 |
| `ForgeHero` | Landing section for forge page | PromptForge (props) | 41 |
| `FeatureCard` | Reusable card (number + title + desc) | Self-contained | 31 |
| `StorageInit` | Client component to init schema migration | Self-contained | 16 |

### Data Flow

- **Unidirectional**: all state lives in `PromptForge`, passed down as props
- **Events flow up**: child components call props callbacks (e.g., `handleGenerate`, `setDescription`)
- **No shared context**: no React Context, no state management library
- **Modals receive `isOpen` + `onClose`** — standard controlled pattern

---

## Storage Model

### localStorage Keys (15 total)

| Key | Type | Purpose |

|-----|------|---------|
| `promptforge_api_key` | `string` | Gemini API key |
| `pf_anthropic_key` | `string` | Anthropic API key |
| `pf_anthropic_model` | `string` | Anthropic model ID |
| `pf_codex_key` | `string` | Codex API key |
| `pf_codex_model` | `string` | Codex model ID |
| `promptforge_opencode_api_key` | `string` | OpenCode API key |
| `promptforge_opencode_model` | `string` | OpenCode model ID |
| `promptforge_opencode_base_url` | `string` | OpenCode base URL |
| `promptforge_provider` | `"gemini" \| "opencode" \| "anthropic" \| "codex"` | Active provider |
| `promptforge_history` | `PromptHistory[]` | Generation history (max 50) |
| `promptforge_custom_templates` | `Record<string, string[]>` | User-saved templates |
| `promptforge_versions` | `PromptVersion[]` | Version history (max 20) |
| `promptforge_feedback` | `Feedback[]` | User feedback submissions |

### Persistence Pattern

- On mount: `useEffect([], [])` reads all keys from localStorage into state
- On change: `useEffect([stateVar])` writes back to localStorage
- No schema versioning or migration — breaking localStorage changes will silently lose data
- JSON serialization with `JSON.stringify`/`JSON.parse`
- No size limits enforced beyond array caps (50 history, 20 versions)

---

## State Architecture

### State Architecture (Extracted Hooks)

```bash
hooks/use-provider-state.ts  — Provider, all API keys, models, base URLs, encryption
hooks/use-prompt-state.ts    — Description, category, model, generated prompt, refine state
hooks/use-history-state.ts   — History array, versions, custom templates
hooks/use-modal-state.ts     — All 5 modal visibilities + transient form state
hooks/use-toast.ts           — Toast notification state with auto-dismiss

PromptForge composes all 5 hooks, reducing orchestrator size by ~83%.
```

### Side Effects (useEffect)

| Trigger | Action |

|---------|--------|
| Mount `[]` | Load provider state, history, templates, versions from localStorage |
| `[provider]` | Persist provider choice |
| `[history]` | Persist history array |
| `[customTemplates]` | Persist templates |
| `[versions]` | Persist version snapshots |

---

## Boundaries & Constraints

### What PromptForge Does NOT Do

- **No backend communication** — no API routes, no server components, no database
- **No authentication** — no login, no session, no user accounts
- **No server-side rendering** of dynamic content
- **No real-time collaboration**
- **No request queuing or deduplication**
- **No offline support** — localStorage persists but all features require network
- **No encryption of stored API keys**

### API Client Boundaries

- Both clients call their AI APIs **directly from the browser**
- CORS must be enabled on the AI provider or the user must use a proxy
- No API response caching (identical prompts re-fire every time)
- No request cancellation (AbortController not used)
- Gemini retries 503/429 (×3, exponential backoff)
- OpenCode retries 503 (×3, exponential backoff)

---

## Invariants

1. **All user data survives page refresh** via localStorage — except transient UI state (modal visibility, loading states, input textarea content)
2. **At least one AI provider must be configured** with a valid API key for generation to work
3. **History is capped at 50 items** — oldest items are dropped silently on overflow
4. **Versions are capped at 20 snapshots** — oldest items are dropped silently on overflow
5. **The forge page always renders** — ErrorBoundary catches runtime errors and shows a fallback UI
6. **Provider choice is sticky** — persisted to localStorage and restored on next visit
7. **All child components are stateless** regarding business logic — they receive state and callbacks as props

---

## Feature Structure

### Feature Organization by Domain

Each feature maps to one or more components and a set of handlers in PromptForge:

#### 1. Prompt Generation — Core Flow

```bash
Components: ForgeGenerator (input + output panels)
State:      description, category, model, generatedPrompt, provider
Handlers:   handleGenerate
API:        Gemini generateWithRetry | OpenCode openCodeGenerateWithRetry
Persistence: promptforge_history (on success)
```

#### 2. Prompt Refinement

```bash
Components: ForgeGenerator (refine bar, collapsible)
State:      showRefineInput, refineInstruction, isRefining
Handlers:   handleRefine
API:        Same as generation, with context = generatedPrompt + instruction
```

#### 3. Smart Enhance

```bash
Components: ForgeGenerator (wand button in textarea)
State:      isEnhancing, description
Handlers:   handleSmartEnhance
API:        generation with enhancement system prompt
```

#### 4. Evaluation

```bash
Components: EvaluationModal
State:      isEvaluationOpen, evaluationResult, evaluationError, isEvaluating
Handlers:   handleEvaluate
API:        Gemini: structured Type.VOICE output; OpenCode: raw JSON string parsing
```

#### 5. Auto-Fix

```bash
Components: EvaluationModal (auto-fix button)
State:      isAutoFixing
Handlers:   handleAutoFix
API:        generation using evaluation weaknesses + suggestions as context
```

#### 6. History / Vault

```bash
Components: ForgeVault
State:      history, historySearch, visibleHistoryCount
Handlers:   handleRecall, handleDeleteHistory, handleClearAllHistory
Persistence: promptforge_history
```

#### 7. Versions

```bash
Components: VersionsModal
State:      versions, isVersionsOpen
Handlers:   (snapshot taken on every generation)
Persistence: promptforge_versions
```

#### 8. Template Gallery

```bash
Components: GalleryModal
State:      isGalleryOpen, gallerySearch, galleryCategory, customTemplates
Handlers:   handleSaveTemplate, handleDeleteTemplate
Persistence: promptforge_custom_templates
```

#### 9. Provider Management

```bash
Components: SettingsModal
State:      provider, userApiKey, anthropicKey, anthropicModel,
            codexKey, codexModel, opencodeKey, opencodeModel, opencodeBaseUrl
Handlers:   handleSaveGeminiKey, handleClearGeminiKey,
            handleSaveAnthropicKey, handleClearAnthropicKey, handleSetAnthropicModel,
            handleSaveCodexKey, handleClearCodexKey, handleSetCodexModel,
            handleSaveOpenCodeKey, handleClearOpenCodeKey,
            handleSetOpencodeModel, handleSetOpencodeBaseUrl
Persistence: All promptforge_* / pf_* provider keys
```

#### 10. Feedback

```bash
Components: FeedbackModal
State:      isFeedbackOpen, feedbackRating, feedbackComment, feedbackSubmitted
Handlers:   handleFeedbackSubmit
Persistence: promptforge_feedback
```

#### 11. Copy / Export

```bash
Components: ForgeGenerator (toolbar buttons)
State:      copied, generatedPrompt
Handlers:   handleCopy (navigator.clipboard.writeText),
            handleExport (text file download via blob URL)
```

#### 12. Toast Notifications

```bash
Components: ForgeToast
State:      toast
Triggered:  by all handlers on success/error
```

---

## File Layout

```bash

prompt-forge/
├── app/
│   ├── layout.tsx          — Root layout, fonts, metadata
│   ├── globals.css          — Tailwind v4 + custom CSS utilities
│   ├── page.tsx             — Landing page (Home)
│   └── forge/
│       └── page.tsx         — Forge app shell (ErrorBoundary + PromptForge)
├── components/
│   ├── prompt-forge.tsx     — MAIN ORCHESTRATOR (285 lines)
│   ├── forge-generator.tsx  — Input/output panel (486 lines)
│   ├── forge-navbar.tsx     — Top navigation
│   ├── forge-hero.tsx       — Hero section
│   ├── forge-features.tsx   — Features section
│   ├── forge-vault.tsx      — History browser (201 lines)
│   ├── forge-footer.tsx     — Footer
│   ├── forge-toast.tsx      — Notifications
│   ├── settings-modal.tsx   — API key management (300 lines)
│   ├── settings/
│   │   ├── provider-settings.tsx — Per-provider config panels
│   │   ├── encryption-settings.tsx — Encryption toggle UI
│   │   └── types.ts          — Shared settings types & constants
│   ├── landing/
│   │   ├── hero.tsx, features.tsx, how-it-works.tsx
│   │   ├── why-promptforge.tsx, pricing.tsx, faq.tsx
│   │   ├── navbar.tsx, footer.tsx, scroll-progress.tsx
│   ├── gallery-modal.tsx    — Template gallery (168 lines)
│   ├── evaluation-modal.tsx — Evaluation results (167 lines)
│   ├── versions-modal.tsx   — Version history
│   ├── feedback-modal.tsx   — Feedback form
│   ├── feature-card.tsx     — Reusable card
│   └── error-boundary.tsx   — Error boundary
├── lib/
│   ├── types.ts             — Types, constants (Provider, CATEGORIES, MODELS, etc.)
│   ├── api.ts               — Unified API dispatcher (358 lines)
│   ├── gemini.ts            — Gemini API client (SDK, retry, helpers)
│   ├── anthropic.ts         — Anthropic API client (SDK, retry, helpers)
│   ├── codex.ts             — Codex API client (fetch-based, retry, helpers)
│   ├── opencode.ts          — OpenCode API client (fetch-based, retry, helpers)
│   ├── utils.ts             — cn() utility (clsx + tailwind-merge)
│   ├── storage.ts           — Versioned localStorage with schema migration
│   ├── crypto.ts            — AES-256-GCM + PBKDF2 key encryption
│   └── sanitize.ts          — Input sanitization & prompt injection detection
├── hooks/
│   ├── use-modal.ts         — Modal hook (Escape, backdrop, focus restore)
│   ├── use-toast.ts         — Toast notifications with auto-dismiss
│   ├── use-provider-state.ts — API keys, models, encryption state
│   ├── use-prompt-state.ts   — Generation/refine/evaluate state
│   ├── use-history-state.ts  — History, versions, templates
│   └── use-modal-state.ts    — All modal visibility + form state
├── components/
│   ├── storage-init.tsx     # Client component to init schema migration
│   ├── encryption-lock.tsx  # Unlock overlay for encrypted keys
│   └── ...
└── context/                 — Architecture context files (this directory)
```

---

## Future Architecture Considerations

See `context/progress-tracker.md` for planned architectural changes, including:

- React Context for shared state (if prop drilling becomes a bottleneck)
- Code splitting for modals
- Offline capability

**Completed architectural improvements:**

- ✅ API service layer extracted (hooks/use-* + lib/storage, lib/crypto, lib/sanitize)
- ✅ Request cancellation (AbortController) on all 4 providers
- ✅ Encryption for stored API keys (AES-256-GCM + PBKDF2)
- ✅ Testing foundation (Vitest/Playwright) — 80 tests
