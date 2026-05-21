# Paid flow test backlog (P1)

**Status:** Planning backlog — extend automation without large refactors.  
**SOT:** [`CURRENT_TRUTH.md`](CURRENT_TRUTH.md) · **Release gate today:** `npm run test:mixed`

## Already automated

| Area | Command | Files |
|------|---------|-------|
| Structure / PDF page gates / asset bytes | `npm test` | [`tests/structure.test.js`](../tests/structure.test.js), [`scripts/export-pdfs.js`](../scripts/export-pdfs.js) |
| Homepage smoke | `npm run test:smoke` | [`tests/e2e/smoke.spec.js`](../tests/e2e/smoke.spec.js) |
| Core generator flow | `npm run test:e2e` | [`tests/e2e/core-flow.spec.js`](../tests/e2e/core-flow.spec.js) |
| A11y (home, legacy privacy, success, terms) | `npm run test:a11y` | [`.pa11yrc.json`](../.pa11yrc.json), [`package.json`](../package.json) |

## Backlog — commerce UI smoke

Add to [`tests/e2e/smoke.spec.js`](../tests/e2e/smoke.spec.js) or a dedicated `commerce-smoke.spec.js`:

1. **`#pdf-guides` renders** — section visible; both product cards present (`operating-pdf`, `strategic-pdf` ids or data attributes).
2. **Stripe CTA `href`** — each buy button `href` matches `config/sot.json` `commerce.stripePaymentLinks` (or static fallback in HTML before hydration); reject empty/`#` when `allowPlaceholderCheckout: false` in test fixture.
3. **Preview modal** — open preview control; modal visible; at least one interior thumbnail image loads (`assets/pdf-covers/`).

**Manual until automated:** live Payment Link redirect (Stripe test mode), webhook + email (see [`memo_pdf.md`](../memo_pdf.md)).

## Backlog — success / legal a11y

| Page | Today | Action |
|------|-------|--------|
| `/` | pa11y in `test:a11y` | Keep |
| `/privatumas.html` | pa11y (LT legacy) | Keep for regression |
| `/privacy.html` | **not in suite** | Add to `test:a11y` in [`package.json`](../package.json) |
| `/success.html`, `/terms.html` | pa11y | Keep |

## Backlog — structure assertions (optional)

In [`tests/structure.test.js`](../tests/structure.test.js):

- Assert root `index.html` copy contains `21-page` / `43-page` (or SOT-driven read via JSON parse).
- Assert `commerce.js` / static Stripe hrefs present when placeholders disallowed (config flag read in test).

## QA doc alignment

| Doc | Reflects |
|-----|----------|
| [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md) | Manual Stripe/Vercel + `test:mixed` before prod |
| [`README.md`](../README.md) | `npm test` vs `npm run test:mixed` |
| This file | What is automated vs manual |

**Done when:** items above are either implemented in CI or explicitly marked manual in LAUNCH_CHECKLIST with owner.
