<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#050505"/>
      <stop offset="100%" style="stop-color:#0a0a0a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#ea580c;stop-opacity:0.05"/>
    </linearGradient>
    <linearGradient id="title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fef3c7"/>
      <stop offset="50%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#ea580c"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)"/>
  <rect width="800" height="400" fill="url(#glow)"/>

  <!-- Noise dots -->
  <g opacity="0.06">
    <circle cx="50" cy="50" r="1" fill="#fff"/>
    <circle cx="150" cy="80" r="1" fill="#fff"/>
    <circle cx="250" cy="40" r="1" fill="#fff"/>
    <circle cx="350" cy="70" r="1" fill="#fff"/>
    <circle cx="450" cy="50" r="1" fill="#fff"/>
    <circle cx="550" cy="90" r="1" fill="#fff"/>
    <circle cx="650" cy="30" r="1" fill="#fff"/>
    <circle cx="750" cy="60" r="1" fill="#fff"/>
    <circle cx="100" cy="130" r="1" fill="#fff"/>
    <circle cx="200" cy="150" r="1" fill="#fff"/>
    <circle cx="300" cy="120" r="1" fill="#fff"/>
    <circle cx="400" cy="140" r="1" fill="#fff"/>
    <circle cx="500" cy="130" r="1" fill="#fff"/>
    <circle cx="600" cy="160" r="1" fill="#fff"/>
    <circle cx="700" cy="110" r="1" fill="#fff"/>
    <circle cx="80" cy="220" r="1" fill="#fff"/>
    <circle cx="180" cy="240" r="1" fill="#fff"/>
    <circle cx="280" cy="210" r="1" fill="#fff"/>
    <circle cx="380" cy="230" r="1" fill="#fff"/>
    <circle cx="480" cy="220" r="1" fill="#fff"/>
    <circle cx="580" cy="250" r="1" fill="#fff"/>
    <circle cx="680" cy="200" r="1" fill="#fff"/>
    <circle cx="780" cy="230" r="1" fill="#fff"/>
    <circle cx="120" cy="310" r="1" fill="#fff"/>
    <circle cx="220" cy="330" r="1" fill="#fff"/>
    <circle cx="320" cy="300" r="1" fill="#fff"/>
    <circle cx="420" cy="320" r="1" fill="#fff"/>
    <circle cx="520" cy="310" r="1" fill="#fff"/>
    <circle cx="620" cy="340" r="1" fill="#fff"/>
    <circle cx="720" cy="290" r="1" fill="#fff"/>
    <circle cx="40" cy="360" r="1" fill="#fff"/>
    <circle cx="160" cy="380" r="1" fill="#fff"/>
    <circle cx="340" cy="370" r="1" fill="#fff"/>
    <circle cx="460" cy="350" r="1" fill="#fff"/>
    <circle cx="640" cy="390" r="1" fill="#fff"/>
    <circle cx="760" cy="370" r="1" fill="#fff"/>
  </g>

  <!-- Ambent glow rings -->
  <circle cx="400" cy="210" r="160" fill="none" stroke="#f59e0b" stroke-width="0.5" opacity="0.10"/>
  <circle cx="400" cy="210" r="135" fill="none" stroke="#f59e0b" stroke-width="0.5" opacity="0.07"/>
  <circle cx="400" cy="210" r="110" fill="none" stroke="#f59e0b" stroke-width="0.5" opacity="0.15"/>

  <!-- Forge logo mark: anvil + spark -->
  <!-- Anvil body -->
  <polygon points="378,55 422,55 442,100 358,100" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.7"/>
  <polygon points="365,100 435,100 415,132 385,132" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
  <rect x="384" y="132" width="32" height="8" rx="2" fill="#f59e0b" opacity="0.35"/>

  <!-- Spark particles -->
  <circle cx="395" cy="38" r="3" fill="#f59e0b" opacity="0.9"/>
  <circle cx="408" cy="30" r="2" fill="#ea580c" opacity="0.7"/>
  <circle cx="415" cy="45" r="1.5" fill="#fbbf24" opacity="0.8"/>
  <circle cx="388" cy="45" r="1" fill="#ea580c" opacity="0.5"/>
  <circle cx="405" cy="50" r="1" fill="#f59e0b" opacity="0.4"/>

  <!-- Title -->
  <text x="400" y="175" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="800" fill="url(#title-grad)" letter-spacing="-1">PromptForge</text>

  <!-- Subtitle -->
  <text x="400" y="220" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#a1a1aa" letter-spacing="2">AI Prompt Engineering Toolkit</text>

  <!-- Ambent divider -->
  <line x1="340" y1="245" x2="460" y2="245" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>

  <!-- Tagline -->
  <text x="400" y="280" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="400" fill="#71717a" letter-spacing="1">No backend · No servers · No signup</text>

  <!-- Badge row - 6 tech badges -->
  <g transform="translate(178, 325)">
    <rect x="0" y="0" width="70" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="35" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">Next.js 16</text>

    <rect x="78" y="0" width="70" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="113" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">React 19</text>

    <rect x="156" y="0" width="75" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="193" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">TypeScript</text>

    <rect x="239" y="0" width="72" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="275" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">Tailwind v4</text>

    <rect x="319" y="0" width="55" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="347" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">pnpm</text>

    <rect x="382" y="0" width="63" height="26" rx="13" fill="none" stroke="#27272a" stroke-width="1"/>
    <text x="414" y="18" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a1a1aa">Motion</text>
  </g>
