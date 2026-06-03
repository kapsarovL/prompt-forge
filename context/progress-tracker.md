# Progress Tracker

## Current Phase
Phase 1 — MVP / Foundation

## Mục tiêu hiện tại
Build passes clean with Tailwind v4 migration. Fix CSP violations for Webflow/Cloudflare deployment.

## Đã hoàn thành
- ✅ Migrated Tailwind v3 → v4 syntax (`bg-gradient-*` → `bg-linear-*`, etc.)
- ✅ Fix `tsconfig.json` to exclude `forge-prompt/` sub-project
- ✅ Build passes: Next.js 16.2.6 + Turbopack, 7 static pages
- ✅ CSP fix: added `CSP_ASSET_ORIGINS` env var → injected into `font-src`, `style-src`, `script-src`

## Đang làm
- (none)

## Tiếp theo
- [ ] Deploy with `CSP_ASSET_ORIGINS=https://*.cosmic.webflow.services` set in the deployment environment
- [ ] Verify deployed site loads fonts, styles, and scripts without CSP violations

## Open Questions
- (none)
