# Component contribution rules (storefront)

**DS version:** 1.1 · **EN-first only** ([`AGENTS.md`](../AGENTS.md))

## Before adding UI

1. Read [`docs/DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) and [`docs/ds_improvement_plan.md`](ds_improvement_plan.md).
2. Prefer existing `.btn`, `.card`, `.chip`, `.trust-row` — do not invent new button shadows.
3. New copy → `config/sot.json` `copy.*` only (not hardcoded in HTML unless static fallback).
4. Do not add `#hex` outside `styles/tokens.css` (CI guards all partitioned CSS files).
5. Use `var(--shadow-*)` for `box-shadow` and `var(--text-*)` for `font-size` in `styles/*` (structure tests enforce).
6. Markup: `.btn` + modifier on new CTAs; keep legacy alias class one release if needed.

## Allowed changes by lane

| Lane | May edit |
|------|----------|
| UI/UX | `index.html`, `styles/*`, `style.css` imports |
| Content | `sot.json` `copy.*` (not `commerce` URLs) |
| Orchestrator | `commerce`, `brand`, merge order |
| QA | `tests/structure.test.js`, e2e |

## Frozen (no change without product sign-off)

- Brand `#4A148C` / `#FFB300`
- Hero H1: *Turn KPIs into weekly priorities*
- Stripe checkout URLs when `allowPlaceholderCheckout: false`
- JSON-LD, skip link, `:focus-visible`, `prefers-reduced-motion`
- `/lt/` — regression build only

## PR checklist

- [ ] `npm test`
- [ ] `npm run build` if `index.html` changed
- [ ] `npm run test:e2e` if hero/CTA/DOM changed
- [ ] `npm run test:visual` if hero/PDF layout changed; `npm run test:visual:update` if intentional visual diff
- [ ] `CHANGELOG.md` DS section if iteration exit