</svg>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#technology-stack">Stack</a> ·
  <a href="#installation--setup">Setup</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-000?logo=next.js&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/node-%3E%3D22-green?logo=node.js&logoColor=white" alt="Node >=22"/>
  <img src="https://img.shields.io/badge/pnpm-latest-F69220?logo=pnpm&logoColor=white" alt="pnpm"/>
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT"/>
  <br/>
  <img src="https://github.com/kapsarovL/prompt-forge/actions/workflows/ci.yml/badge.svg" alt="CI"/>
</p>

---

## Overview

**PromptForge** is a client-side prompt engineering workspace for crafting, refining, evaluating, and optimizing LLM prompts. It runs entirely in the browser — zero backend, zero database, zero user accounts.

Convert natural language intent into structured, high-performing prompts. Iterate with AI assistance. Evaluate against objective criteria. Save and organize what works.

Built for developers, content creators, and analysts who want precision over guesswork.

### Key Philosophy

> **No backend. No servers. No signup.**  
> Your API keys, your prompts, your browser. That's it.

---

## Features

### Generation & Refinement

<details open>
<summary><strong>Prompt Generation</strong> — Convert natural language intent into structured prompts</summary>

Describe what you want in plain language, select a category, choose a model, and let AI forge a polished, production-ready prompt. Supports Gemini, Anthropic Claude, OpenCode, and OpenAI Codex providers.

</details>

<details open>
<summary><strong>Smart Enhance</strong> — One-click improvement of your intent description before generation</summary>

Not sure how to phrase your intent? Hit the wand icon to let AI rewrite your description with more clarity and detail before generation — giving the prompt engine better material to work with.

</details>

<details open>
<summary><strong>Refinement</strong> — Iterative prompt polishing via natural language instructions</summary>

Already have a prompt but want to tweak it? Use the refine panel to give natural language instructions ("make it more concise", "add error handling examples") and the output updates in place without starting over.

</details>

### Evaluation & Improvement

- **Deep Evaluation** — AI-driven assessment scoring every prompt across 3 criteria: clarity, specificity, and misinterpretation risk, with detailed breakdowns
- **Auto-Fix** — Automatically applies evaluation suggestions to improve the prompt, then saves the optimized version to history

### Management & Organization

- **History Vault** — Searchable generation history (50 items) with one-click recall, category/model filtering, and bulk clear
- **Version Control** — Automatic snapshots of every generation (20 items), accessible via the Versions panel for rollback
- **Template Gallery** — 12 built-in templates across 4 categories (Coding, Creative, Analysis, General) + user-saved custom templates with search and filtering
- **Copy & Export** — Direct clipboard copy or text file download with auto-named files

### Configuration

