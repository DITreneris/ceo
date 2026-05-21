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

- [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_OPERATING_PDF`, `STRIPE_PRICE_STRATEGIC_PDF`
- [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `DOWNLOAD_TOKEN_SECRET`
- [ ] `RESEND_API_KEY`, `FULFILLMENT_FROM_EMAIL` (verified sender)
- [ ] `PDF_OPERATING_SOURCE_URL`, `PDF_STRATEGIC_SOURCE_URL` (after blob upload)
- [ ] `BLOB_READ_WRITE_TOKEN`, `SITE_URL=https://www.promptanatomy.ceo`

### Repo config (Orchestrator)

- [ ] `npm run pdf:upload-blob` from machine with env
- [ ] Update [`config/sot.json`](../config/sot.json): real `commerce.stripePaymentLinks`, `allowPlaceholderCheckout: false`
- [ ] `npm run check:fulfillment` — all required keys present locally
- [ ] `GET /api/fulfillment-health` on production → `{ "ok": true }`

### Test purchase

- [ ] One live purchase per product: receipt + Resend email + `success.html` download link

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
