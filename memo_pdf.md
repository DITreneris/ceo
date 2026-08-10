# Deployment memo: Stripe + paid PDF fulfillment

**Audience:** Engineers and operators rolling out the same pattern on sister projects (static/Vercel site + serverless fulfillment).  
**Source:** Production incident and recovery on **promptanatomy.online**, May 16, 2026; adapted for **promptanatomy.ceo** (AI Operations Center), May 2026.  
**Language:** English (product copy and buyer-facing strings in **en-US** for US executives).  
**Related repo docs:** [README.md](README.md#deploy-vercel--kanoninis), [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md), [docs/CURRENT_TRUTH.md](docs/CURRENT_TRUTH.md), [.env.example](.env.example), [CHANGELOG.md](CHANGELOG.md), [todo.md](todo.md).

### CEO site product ids (this repo)

| Stripe metadata `product` | Public card id | Price | PDF file |
|---------------------------|----------------|-------|----------|
| `operating` | `operating-pdf` | $9.99 | `CEO_Operations_Playbook.pdf` |
| `strategic` | `strategic-pdf` | $19.99 | `CEO_Strategic_AI_OS.pdf` |

Env keys: `STRIPE_PRICE_OPERATING_PDF`, `STRIPE_PRICE_STRATEGIC_PDF`, `PDF_OPERATING_SOURCE_URL`, `PDF_STRATEGIC_SOURCE_URL` (and matching `PDF_*_BLOB_PATH` for upload script). Success URL: `https://www.promptanatomy.ceo/success.html?session_id={CHECKOUT_SESSION_ID}`.

---

## 1. What we are shipping

| Layer | Responsibility |
|--------|----------------|
| **Marketing site** | Free tool + paid PDF cards; Stripe Payment Links for checkout (no custom cart). |
| **Stripe** | Payment, receipt email, redirect to `success.html?session_id={CHECKOUT_SESSION_ID}`. |
| **Webhook** | `POST /api/stripe-webhook` → fulfill order (idempotent). |
| **Redis (Upstash)** | `{REDIS_KEY_PREFIX}fulfillment:cs_...` + `{prefix}download-token:...` (this repo: `REDIS_KEY_PREFIX=ceo:`). |
| **Resend** | Transactional email with 7-day signed download link. |
| **Private PDF storage** | Vercel Blob (recommended); served via `GET /api/download?t=...`. |
| **Success page** | Polls `GET /api/download-link?session_id=...` for a 15-minute in-page link. |

**Golden rule:** The domain in the Payment Link **success URL**, the **webhook URL**, and the **Vercel project env** must be the **same production host**. Fulfillment data does not sync across domains or projects.

---

## 2. Architecture (one diagram worth memorizing)

```text
Buyer → Stripe Payment Link (buy.stripe.com)
          ↓ paid
Stripe → POST webhook → YOUR_DOMAIN/api/stripe-webhook
          ↓
     fulfillCheckoutSession()
          ├─ stripe.checkout.sessions.retrieve (needs STRIPE_SECRET_KEY)
          ├─ map product (metadata / price id / amount)
          ├─ assert PDF source env exists
          ├─ Redis: fulfillment:cs_... + download-token:jti
          └─ Resend: email with /api/download?t=...
Buyer → success.html?session_id=cs_...
          ↓ poll
     GET /api/download-link → short-lived token → GET /api/download → PDF bytes
```

---

## 3. Pre-flight checklist (do in order)

Use this as a copy-paste gate before announcing paid PDFs.

### 3.1 Stripe Dashboard (per product)

- [ ] **Live** Products / Prices created (e.g. $4.99 / $9.99); note each `price_...` id.
- [ ] **Payment Link** per product with live `https://buy.stripe.com/...` URL.
- [ ] **Success URL** (redirect, not Stripe-hosted confirmation):
  ```text
  https://YOUR_DOMAIN/success.html?session_id={CHECKOUT_SESSION_ID}
  ```
  Keep `{CHECKOUT_SESSION_ID}` literally—Stripe substitutes it.
- [ ] **Metadata** on each Payment Link: `product` = `beginners` | `advanced` (or your internal ids). Do not rely only on amount matching.
- [ ] **Customer emails → Successful payments** enabled (Stripe receipt = second email you promise on the site).
- [ ] **Webhook endpoint** on **YOUR_DOMAIN** only:
  ```text
  https://YOUR_DOMAIN/api/stripe-webhook
  ```
  Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`.
- [ ] Copy **Signing secret** (`whsec_...`) for that endpoint—not from a different host.

### 3.2 Vercel Production environment (single project = buyer-facing domain)

Paste **all** of these into **Production** (Preview optional for staging). Never commit `.env`.

| Variable | Why it matters |
|----------|----------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` for live sessions; used by `sessions.retrieve`. **Webhook signature alone does not prove this key works.** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for **this** endpoint URL only. |
| `STRIPE_PRICE_*_PDF` | Must match Payment Link Price ids (backup mapping). |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Fulfillment + tokens. |
| `DOWNLOAD_TOKEN_SECRET` | HMAC for signed URLs; use `base64url` or quote values with `+` in Vercel UI. |
| `RESEND_API_KEY` | Outbound delivery email. |
| `FULFILLMENT_FROM_EMAIL` | Must be a **verified** Resend sender for your domain. |
| `PDF_BEGINNERS_SOURCE_URL` / `PDF_ADVANCED_SOURCE_URL` | Private Blob (or other) URLs—not public `/` paths. |
| `BLOB_READ_WRITE_TOKEN` | Required to fetch private Vercel Blob PDFs server-side. |
| `SITE_URL` | Canonical origin in emailed links (`https://YOUR_DOMAIN`). |

**Health check after deploy:**

```text
GET https://YOUR_DOMAIN/api/fulfillment-health
→ { "ok": true, "missing": [], "redis": "ok", "blobConfigured": true }
```

Local probe:

```bash
npm run check:fulfillment
# TEST_SEND=1 TEST_FULFILLMENT_EMAIL=you@example.com npm run check:fulfillment
```

### 3.3 PDF assets and content

- [ ] Generate PDFs: `npm run pdf:export`
- [ ] Upload to Blob: `npm run pdf:upload-blob` (needs `BLOB_READ_WRITE_TOKEN` in `.env`)
- [ ] Paste printed `PDF_*_SOURCE_URL` values into Vercel; redeploy.
- [ ] Do **not** commit paid PDFs to git; keep under private storage / gitignored paths.
- [ ] Cover images and watermarked previews live in `assets/pdf-covers/` for the storefront only.

### 3.4 Site / code gates

- [ ] Payment Link URLs in `config/sot.json` + `commerce.allowPlaceholderCheckout: false` (CI publish gate).
- [ ] Static `href` fallbacks on PDF CTAs (checkout works before JS hydrates SOT).
- [ ] `npm test` (structure + publish gate), smoke, e2e, a11y per [AGENTS.md](AGENTS.md).

---

## 4. Stripe best practices (lessons from production)

### 4.1 Two secrets, two jobs

| Secret | Proves | Does **not** prove |
|--------|--------|---------------------|
| `STRIPE_WEBHOOK_SECRET` | Event really from Stripe for this endpoint | API key is valid |
| `STRIPE_SECRET_KEY` | Server can call Stripe API (e.g. retrieve session) | Webhook is configured |

**Incident:** Webhook returned **400** never—signature OK—but `sessions.retrieve` failed with:

```text
An error occurred with our connection to Stripe. Request was retried 2 times.
```

**Fix:** Re-paste correct `sk_live_...` from the **same** Stripe account as the Payment Link; redeploy; **Resend** event.

### 4.2 Live vs test mode

| Session id | Required key |
|------------|----------------|
| `cs_live_...` | `sk_live_...` + live `whsec_...` |
| `cs_test_...` | `sk_test_...` + test `whsec_...` |

Mixing modes produces confusing 500s or “no such session” errors.

### 4.3 Product mapping (defense in depth)

Implement **all** of these in fulfillment code (we do):

1. `session.metadata.product` (set on Payment Link—**best**).
2. `STRIPE_PRICE_*` env vs line item `price.id`.
3. Line item `unit_amount` in cents.
4. Session `amount_total` fallback (e.g. `499` / `999` for $4.99 / $9.99).

**Incident:** Payment Link had `metadata: {}`; fulfillment still worked via `amount_total: 499` after env was fixed. Still add metadata for sister projects.

### 4.4 One domain for money path

| Misconfiguration | Symptom |
|------------------|---------|
| Webhook on `other-domain.com`, buyer on `your-domain.com` | Webhook **200** on wrong host; buyer **404** on `/api/download-link` |
| Separate Vercel projects per domain | Separate Redis; fulfillment invisible across hosts |

**Always check:** Stripe → Webhooks → **which URL** received `checkout.session.completed` for the failing payment.

### 4.5 Replay after fixes

Paid buyers are not lost. After env/key fixes:

1. Stripe → Webhooks → event → **Resend** to the correct endpoint.
2. Expect **200** and `"fulfillment": "fulfilled"`.
3. Buyer refreshes `success.html` or uses email link.

---

## 5. Reading failures (HTTP + Redis)

### 5.1 Webhook response body

| Response | Meaning |
|----------|---------|
| `400` Invalid signature | Wrong `STRIPE_WEBHOOK_SECRET` or body parsed before verify |
| `500` Fulfillment is not configured + `detail` lists env keys | Missing `PDF_*`, Redis, Resend, etc. |
| `500` Fulfillment failed + `detail` | Runtime error—read `detail` (Stripe API, Resend, product mapping) |
| `200` `{ fulfillment: "fulfilled" }` | Success |

### 5.2 `download-link` status

| HTTP | Redis state | Meaning |
|------|-------------|---------|
| **404** | No `fulfillment:cs_...` | Webhook never wrote (or wrong Redis project) |
| **202** | `email_pending` / not `fulfilled` | Webhook started; retry poll |
| **200** | `fulfilled` | In-page download URL ready |

**Incident pattern:** Upstash **200** on `download-link` but **404** body → Redis works; fulfillment key missing because webhook died **before** writing `fulfillment:` (e.g. missing `PDF_*` or bad `STRIPE_SECRET_KEY`).

### 5.3 Vercel log fields worth opening

- Function **stderr**: `[stripe-webhook] fulfillment error: ...`
- Response JSON **`detail`** (Stripe Dashboard shows this on newer deploys)
- **External APIs**: `*.upstash.io` → confirms Redis env

---

## 6. PDF content and delivery best practices

### 6.1 Storage

- **Production:** Vercel Blob private URLs + `BLOB_READ_WRITE_TOKEN`.
- **Never** serve paid PDFs from `public/` or immutable CDN cache.
- **Download route:** `Cache-Control: private, no-store`; validate HMAC token + Redis jti + `fulfillment.status === 'fulfilled'`.

### 6.2 Two link lifetimes (by design)

| Channel | TTL | Purpose |
|---------|-----|---------|
| Email | 7 days (default) | Post-purchase access |
| Success page | 15 minutes | Immediate download after redirect |

Rotating `DOWNLOAD_TOKEN_SECRET` invalidates old email links; replay webhook or support re-send after rotation.

### 6.3 English (en-US) buyer copy—keep consistent

All buyer-facing strings should be **American English** and aligned across:

- PDF cards (price, license, refund, delivery promise),
- `success.html`,
- Resend HTML/text,
- `terms.html#paid-pdf-license`,
- `privacy.html` (analytics, payment processors).

**Copy safety (audit-driven):**

- Avoid unprovable timing claims (“under 60 seconds”) → prefer “when fulfillment is ready” or another operationally true phrase.
- Avoid fake precise comparisons (“~$149 PD”) → “often $100+” or similar qualified language.
- Promise **two emails** only if Stripe receipts + Resend are both enabled.
- Classroom license + **14-day no-questions-asked refund** must match legal pages.

Centralize commerce copy in `config/sot.json#commerce` where possible; hydrate UI from SOT.

### 6.4 Storefront trust (reduces support load)

- Real cover thumbnails with dimensions (no CLS).
- Watermarked **Preview 3 pages** (not full PDF).
- Buyer FAQ + schema.org `FAQPage`.
- Post-purchase page with live region, license/refund repeat, masked email.

---

## 7. Incident timeline (promptanatomy.online, 2026-05-16)—teach-back

| Time (EEST) | Observation | Root cause class |
|-------------|-------------|------------------|
| ~14:10 | Webhook **500** ×2 | Missing/wrong fulfillment env on Production |
| ~14:10 | `download-link` **404**; Upstash **200** | Redis OK; no `fulfillment:cs_...` written |
| ~14:46 | Resend **500**, `detail`: Stripe connection error | Invalid/wrong `STRIPE_SECRET_KEY` on Vercel (signature used `whsec_` only) |
| ~14:52 | Resend **200**, `fulfillment: fulfilled` | Correct `sk_live_...` + full env; manual event replay |
| After deploy | `fulfillment-health` **ok** | All required env present |

**Session reference (live test):** `cs_live_a1GWQ6J4J87WC3zNf9ChGyMoU4VgeP7S1Ybdmbhyy9lIj4F4bOUM6DtzEg`, event `evt_1TXg79GYF93wS2Kahle9jaUe`, $4.99 Beginners, Payment Link `plink_1TXdozGYF93wS2KabE5nEKfw`.

---

## 8. Sister-project handoff template

When cloning this stack to another brand/domain:

```text
PROJECT: _______________________
BUYER_DOMAIN: https://________________
STRIPE_ACCOUNT: ____________________

Payment Links:
  - Product A ($____): buy.stripe.com/________  metadata.product=________
  - Product B ($____): buy.stripe.com/________  metadata.product=________

Success URL:
  https://BUYER_DOMAIN/success.html?session_id={CHECKOUT_SESSION_ID}

Webhook:
  https://BUYER_DOMAIN/api/stripe-webhook
  whsec: ____________________

Vercel Production env (check all):
  STRIPE_SECRET_KEY (sk_live_...)
  STRIPE_WEBHOOK_SECRET
  STRIPE_PRICE_* (price_...)
  UPSTASH_REDIS_REST_URL / TOKEN
  DOWNLOAD_TOKEN_SECRET
  RESEND_API_KEY
  FULFILLMENT_FROM_EMAIL (verified: ____________)
  PDF_*_SOURCE_URL + BLOB_READ_WRITE_TOKEN
  SITE_URL=https://BUYER_DOMAIN

Post-deploy:
  [ ] GET /api/fulfillment-health → ok
  [ ] npm run check:fulfillment
  [ ] Test purchase (test mode) → success page download + emails
  [ ] Live purchase OR live Resend drill documented

Support contact: ____________________
```

---

## 9. Operational playbook (short)

1. **Buyer paid, no PDF** → Stripe webhook URL host = buyer domain? → Vercel env complete? → read webhook `detail` → fix → **Resend** event.
2. **success.html stuck** → Poll stops on 404 = no fulfillment; 202 = wait; 200 = download ready.
3. **Email missing** → Resend dashboard; verify `FULFILLMENT_FROM_EMAIL` domain; check spam.
4. **Download 403/503** → Token expired, secret rotated, or Blob fetch failed (`BLOB_READ_WRITE_TOKEN`).
5. **Before next launch** → New sale without manual Resend to confirm first-attempt webhook **200**.

---

## 10. Quality gates (CI = source of truth)

```bash
npm ci
npm test                    # structure + publish gate + fulfillment hooks
npm run test:smoke
npm run test:e2e            # success page polling, Stripe CTA
npm run test:a11y
```

Optional before Production:

```bash
npm run check:fulfillment
stripe listen --forward-to localhost:3000/api/stripe-webhook   # local webhook dev
```

---

## 11. Files to know in this repo

| File | Role |
|------|------|
| `api/stripe-webhook.js` | Signature verify + fulfillment entry |
| `api/_lib/fulfillment.js` | Product map, Redis, Resend, tokens, PDF load |
| `api/download-link.js` | Success page polling |
| `api/download.js` | Signed PDF bytes |
| `api/fulfillment-health.js` | Production env/Redis probe |
| `success.html` | Post-checkout UX |
| `config/sot.json` | Payment Link URLs + commerce copy |
| `.env.example` | Canonical env list |
| `scripts/check-fulfillment-env.js` | Local Redis (+ optional Resend) test |
| `scripts/upload-pdfs-to-blob.js` | Upload paid PDFs |

---

## 12. Summary principles (pin on the wall)

1. **Same domain** for checkout redirect, webhook, Redis, and APIs.  
2. **`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are both mandatory**—verify the secret key with a real `cs_*` retrieve.  
3. **Fulfillment env is a set**—partial config gives 500 or 404, not “half working”.  
4. **Metadata + price ids + amount fallback**—never one mapping alone.  
5. **Private PDFs + signed tokens + idempotent webhook**.  
6. **en-US copy** aligned with legal, email, and UI; no overclaimed timing or pricing.  
7. **`fulfillment-health` + `detail` in webhook errors**—diagnose before guessing.  
8. **Replay Stripe events** after fixes—buyers can be recovered without recharging.

---

*Last updated: 2026-05-16 (post live fulfillment verification, Stage 6c).*
