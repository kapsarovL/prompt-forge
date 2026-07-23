# Contributing to PromptForge

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/prompt-forge.git`
3. Install dependencies: `pnpm install`
4. Copy `.env.example` to `.env.local` and add your API keys (or skip — keys can be set in-app)
5. Run the dev server: `pnpm dev`

## Architecture

- **Next.js 16 App Router** with Server Components and Server Actions
- **Client-side** — prompt generation, refinement, evaluation, and encryption all run in the browser
- **Server-side** — Paddle webhooks, customer portal, access control via Neon Postgres
- **AI providers** — Gemini, Anthropic Claude, OpenAI, and OpenCode (all via client-side API calls with user-provided keys)
- **Payments** — Paddle integration for subscriptions and one-time purchases

## Making Changes

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `pnpm lint` to check for issues
4. Run `pnpm test` to ensure existing tests pass
5. Run `pnpm build` to verify the build succeeds
6. Push and open a pull request

## Running Tests

- **Unit tests**: `pnpm test` — vitest suite covering types, API clients, and utilities
- **Watch mode**: `pnpm test:watch` — re-runs on file changes during development
- **Coverage**: `pnpm coverage` — generates a coverage report in `/coverage`
- **E2E tests**: `pnpm test:e2e` — Playwright suite (requires the dev server running)

All tests must pass before a pull request can be merged. If you're adding a new feature, please include corresponding tests.

## Reporting Bugs

Open a [bug report](https://github.com/kapsarovL/prompt-forge/issues/new?template=bug_report.md) with:
- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

## Code Style

- This project uses Prettier with Tailwind plugin for formatting
- Run `pnpm format` before committing
- TypeScript strict mode is enabled — avoid `any` types where possible
- Use `"use client"` for any component using browser APIs or React hooks

## Pull Request Guidelines

- Keep PRs focused on a single change
- Write a clear description of what and why
- Reference any related issues
