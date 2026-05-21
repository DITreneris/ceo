# Current truth (documentation SOT)

**Locked:** 2026-05-21 · **Product version:** 2.1.0

Use this block as the canonical reference when updating README, launch docs, Cursor rules, and agent governance. If code disagrees with this file, **code wins** — then update this file.

## Product

| Fact | Source |
|------|--------|
| **EN-first** development; USA audience (US English, USD, `en-US`) | [`AGENTS.md`](../AGENTS.md), root [`index.html`](../index.html) |
| **`/en/`** and root = active storefront | `npm run build` → `en/index.html` |
| **`/lt/`** = legacy/regression only (not public locale switch) | [`AGENTS.md`](../AGENTS.md) |
| Free tool + paid PDF storefront on same site | [`index.html`](../index.html) `#pdf-guides` |

## Paid PDFs (v2.1)

| Guide | Pages | Price | Export gate |
|-------|-------|-------|-------------|
| CEO AI Operations Playbook | **21** | $9.99 | [`scripts/export-pdfs.js`](../scripts/export-pdfs.js) `expectedPages: 21` |
| CEO AI Strategy Playbook | **43** | $19.99 | `expectedPages: 43` |

Locked copy and commerce: [`config/sot.json`](../config/sot.json) → `pdfGuides`, `commerce`, `productDecision`.

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

## Launch blockers (not doc drift)

- Live Stripe Payment Links in `config/sot.json` + `allowPlaceholderCheckout: false`
- Vercel Production env + `GET /api/fulfillment-health` → `ok`
- One live test purchase per product

See [`todo.md`](../todo.md) Phases 15–17.
