# Project Overview

## Product Definition

PromptForge is a **client-side AI prompt engineering tool** that helps users craft, refine, evaluate, and optimize prompts for large language models. It provides a craft-focused workspace where users iterate on prompts with AI assistance, then store and manage their results.

## Goals

1. **Provide a dedicated prompt engineering workspace** — a focused environment for iterating on prompt quality, distinct from generic chat interfaces
2. **Support multiple AI providers interchangeably** — Gemini, Anthropic Claude, OpenCode, and OpenAI Codex
3. **Enable prompt quality measurement** — automated evaluation with structured criteria (clarity, specificity, misinterpretation risk)
4. **Preserve prompt history** — automatic version tracking, recallable history, and user-saved templates
5. **Remain zero-backend** — all data persists client-side via localStorage; no user accounts, no servers, no database
6. **Be production-ready and open-source** — MIT licensed, CI/CD pipeline, clean architecture, contribution-friendly

## Users

### Primary Audience

- **Developers** crafting system prompts for code generation, architecture, and debugging tasks
- **Content creators** iterating on marketing copy, storytelling, and creative briefs
- **Data analysts** building structured prompts for data interpretation and research

### User Needs

- Convert vague ideas into structured prompts
- Compare prompt versions side by side
- Get objective quality scores for prompts
- Automatically fix weaknesses in prompts
- Save and organize proven prompt patterns

## Features

### Core

- **Prompt Generation** — converts natural language intent into structured LLM prompts using Gemini, Anthropic Claude, OpenCode, or OpenAI Codex
- **Smart Enhance** — one-click improvement of the intent description before generation
- **Refinement** — iterative prompt polishing with natural language instructions

### Evaluation

- **Deep Evaluation** — AI-driven assessment across 3 criteria: clarity, specificity, misinterpretation risk
- **Auto-Fix** — automatically applies evaluation suggestions to improve the prompt

### Management

- **History / Vault** — persistent generation history with search and recall (capped at 50)
- **Versions** — automatic snapshots of each generation (capped at 20)
- **Templates** — built-in template library (12 across 4 categories) + user-saved custom templates
- **Copy & Export** — clipboard copy and text file download

### Configuration

- **Multi-Provider Settings** — independent API key management for Gemini, Anthropic Claude, OpenCode, and OpenAI Codex
- **Model Selection** — per-provider model dropdown with provider-appropriate choices
- **OpenCode Base URL** — configurable endpoint for self-hosted or alternate OpenCode API targets

### Out of Scope (v1)

- User authentication and accounts
- Server-side persistence or sync
- Collaborative editing
- Mobile app or PWA
- API proxy/server
- Plugin/extensions system

## Scope Boundaries

### In Scope

- Client-side only (Next.js App Router, all `"use client"`)
- localStorage for data persistence
- Direct API calls from browser to AI providers
- Dark theme only
- English language UI

### Out of Scope

- Backend API routes or server components
- Database or external storage
- User authentication
- Server-side rendering for dynamic content
- Real-time collaboration
- Offline support
- Mobile responsive layout

## Tech Stack

| Layer | Technology |

|-------|------------|
| Framework | Next.js 16.2.3 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Animations | Motion (Framer Motion) 12.38.0 |
| Icons | Lucide React 0.577.0 |
| AI Gemini | @google/genai 1.46.0 (SDK) |
| AI Anthropic | @anthropic-ai/sdk 0.49.0 (SDK) |
| AI OpenCode | Raw fetch (OpenAI-compatible API) |
| AI Codex | Raw fetch (OpenAI-compatible API) |
| Persistence | Web localStorage API |
| Package Manager | pnpm |
| CI | GitHub Actions (lint + build) |
| Formatting | Prettier + prettier-plugin-tailwindcss |
| Linting | ESLint 9 flat config (next/core-web-vitals) |
