# Current truth (documentation SOT)

**Locked:** 2026-05-22 · **Product version:** 2.1.0 · **Design system:** 1.1 Hardened (storefront — [`docs/DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md), visual CI: `npm run test:visual`)

Use this block as the canonical reference when updating README, launch docs, Cursor rules, and agent governance. If code disagrees with this file, **code wins** — then update this file.

## Product

| Fact | Source |
|------|--------|
| **EN-first** development; USA audience (US English, USD, `en-US`) | [`AGENTS.md`](../AGENTS.md), root [`index.html`](../index.html) |
| **`/en/`** = canonical public storefront; **`/`** 308 → `/en/` on Vercel | `vercel.json` redirects; `npm run build` → `en/index.html` |
| **`/lt/`** = legacy/regression only (`noindex`) | [`AGENTS.md`](../AGENTS.md) |
| **GEO assets** | `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` from `npm run build` → [`scripts/build-geo-assets.js`](../scripts/build-geo-assets.js); EN schema + SSR buyer FAQ → [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js); SOT: `config/sot.json` → `geo`; runbook [`GEO_STACK.md`](GEO_STACK.md) |
| **Entity** | Prompt Anatomy; founder **Tomas Staniulis** — hub [`promptanatomy.app`](https://www.promptanatomy.app/); JSON-LD on built `/en/` only (root `index.html` template unchanged) |
| Free tool + paid PDF storefront on same site | [`index.html`](../index.html) `#pdf-guides` |
| **Homepage section order** | Hero → Operations center → **PDF guides** → Template library → Economic discipline rules → Community (aligned with sister [`DITreneris/teacher`](https://github.com/DITreneris/teacher)) |
| **Storefront copy SOT** | `config/sot.json` → `copy.pdfStorefront`, `copy.hero` (secondary CTA → `#pdf-guides`) |
| **PDF storefront (IA slim v4)** | Header + 2 lean cards + section trust row + **Purchase FAQ** (3 buyer items); no compare strip, testimonials, or publisher strip |
| **FAQ split** | Footer **Product FAQ** (3 items, JSON-LD) vs `#pdf-guides-faq` **Purchase FAQ** (`buyerFaq` ×3) |
| **Outbound UTM → `.app`** | Community CTA `utm_medium=community`; Product FAQ `faq`; entity footer `entity_footer`. All `utm_source=ceo&utm_campaign=ecosystem`. Hero badge + hub map stay bare. |
| **Storefront UI theme** | **Light only** (gold experience). No dark-mode toggle; legacy `di_ops_center_theme` cleared on load. |

## Paid PDFs (v2.1)

| Guide | Pages | Price | Export gate |
|-------|-------|-------|-------------|
| CEO AI Operations Playbook | **21** | $9.99 | [`scripts/export-pdfs.js`](../scripts/export-pdfs.js) `expectedPages: 21` |
| CEO AI Strategy Playbook | **43** | $19.99 | `expectedPages: 43` |

Locked copy and commerce: [`config/sot.json`](../config/sot.json) → `pdfGuides`, `commerce`, `productDecision`.

**Interior copy (2026-09-03):** in-place maturity pass (When / Do / See / Done). Page counts and H2/TOC titles unchanged. Private Blob overwritten on existing `paid-pdfs/` paths (Production env URLs unchanged); storefront p2–p4 shipped `da94ac1`. Do not treat [`pdf-content-v02.md`](pdf-content-v02.md) expansion tables as a ticket to add pages.

**Obsolete metrics (do not use as current state):** 12/28, 18/40, “watermarked preview” unless implemented in code.

## QA gates

| Command | When |
|---------|------|
| `npm test` | Every merge — structure, HTML lint, ESLint |
| `npm run build` | Before deploy — locale pages |
| `npm run test:mixed` | Release gate — `test` + smoke + e2e + a11y |

## Production deploy

| Path | Role |
|------|------|
| **Vercel** (`vercel.json`, `api/*` serverless) | **Canonical production** — `https://www.promptanatomy.ceo` |
| **GitHub Pages** (`.github/workflows/deploy.yml`) | **Deprecated / legacy** — static mirror only; no fulfillment APIs |

Fulfillment runbook: [`memo_pdf.md`](../memo_pdf.md). Launch gate: [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md).

**Redis (shared Upstash):** set `REDIS_KEY_PREFIX=ceo:` in Vercel + `.env` so keys are `ceo:fulfillment:...`, `ceo:download-token:...` (see `api/_lib/fulfillment.js`).

## Launch status (Phase 15 closed 2026-09-02)

- **Upstash Redis** — restored 2026-09-02 (`nearby-bass-181854`; local `PONG`; Production health `{ "ok": true, "redis": "ok" }`)
- **Live Operations purchase confirmed** 2026-09-02 — success page download ready; Stripe webhook URL must keep trailing slash (`/api/stripe-webhook/`)
- `allowPlaceholderCheckout: false` (flipped after that purchase)

**Phase 16–17 (2026-09-03):** maturity pack live — Blob + `/en/` previews. `pdf:export` still does not imply upload.

See [`todo.md`](../todo.md) Phases 15–17.
