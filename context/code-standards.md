# Code Standards

## Component Standards

### File Structure

- One component per file, default exported
- File name matches component name in kebab-case: `forge-generator.tsx` exports `ForgeGenerator`
- Props defined inline as TypeScript interface near the top of the file
- No barrel exports (`index.ts` files) — import directly from source

### Component Pattern

- All interactive components use `"use client"` directive at the top
- Arrow function components with explicit typing:

```tsx
"use client";

interface Props {
  title: string;
  onAction: () => void;
}

export const MyComponent = ({ title, onAction }: Props) => {
  return <div>{title}</div>;
};
```

- Server components (only `app/forge/page.tsx`) omit `"use client"` and render client children
- Class components used only for `ErrorBoundary` (React lifecycle requirement)

### Props Convention

- Event handlers prefixed with `on`: `onClose`, `onSave`, `onDelete`
- Boolean props for modal visibility: `isOpen`, `isLoading`, `isSubmitting`
- Setter functions prefixed with `on` or passed directly: `onClose` not `setIsOpen`
- All child component state is owned by `PromptForge` and passed as props
- Modals receive `isOpen` + `onClose` + feature-specific props

## TypeScript Standards

### Configuration

- Strict mode enabled
- `@/*` path alias maps to project root
- No `any` types — use `unknown` and narrow
- Build fails on type errors (`ignoreBuildErrors: false`)

### Type Declarations

- Application types centralized in `lib/types.ts`
- Component prop types defined locally in each component file
- Use `import type` for type-only imports:

```tsx
import type { EvaluationData, Provider } from "@/lib/types";
```

- API client types co-located with the client module (`lib/opencode.ts` has `OpenCodeConfig`)

### Naming

- **Types**: PascalCase — `EvaluationData`, `PromptHistory`, `OpenCodeConfig`
- **Type aliases**: PascalCase — `Provider = "gemini" | "opencode"`
- **Interfaces for props**: `Props` if single interface, otherwise descriptive name

## Import Standards

### Order

1. React / Next.js framework imports
2. Third-party library imports
3. Local component imports (`@/components/`)
4. Local type/utility imports (`@/lib/`, `@/hooks/`)
5. Type-only imports separated and marked with `import type`

### Path Style

- Absolute imports with `@/` prefix for all project-internal references
- Relative imports used only for sibling files (`./feature-card`)

```tsx
// Good
import { ForgeNavbar } from "@/components/forge-navbar";
import { CATEGORIES } from "@/lib/types";

// Acceptable (sibling only)
import { FeatureCard } from "./feature-card";
```

## CSS & Styling Standards

- **Tailwind utility classes** for all styling — no CSS modules, no styled-components
- **No custom CSS** except in `app/globals.css` for complex patterns (animations, dot grids, cursor effects)
- **Class merging**: use `cn()` from `lib/utils.ts` (wraps `clsx` + `tailwind-merge`)
- **Tailwind v4** uses `@import "tailwindcss"` not `@tailwind` directives
- **Theme values** defined in `@theme inline {}` block in `globals.css`
- **Prettier** with `prettier-plugin-tailwindcss` for automatic class sorting

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

## State Management Standards

- **React `useState`** for all local state — no Context API, no external libraries
- State lifted to `PromptForge` and passed down as props
- Transient UI state (form inputs before save) lives in the child component
- `useEffect` for:
  - localStorage sync (mount + state change)
  - Loading initial state from localStorage
- `useCallback` for handler functions passed as props (to prevent unnecessary re-renders)

## Error Handling Standards

- **Top-level**: `ErrorBoundary` class component wraps entire forge page
- **Per-operation**: Every async handler follows this pattern:

```tsx
try {
  setIsLoading(true);
  // ... API call
} catch (err) {
  console.error("Context message:", err);
  showToast(getErrorMessage(err), "info");
} finally {
  setIsLoading(false);
}
```

- **API errors**: Use `getErrorMessage()` helper for user-friendly messages
- **localStorage parse errors**: Silent catch — no error displayed for corrupt data
- **No AbortController** — request cancellation not implemented yet

## API Client Standards

- **Gemini**: Use `@google/genai` SDK with `generateWithRetry` wrapper
- **OpenCode**: Use raw `fetch` with `openCodeGenerateWithRetry` wrapper
- Both implement: 3 retries, exponential backoff (1s, 2s, 4s), status-specific retry triggers
- Structured output: Gemini uses `Type.VOICE` for evaluation; OpenCode expects raw JSON string
- New providers should follow the same pattern: a `lib/{provider}.ts` file + handler branching in `PromptForge`

## Naming Conventions

| Category | Convention | Example |

|----------|-----------|---------|
| Components | PascalCase | `ForgeNavbar`, `GalleryModal` |
| Files | kebab-case | `forge-generator.tsx`, `settings-modal.tsx` |
| Functions | camelCase | `handleGenerate`, `getApiKey` |
| Variables | camelCase | `generatedPrompt`, `isLoading` |
| Constants | UPPER_SNAKE | `CATEGORIES`, `OPENCODE_DEFAULT_BASE_URL` |
| Types | PascalCase | `EvaluationData`, `PromptHistory` |
| Props interface | `Props` | `Props` (near export) |
| localStorage keys | `promptforge_` prefixed snake_case | `promptforge_api_key` |

## File Size Guidelines

- Components should stay under 400 lines; `PromptForge` at 705 lines is identified for future refactoring
- Library modules under 150 lines
- Types file under 100 lines
- Consider extraction when a file exceeds these thresholds

## Testing Standards

- **No test infrastructure exists yet** — no test runner, no test files
- When added: Vitest for unit tests, Playwright for e2e
- Tests should be co-located: `component-name.test.tsx` next to source

## Git & Workflow

- Branch from `main`, create PR for features/fixes
- CI runs `pnpm lint` and `pnpm build` on push/PR to `main`
- Pre-commit: format with `pnpm format` (Prettier)
- Commit messages: concise, descriptive, imperative mood
- API keys never committed — use `.env.example` for documentation only

## Dependencies

- **No new dependency added without justification** in PR description
- Prefer native browser APIs over libraries where feasible (e.g., `fetch` over axios, `navigator.clipboard` over clipboard lib)
- Keep bundle size small — the app is fully client-loaded
