# amalyte-platform

Monorepo for the Amalyte Group web presence — parent site + Studio, Technologies,
Learn, Labs. Full architecture: see `amalyte-group-web-architecture-v1.md`.

## Status

Phase 1 scaffold. This proves the pipeline end to end — tokens flow from
`packages/tokens` through Tailwind into all five apps, each scoped by
`data-property` on `<html>`, sharing one component (`TopStrip`) with zero
duplication. It is a working skeleton, not a finished site.

**Design tokens are a working baseline, not frozen.** Palette, type,
spacing — all open to revision. Change `packages/tokens/tokens.css` and
`tokens.json`, and every app inherits it on next build.

## Structure

```
apps/
  parent/   → amalyte.com
  studio/   → studio.amalyte.com
  tech/     → tech.amalyte.com
  learn/    → learn.amalyte.com
  labs/     → labs.amalyte.com
packages/
  tokens/   → design tokens (CSS vars, JSON, Tailwind preset) — DONE, revisable
  ui/       → shared components (TopStrip built; rest pending)
  auth/     → OIDC client, session, role guards — PENDING (Keycloak + Entra External ID)
  cms/      → Payload CMS client + typed schemas — PENDING
  analytics/→ unified tracking — PENDING
services/
  identity/       → Keycloak (Docker) — PENDING
  content-engine/ → autonomous SEO/GEO content pipeline (spec §7) — PENDING
```

## Run locally

```bash
pnpm install
pnpm dev        # runs all five apps in parallel via Turborepo
```

Ports: parent 3000, studio 3001, tech 3002, learn 3003, labs 3004.

## Next steps (in order)

1. `packages/ui` — build out remaining shared components (case study template,
   footer, form components) per spec §5.
2. `packages/auth` — wire Keycloak (content properties) and Entra External ID
   (product suite, `amalyte.org`) per spec §3.
3. `packages/cms` — stand up Payload CMS, define schemas, connect apps.
4. Real content — replace placeholder copy per spec §2.9 voice architecture,
   pulling from the WordPress content-extraction inventory (Phase 0).
