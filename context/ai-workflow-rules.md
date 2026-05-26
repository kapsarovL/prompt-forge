# AI Workflow Rules

## Development Workflow

### Context-First Development

Before implementing any change or making architectural decisions, read context files in order:

1. `context/project-overview.md` — product scope and constraints
2. `context/architecture.md` — system structure and invariants
3. `context/ui-context.md` — visual conventions
4. `context/code-standards.md` — implementation rules
5. `context/ai-workflow-rules.md` — (this file) workflow rules
6. `context/security.md` — security principles
7. `context/progress-tracker.md` — current state and next steps

This ensures decisions are consistent with existing patterns and constraints.

### Plan → Build → Verify

1. **Plan**: Read context files, understand scope, assess impact before writing code
2. **Build**: Implement changes following code standards and patterns
3. **Verify**: Run lint (`pnpm lint`), build (`pnpm build`), and verify behavior

### Documentation Updates

After each meaningful implementation change:

1. Update `context/progress-tracker.md` — mark completed items, update current phase, add open questions
2. If implementation changes architecture, scope, or standards documented in context files, update the relevant file before continuing

## Scoping Rules

### Change Classification

| Type | Examples | Process |

|------|----------|---------|
| **Small** | Bug fix, style tweak, copy change | Implement directly, verify |
| **Medium** | New component, new handler, new localStorage key | Read context, implement, update progress-tracker |
| **Large** | New feature, architecture change, provider addition | Read all context, propose plan, implement incrementally, update all affected context files |

### Scope Boundaries

- **Stay client-side** — no backend API routes, no server components, no database
- **Preserve localStorage persistence** — all user data must survive page refresh
- **Preserve provider abstraction** — new providers should follow the `lib/{provider}.ts` + handler branching pattern
- **No authentication** — no login, no user accounts
- **No encryption of API keys** — known limitation, accept it unless scope explicitly changes

## Delivery Approach

### Incremental Delivery

- Prefer multiple small, safe changes over one large refactor
- Each change should be independently verifiable (`pnpm lint` + `pnpm build` pass)
- If a refactor is needed, do it in a separate change before feature work

### Refactoring Priority

1. Extract API service layer from `PromptForge` (currently 705 lines)
2. Move modal state into a dedicated hook or context
3. Add test infrastructure
4. Implement request cancellation
5. Add loading skeleton states

## AI Agent Behavioral Rules

### Before Writing Code

1. Read all context files first
2. Check `context/progress-tracker.md` for current state and open questions
3. Search the codebase for existing patterns before creating new ones
4. Verify the approach doesn't violate documented invariants

### While Writing Code

1. Match existing code patterns exactly — import style, naming conventions, prop patterns
2. Add `"use client"` to any component using React hooks or browser APIs
3. Use `cn()` from `lib/utils.ts` for conditional classes
4. Follow the try/catch/finally pattern for async operations
5. Use `console.error` for error logging (structured logging not implemented yet)

### After Writing Code

1. Run `pnpm lint` — address all warnings and errors
2. Run `pnpm build` — verify zero type errors
3. Update `context/progress-tracker.md` with changes made
4. If context files need updating (changed architecture, new patterns, etc.), do it immediately

### Guardrails

- **Never commit API keys or secrets** — use `.env.example` for documentation, never commit `.env.local`
- **Never add server dependencies** — the app has no backend; keep it that way
- **Never introduce authentication** — unless scope is explicitly expanded
- **Never add a CSS-in-JS library** — Tailwind is the only styling solution
- **Never add a state management library** — `useState`/`useEffect` is sufficient until proven otherwise

## Monitoring & Quality

- No testing infrastructure exists yet — manual verification required
- CI pipeline runs `pnpm lint` and `pnpm build` on push/PR to `main`
- Prettier formatting should be run before commits (`pnpm format`)
- ESLint 9 flat config with `next/core-web-vitals` ruleset
