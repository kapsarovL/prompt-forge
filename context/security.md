# Security

## Security Philosophy

PromptForge is a **client-side only** application with no backend. This reduces the attack surface significantly — there are no servers to compromise, no databases to breach, and no authentication system to bypass. However, it shifts security responsibility to the client, where API keys and user data reside in the browser.

**Core trade-off**: Convenience (API keys in localStorage, no backend) vs. security (plaintext storage, no secrets management). This is an explicit design choice for a developer tool where users manage their own API keys.

---

## Core Security Principles

### 1. Zero Trust in Client Storage

All browser storage (localStorage) is treated as untrusted and potentially accessible by:

- Browser extensions
- Cross-site scripting (XSS) attacks
- Other scripts on the same origin
- Anyone with physical access to the device

### 2. No Secrets in Transit

API keys and prompts are sent directly from the browser to AI provider APIs over HTTPS. There is no intermediate proxy that could intercept or log traffic.

### 3. Minimal Surface Area

- Zero server-side code means zero server-side vulnerabilities
- No database means no SQL injection, no data leaks from storage
- No authentication means no session hijacking, no password reuse
- No third-party cookies or tracking scripts

### 4. Defense in Depth (Client-Side)

- React Strict Mode catches development-time issues
- TypeScript strict mode prevents type confusion
- ESLint enforces security-aware React patterns
- Error boundaries prevent information leakage through crashes

---

## Current Security Rules

### API Keys

| Rule | Implementation |

|------|---------------|
| API keys never committed to git | `.env.local` in `.gitignore`; `.env.example` documents the key name only |
| User supplies their own keys | Settings modal with per-provider key management |
| Environmental fallback | `NEXT_PUBLIC_GEMINI_API_KEY` env var for development convenience |
| Keys stored in localStorage | Plaintext in `promptforge_api_key`, `pf_anthropic_key`, `pf_codex_key`, `promptforge_opencode_api_key` |
| No default/shared API keys shipped | The hardcoded Gemini key was revoked in a prior session and never committed |

### Data Protection

| Rule | Implementation |

|------|---------------|
| No user data sent to any server except the configured AI provider | All localStorage data stays local |
| Prompts sent to AI provider only during explicit generation/evaluation | No background or analytics pings |
| No telemetry or analytics | Zero tracking scripts, no analytics SDKs |
| No third-party CDN fonts or scripts | Geist fonts loaded via `next/font/google` (self-hosted at build time) |

### Output & Content Safety

| Rule | Implementation |

|------|---------------|
| Generated content is sandboxed in the browser | No automatic execution of generated code |
| User can delete any stored data | Delete buttons on history items, Clear All, template delete |
| Error messages don't leak sensitive info | `getErrorMessage()` returns user-friendly messages, not raw errors |

---

## Infrastructure Security

### Build & Deploy

| Layer | Security Measure |

|-------|-----------------|
| CI Pipeline | GitHub Actions — runs on push/PR to `main` |
| CI Verification | `pnpm lint` + `pnpm build` must pass |
| CI Secrets | `NEXT_PUBLIC_GEMINI_API_KEY` set as placeholder `"placeholder"` (never a real key) |
| Prettier | Ensures consistent formatting (no security impact) |
| ESLint | `next/core-web-vitals` — includes React security rules |

### next.config.ts

| Setting | Value | Purpose |

|---------|-------|---------|
| `reactStrictMode` | `true` | Double-invoke effects to catch side-effect bugs |
| `typescript.ignoreBuildErrors` | `false` | Fail build on type errors |
| `output` | `"standalone"` | Self-contained deployment package |

### Missing Infrastructure Security

- **No CSP headers** — `next.config.ts` has no `headers()` function. Users deploying to production should configure CSP for their domain.
- **No security headers** — no X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **No request signing** — API calls are not signed or authenticated beyond the Bearer token in the Authorization header

---

## Long-Term Security Goals

### Short Term (Next Release)

- [ ] **Implement CSP headers** in `next.config.ts` — restrict script sources, restrict API call destinations to configured provider URLs only
- [ ] **Add security headers** — X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin

### Medium Term

- [ ] **Encrypted API key storage** — use Web Crypto API (`crypto.subtle.encrypt`) with a key derived from a user-provided master passphrase, or use the Credential Management API
- [x] **Implement AbortController** — added to all OpenCode fetch calls (validate, completion, evaluate) with 30s timeout and proper cleanup via `clearTimeout`/`try-finally`
- [ ] **Input sanitization** — validate and sanitize any user input before sending to AI APIs

### Future

- [ ] **Content Security Policy enforcement** — strict CSP with nonce-based script loading
- [ ] **Isolated iframe for output rendering** — sandbox generated content to prevent XSS if a model returns executable code
- [ ] **Subresource Integrity (SRI)** — for any external resources loaded at runtime
- [ ] **Security audit** — third-party review before public v1.0 release
- [ ] **Bug bounty program** — for open-source community contributors

---

## AI Security Considerations

### Prompt Injection Risks

- User-provided descriptions are sent directly to AI models
- Malicious prompts could attempt prompt injection; the app currently has no sanitization layer
- **Mitigation**: Future versions should implement input validation and consider a system prompt sandbox

### Provider API Key Exposure

- API keys in localStorage are accessible to any JavaScript on the same origin
- Browser extensions with host permissions can read localStorage
- **Mitigation**: Longer-term encrypted storage; short-term user education in Settings UI

### Data Sent to Third Parties

- Prompt content is sent to the configured AI provider's API
- Users should not send sensitive/private data to AI providers
- **Mitigation**: Clear warning in the UI about data sent to third-party APIs

### Supply Chain Security

- Dependencies are installed via pnpm with lockfile (`pnpm-lock.yaml`)
- CI uses `--frozen-lockfile` to ensure reproducible installs
- No CDN-loaded scripts — all dependencies are bundled at build time