- **Multi-Provider Settings** — Independent API key management for Gemini, Anthropic Claude, OpenCode, and OpenAI Codex
- **Model Selection** — Per-provider model dropdowns with appropriate model choices
- **OpenCode Base URL** — Configurable endpoint for self-hosted or alternate API targets

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16.2.6](https://nextjs.org/) (App Router) |
| UI Library | [React 19.2.4](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://github.com/tw-in-js/tw-animate-css) |
| Animations | [Motion 12.38.0](https://motion.dev/) |
| Icons | [Lucide React 0.577.0](https://lucide.dev/) |
| AI: Gemini | [@google/genai](https://github.com/google-gemini/generative-ai-js) (official SDK) |
| AI: Anthropic | [@anthropic-ai/sdk](https://github.com/anthropics/anthropic-sdk-typescript) (official SDK) |
| AI: OpenCode | Native `fetch` (OpenAI-compatible API) |
| AI: Codex | Native `fetch` (OpenAI-compatible API) |
| Persistence | Web [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API |
| Package Manager | [pnpm](https://pnpm.io/) |
| CI | [GitHub Actions](https://github.com/features/actions) (lint → test → build) |
| Formatting | [Prettier](https://prettier.io/) + [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) |
| Linting | [ESLint 9](https://eslint.org/) flat config · `next/core-web-vitals` |

---

## Installation & Setup

### Prerequisites

- **Node.js** >= 22
- **pnpm** (recommended) — install via `npm install -g pnpm`

### Quick Start

```bash
# Clone the repository
git clone https://github.com/prismaflux/prompt-forge.git
cd prompt-forge

# Install dependencies
pnpm install

# Set up environment (optional — keys can be managed in-app)
cp .env.example .env.local
# Add your Gemini API key to .env.local (or skip to use Settings UI)

# Start development server
pnpm dev
```

Visit `http://localhost:3000` — the Forge app is at `/forge`.

### Production Build

```bash
pnpm build
pnpm start
```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `pnpm dev` | `next dev` | Development server |
| `pnpm build` | `next build` | Production build |
| `pnpm start` | `next start` | Production server |
| `pnpm lint` | `eslint` | Run ESLint |
| `pnpm format` | `prettier --write .` | Format all files |
| `pnpm test` | `vitest run` | Run unit tests |
| `pnpm test:watch` | `vitest` | Run tests in watch mode |
| `pnpm test:e2e` | `playwright test` | Run E2E tests |
| `pnpm coverage` | `vitest run --coverage` | Run tests with coverage report |

---

## Usage

### Basic Workflow

```
1. Navigate to /forge
2. Click Settings → add your API key(s)
3. Select provider (Gemini or OpenCode) and model
4. Enter your intent in the description field
5. Choose a category (Coding, Creative, Analysis, General)
6. Click "Generate Prompt" — or use Smart Enhance first (wand icon)
7. Use toolbar actions: Copy, Evaluate, Refine, Export, Versions
8. Browse history in the Vault section
9. Save effective prompts to the Template Gallery
```

### Keyboard Shortcut

- **Ctrl + Enter** — Generate prompt (when description field is focused)
- **Esc** — Close any open modal

### Provider Configuration

#### Gemini
1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter it in Settings → Google Gemini
3. Or set `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`

#### Anthropic (Claude)
1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Enter it in Settings → Anthropic
3. Select your preferred Claude model

#### OpenCode
1. Obtain an API key from your OpenCode provider
2. Enter it in Settings → OpenCode
3. Optionally change the model or base URL
4. Default model: `opencode/big-pickle`
5. Default base URL: `https://opencode.ai/zen/v1`

#### OpenAI Codex
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Enter it in Settings → Codex
3. Select your preferred Codex model

---

## Project Structure

```
prompt-forge/
├── app/
│   ├── layout.tsx             Root layout, fonts, metadata
│   ├── globals.css            Tailwind v4 + custom CSS utilities
│   ├── page.tsx               Landing page (Home)
│   └── forge/
│       └── page.tsx           Forge app shell
├── components/
│   ├── prompt-forge.tsx       Main orchestrator (33 state vars)
│   ├── forge-generator.tsx    Input/output panel
│   ├── forge-navbar.tsx       Top navigation
│   ├── forge-hero.tsx         Hero section
│   ├── forge-features.tsx     Features section
│   ├── forge-vault.tsx        History browser
│   ├── forge-footer.tsx       Footer
│   ├── forge-toast.tsx        Notifications
│   ├── settings-modal.tsx     API key management
│   ├── gallery-modal.tsx      Template gallery
│   ├── evaluation-modal.tsx   Evaluation results
│   ├── versions-modal.tsx     Version history
│   ├── feedback-modal.tsx     Feedback form
│   ├── feature-card.tsx       Reusable card
│   └── error-boundary.tsx     Error boundary
├── lib/
│   ├── types.ts               Types, constants, models
│   ├── gemini.ts              Gemini API client
│   ├── opencode.ts            OpenCode API client
│   └── utils.ts               cn() utility
├── hooks/
│   └── use-mobile.ts          Mobile detection hook
└── context/                   Architecture documentation
```

---

## Data Persistence

All user data is stored in browser **localStorage**. Clearing browser data will reset all saved information.

| Key | Type | Description |
|-----|------|-------------|
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
| `promptforge_versions` | `PromptVersion[]` | Version snapshots (max 20) |
| `promptforge_custom_templates` | `Record<string, string[]>` | Saved templates |
| `promptforge_feedback` | `Feedback[]` | Submitted feedback |

---

## Development

### Extending with a New Provider

1. Create `lib/{provider}.ts` — config retrieval, validation, generation with retry
2. Add the provider type to `lib/types.ts`
3. Wire handlers in `components/prompt-forge.tsx`
4. Add model/configuration UI to `components/settings-modal.tsx`
5. Add provider toggle option to `components/forge-generator.tsx`

### Code Standards

- All interactive components use `"use client"` directive
- TypeScript strict mode — no `any` types, `unknown` and narrow
- Use `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Async handlers follow `try/catch/finally` with toast notifications
- Component props follow `onX` convention for event handlers

### Before Committing

```bash
pnpm lint     # Must pass with zero errors
pnpm build    # Must succeed with zero type errors
```

---

## Contributing

We welcome contributions of all sizes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `pnpm lint` and `pnpm build` — both must pass
5. Commit with a descriptive message
6. Push and open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.  
This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## License

[MIT](./LICENSE) — Free for personal and commercial use.

---

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/) — LLM provider integration
- [OpenCode Platform](https://opencode.ai/) — Alternative LLM provider
- [Next.js](https://nextjs.org/) & [React](https://react.dev/) teams
- [Tailwind CSS](https://tailwindcss.com/) & [Motion](https://motion.dev/)
- [Lucide Icons](https://lucide.dev/) — Beautiful open-source icons
- All open-source contributors who maintain this project's dependencies
