# Launch checklist (Phases 15–17)

**Product:** AI Operations Center — CEO PDF playbooks (EN-US)  
**Domain:** `https://www.promptanatomy.ceo`  
**Runbook:** [memo_pdf.md](../memo_pdf.md)  
**Deploy:** Vercel production only ([CURRENT_TRUTH.md](CURRENT_TRUTH.md)). GitHub Pages = deprecated.

## Phase 15 — Commerce and fulfillment (manual + config)

### Stripe Dashboard

- [ ] Live products/prices: Operating $9.99 (`operating`), Strategic $19.99 (`strategic`)
- [ ] Payment Links with `metadata.product` = `operating` | `strategic`
- [ ] Success URL: `https://www.promptanatomy.ceo/success.html?session_id={CHECKOUT_SESSION_ID}`
- [ ] Webhook: `https://www.promptanatomy.ceo/api/stripe-webhook` (events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`)
- [ ] Copy `whsec_...` into Vercel `STRIPE_WEBHOOK_SECRET`

### Vercel Production env

- [x] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_OPERATING_PDF`, `STRIPE_PRICE_STRATEGIC_PDF` (keys present in local `.env`; mirror on Vercel Production)
- [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — **BLOCKER (2026-08-11):** hostname DNS `ENOTFOUND` locally and on production health (`redis: error`, `missing: []`). Replace Upstash DB credentials in `.env` + Vercel Production.
- [x] `DOWNLOAD_TOKEN_SECRET` (present locally)
- [x] `RESEND_API_KEY`, `FULFILLMENT_FROM_EMAIL` (present locally)
- [x] `PDF_OPERATING_SOURCE_URL`, `PDF_STRATEGIC_SOURCE_URL` (present; production `blobConfigured: true`)
- [x] `BLOB_READ_WRITE_TOKEN`, `SITE_URL=https://www.promptanatomy.ceo`
- [x] `REDIS_KEY_PREFIX=ceo:`

### Repo config (Orchestrator)

- [x] PDF blob sources configured (production health reports `blobConfigured: true`)
- [x] [`config/sot.json`](../config/sot.json) `commerce.stripePaymentLinks` use live-format `buy.stripe.com` URLs
- [ ] `allowPlaceholderCheckout: false` — **do not flip until Redis ping ok** (avoids paid checkout with broken fulfillment)
- [ ] `npm run check:fulfillment` — Redis `PONG` (currently `fetch failed` / `ENOTFOUND`)
- [ ] `GET /api/fulfillment-health/` on production → `{ "ok": true }` (trailing slash required; `trailingSlash: true`)

### Test purchase

- [ ] One live purchase per product: receipt + Resend email + `success.html` download link (blocked on Redis restore)

## Phase 16 — Asset freeze

- [ ] PDFs: `CEO_Operations_Playbook.pdf` (21 p), `CEO_Strategic_AI_OS.pdf` (43 p) — from `npm run pdf:export` (page gate in `scripts/export-pdfs.js`)
- [ ] PNGs: `assets/pdf-covers/*` — from `npm run pdf:preview-images`
- [ ] Storefront claims match SOT: page counts, playbook names, `buyerPromise`
- [ ] Tag release / note versions in CHANGELOG

## Phase 17 — Deploy gate

- [ ] `npm run build`
- [ ] `npm run test:mixed` (structure, lint, smoke, e2e, a11y)
- [ ] Desktop + mobile buyer journey review
- [ ] Deploy Vercel production only when Phase 15–16 complete

**Post-launch (Phase 18):** sales/refund/support review — not part of this gate.
