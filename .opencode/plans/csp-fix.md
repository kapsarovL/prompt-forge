# Fix CSP: Add OpenCode to connect-src

## Problem

CSP `connect-src` in `next.config.ts:48` blocks requests to `https://opencode.ai/zen/v1/chat/completions`.

## Fix

In `next.config.ts:48`, add `https://opencode.ai` to the `connect-src` directive:

```ts
// Before (line 48):
"connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://api.anthropic.com https://api.openai.com",

// After:
"connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://api.anthropic.com https://api.openai.com https://opencode.ai",
```

## Steps

1. Open `next.config.ts`
2. Line 48: insert `https://opencode.ai` at the end of the `connect-src` value
3. Run `pnpm run build` to verify
4. Commit and push to trigger Vercel redeploy
