# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in PromptForge, please report it privately.

**Do not** open a public GitHub issue for security vulnerabilities.

Send details to **opensource@prismaflux.dev**. We'll acknowledge receipt within 48 hours and work on a fix before disclosing publicly.

## What to Include

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

## Scope

This policy covers the PromptForge codebase and its dependencies. For vulnerabilities in third-party dependencies, please report them to the respective maintainers.

## Security Architecture

- **API keys** — Stored in browser localStorage, never sent to our servers. Users bring their own keys.
- **Client-side encryption** — Optional AES-256-GCM + PBKDF2 encryption for stored API keys
- **Server-side** — Paddle webhooks handle payment events. Database stores only Paddle customer/subscription records (no API keys or prompt data).
- **No user accounts** — No passwords, no email collection, no tracking.
