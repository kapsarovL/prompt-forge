# Contributing to PromptForge

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/prompt-forge.git`
3. Install dependencies: `pnpm install`
4. Copy `.env.example` to `.env.local` and add your Gemini API key
5. Run the dev server: `pnpm dev`

## Development

- The app is fully client-side (Next.js App Router with `"use client"`)
- All persistent data uses localStorage
- API calls go directly to Google Gemini via `@google/genai`

## Making Changes

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `pnpm lint` to check for issues
4. Run `pnpm build` to verify the build passes
5. Push and open a pull request

## Code Style

- This project uses Prettier with Tailwind plugin for formatting
- Run `pnpm format` before committing
- TypeScript strict mode is enabled — avoid `any` types where possible
- Use `"use client"` for any component using browser APIs or React hooks

## Pull Request Guidelines

- Keep PRs focused on a single change
- Write a clear description of what and why
- Reference any related issues
