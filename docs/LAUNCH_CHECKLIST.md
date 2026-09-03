# Launch checklist (Phases 15–17)

**Product:** AI Operations Center — CEO PDF playbooks (EN-US)  
**Domain:** `https://www.promptanatomy.ceo`  
**Runbook:** [memo_pdf.md](../memo_pdf.md)  
**Deploy:** Vercel production only ([CURRENT_TRUTH.md](CURRENT_TRUTH.md)). GitHub Pages = deprecated.

## Phase 15 — Commerce and fulfillment (manual + config)

### Stripe Dashboard

- [x] Live products/prices: Operating $9.99 (`price_1TZXGY…`, $9.99) · Strategic $19.99 (`price_1TZXJG…`, $19.99) — match local `.env` `STRIPE_PRICE_*`
- [x] Payment Links `metadata.product` = `operating` | `strategic` (set 2026-09-02 via Stripe API; were empty)
- [x] Success URL: `https://www.promptanatomy.ceo/success.html?session_id={CHECKOUT_SESSION_ID}` (set 2026-09-02; were `hosted_confirmation`)
- [x] Webhook: `https://www.promptanatomy.ceo/api/stripe-webhook/` (trailing slash required — `vercel.json` `trailingSlash: true` 308s the no-slash URL; Stripe does not follow POST redirects)
- [x] `STRIPE_WEBHOOK_SECRET` present in local `.env` / Vercel Production (same key set as other Stripe env)

**Canonical host:** `www.promptanatomy.ceo` CNAME → Vercel. `ceo-teal.vercel.app` is the same Production project (identical `/en/` canonical + identical `fulfillment-health` payload). Do not point Stripe at the vercel.app alias.

### Vercel Production env

- [x] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_OPERATING_PDF`, `STRIPE_PRICE_STRATEGIC_PDF` (keys present in local `.env`; mirror on Vercel Production)
- [x] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — **2026-09-02:** local `PONG`; Production `GET /api/fulfillment-health/` → `{ "ok": true, "redis": "ok", "blobConfigured": true }` on `.ceo` (same project as `ceo-teal`). Do not commit `.env`.
- [x] `DOWNLOAD_TOKEN_SECRET` (present locally)
- [x] `RESEND_API_KEY`, `FULFILLMENT_FROM_EMAIL` (present locally)
- [x] `PDF_OPERATING_SOURCE_URL`, `PDF_STRATEGIC_SOURCE_URL` (present; production `blobConfigured: true`)
- [x] `BLOB_READ_WRITE_TOKEN`, `SITE_URL=https://www.promptanatomy.ceo`
- [x] `REDIS_KEY_PREFIX=ceo:`

### Repo config (Orchestrator)

- [x] PDF blob sources configured (production health reports `blobConfigured: true`)
- [x] [`config/sot.json`](../config/sot.json) `commerce.stripePaymentLinks` use live-format `buy.stripe.com` URLs
- [x] `allowPlaceholderCheckout: false` — flipped 2026-09-02 after Operations live purchase + manual fulfill (webhook URL slash fix)
- [x] `npm run check:fulfillment` — Redis `PONG` (2026-09-02, local `.env`)
- [x] `GET /api/fulfillment-health/` on production → `{ "ok": true }` (trailing slash required)

### Test purchase

- [x] One live Operations purchase on `.ceo` (2026-09-02). First success page failed: Stripe webhook was 308'd (`trailingSlash`). Webhook URL now ends with `/`; session fulfilled; Resend sent. Refresh success page or use the email link.

## Phase 16 — Asset freeze

- [x] PDFs: `CEO_Operations_Playbook.pdf` (21 p), `CEO_Strategic_AI_OS.pdf` (43 p) — from `npm run pdf:export` (page gate in `scripts/export-pdfs.js`) — 2026-09-03 maturity export + Blob overwrite (`paid-pdfs/ceo-operations-playbook.pdf`, `paid-pdfs/ceo-strategic-ai-os.pdf`). Env URLs unchanged (same path, `allowOverwrite`).
- [x] PNGs: `assets/pdf-covers/*` — from `npm run pdf:preview-images` (covers unchanged; p2–p4 regenerated)
- [x] Storefront claims match SOT: page counts, playbook names, `buyerPromise`
- [x] Note versions in CHANGELOG Unreleased (no git tag unless asked)

## Phase 17 — Deploy gate

- [x] `npm run build` (2026-09-03)
- [x] Release QA 2026-09-03: `npm test` 156/156; smoke 36; e2e 18; visual 5 (pdf-guides unchanged); pa11y 5 pages clean. `npm run test:mixed` smoke teardown hits `wmic.exe ENOENT` on this Windows — suites run separately against `serve :3300`.
- [x] Desktop + mobile buyer journey review — 2026-09-03 live `/en/` at 1280 / 768 / 375 / 320: Stripe CTAs live; Operations preview serves p2–p4; `success.html` polls `/api/download-link/`
- [x] Deploy Vercel production — `ceo/main` `da94ac1` (2026-09-03). Live p2–p4 byte sizes match the new assets.

**Post-launch (Phase 18):** sales/refund/support review — not part of this gate.
