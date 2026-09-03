# Gold Legacy Standard — Prompt Anatomy CEO AI System

**Product:** Prompt Anatomy CEO AI System (Operations + Strategy playbooks)
**Production:** https://www.promptanatomy.ceo/ (post-deploy)
**Repository:** local repo `05_DI_operacine_sistema_TOP_vadvams_CEO_COO`
**Sister repo:** [`DITreneris/teacher`](https://github.com/DITreneris/teacher) (Edu MVP, separate brand/theme)
**Current gold baseline:** v1.2.0, May 2026
**Audience:** Internal agents, operators, sister repos adopting this stack.

This document užfiksuoja current best version of repo'jo ir produkto kaip referencinį standartą. Jei būsimas darbas keičia šiuos principus, atnaujinkite šį failą kartu su kodu, testais ir dokumentais, į kuriuos jis nuoroda.

## 1. Product Standard

Prompt Anatomy CEO AI System yra du paid PDF playbooks JAV CEO/COO auditorijai + nemokamas storefront prompts generator.

Free + paid invariants:

- Product copy yra en-US (CEO/COO US auditorija).
- Primary user yra US founder, CEO, COO, CFO.
- Site nelaukia AI API call (storefront — copy, ne LLM call).
- Saved sessions storefront'e — browser `localStorage`.
- **Modes:** `DAILY`, `WEEKLY`, `STRATEGIC` (free generator) + `Fast` / `Deep` / `Board` depth.
- Product promise yra **executive cadence**, ne AI hype ar guaranteed time savings.
- **Net copy rule (IA v3):** first screen copy only shrinks — relocate, shorten, or delete; no new explanation layers without equal removal.

Core failai:

- [`index.html`](index.html), [`generator.js`](generator.js), [`commerce.js`](commerce.js), [`style.css`](style.css), [`config/sot.json`](config/sot.json)
- [`docs/pdf-source/operating-cadence.html`](docs/pdf-source/operating-cadence.html), [`docs/pdf-source/strategic-os.html`](docs/pdf-source/strategic-os.html), [`docs/pdf-source/pdf-print.css`](docs/pdf-source/pdf-print.css)
- [`scripts/export-pdfs.js`](scripts/export-pdfs.js), [`scripts/render-pdf-preview-pages.js`](scripts/render-pdf-preview-pages.js)

**Homepage flow (2026-05, IA v3 + ops polish):**

1. **Hero** — frozen H1 *Turn scattered KPIs into a clear weekly CEO brief*; eyebrow + short two-line lead; primary CTA → `#operationsCenter`; secondary → `#pdf-guides` (no prices in hero). Inline use cases: `Use cases: CEO planning · COO reviews · …` via `.hero-use-cases` + `data-trust-format="inline"`. Glass preview card desktop-only (P1–P3 + “+1 priority in your output”). **No** `.use-cases-strip`, **no** hero tertiary CTA.
2. **Sticky nav** — `.btn.btn--nav-secondary` *CEO playbooks* → `#pdf-guides` (SOT `copy.nav`); `#stickyCopyBtn` hidden with `display: none` until form input (must not reserve flex space when hidden).
3. **`#operationsCenter`** — H2 from SOT `copy.opsCenter.title` + `.ops-journey-steps--compact` (step 4 **Reuse templates** → `#library`) → `.ops-control-panel` (mode tabs with icons + `.depth-bar` with `#depthTip.depth-tip--bar` inside). **No** `ops-center-intro` / value paragraphs. Form: `.ops-form-grid` (2 cols, `min-width: 0`). `#sessionsPanel` sibling of `.ops-layout`.
4. **`#pdf-guides`** — **IA slim v4:** eyebrow + H2 + lead → 2 lean product cards (specs, bullets, TOC, license/refund line, CTA) → section `trust-row` → **Purchase FAQ** (`buyerFaq` ×3). **No** compare strip, per-card trust, delivery blurb, testimonials, publisher strip. Footer holds **Product FAQ** (3 items) + JSON-LD `FAQPage`.
5. **`#library`** — template library (collapsed by default).
6. **`#rules`** — economic discipline rules (collapsed).
7. **`#community`** — Telegram + app.

Copy hooks: `config/sot.json` → `copy.*`; hydrate via `commerce.js` (`initHeroCopy`, `initNavCopy`, `initPdfStorefrontCopy`, …).

## 2. Source of Truth Standard

[`config/sot.json`](config/sot.json) yra brand, mode labels, library prompts, theme spalvų, PDF guide metadata, commerce copy, buyer FAQ, Stripe URL, pricing, testimonialų ir legal operatorių metadata source.

Nehardcode'inti naują commerce ar buyer-facing marketing copy HTML, jei SOT sekcija jau egzistuoja.

SOT sekcijos:

- `brand` — produkto vardas, edition, positioning.
- `colors` ir `theme` — brand paletė ir runtime theme tokens.
- `copy.hero` — eyebrow, frozen headline, lead, CTAs, `useCasesLabel`, preview rows.
- `copy.nav` — sticky Playbooks CTA + aria-label.
- `copy.opsCenter` — title only (no `value` / `intro`).
- `copy.opsDepth.tip` — depth help line (field-help, not chip).
- `productDecision` — strateginis pozicionavimas (`playbook` not "OS"), launch scope, pricing rationale.
- `buyerProblems` — 8 named CEO problems.
- `pdfGuides` — `operating` (21p, $9.99) ir `strategic` (43p, $19.99) struktūra, chapters, buyerPromise.
- `productBlueprint` — overall pages, prompt counts.
- `commerce` — Stripe URL, pricing, delivery promise, compare strip.
- `buyerFaq` — buyer FAQ + JSON-LD mirror.

## 3. Design System Standard

Kanoninis DS gidas: [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md) (PDF/OG) · Storefront DS 1.1: [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md), [`styles/tokens.css`](styles/tokens.css), [`docs/ds_improvement_plan.md`](docs/ds_improvement_plan.md).

Current gold tokens:

- Primary violet: `#4A148C`
- Primary dark: `#2E0A52`
- Primary light: `#5B1F9E`
- Accent gold: `#FFB300`
- Surface: `#F6F7FB`
- Text: `#1E1F25`
- Text muted: `#6B7280`
- Border: `#E7EAF2`

Design taisyklės:

- **Storefront theme:** light only (no dark-mode toggle). QA and screenshots use the light gold experience.
- **Box model:** global `box-sizing: border-box` in [`styles/base.css`](styles/base.css) — required so `width: 100%` form fields do not overflow grid columns (padding/border included in width).
- **Nested grids:** `.ops-layout > .ops-form`, `.ops-layout > .ops-sidebar`, and `.ops-form-grid > *` use `min-width: 0` so 7fr/5fr layout does not clip field borders past card edges.
- **Depth tip:** help text only (`#depthTip.field-help`) — **never** full-width `.chip--tip` inside `.depth-bar` (double-frame UX).
- **Nav Playbooks:** `.btn.btn--nav-secondary` on dark bar — not ghost pill, not misaligned by hidden copy button flex space.
- Cover'is = vienas pažadas per 2 sekundes (eyebrow + title + subtitle + 2-line callout + footer).
- NIEKADA ant cover: Audience/Length/Version/Format/Pair-with/Page X/Y.
- `.cover .cover-positioning strong` privalo būti gold (`#FFB300`), ne primary violet — kitaip kontrasto bug ant violetinio fono.
- Eyebrow naming visiems CEO produktams: `PROMPT ANATOMY · CEO AI SYSTEM`.
- Footer page numbers konsistentinis `Page X/21` (operating) arba `Page X/43` (strategic).

## 4. PDF Asset Pipeline Standard

```text
docs/pdf-source/*.html  →  scripts/export-pdfs.js (Playwright Letter)  →  api/_private/pdfs/*.pdf
docs/pdf-source/*.html  →  scripts/render-pdf-preview-pages.js (734×950 PNG)  →  assets/pdf-covers/*.png
assets/og/og-cover.svg  →  npx svgexport (1200×630 PNG)  →  assets/og/og-cover.png
```

Pipeline invariants:

- `npm run pdf:assets` regeneruoja **viską**: PDFs + 8 cover/preview PNGs + OG cover.
- Page count assertion: operating=21, strategic=43 ([`scripts/export-pdfs.js`](scripts/export-pdfs.js) failina jei mismatch).
- Min PNG bytes: cover ≥40 KB, preview ≥15 KB, OG ≥20 KB ([`tests/structure.test.js`](tests/structure.test.js)).
- Cover render naudoja `body.pdf-asset-export` mode — atskirta nuo regular print mode.
- Render script naudoja `display = ''` (CSS default), NE `display = 'flex'` non-cover sekcijoms (kitaip layout sulūžta į horizontal columns).
- **Content maturity (2026-09-03):** each interior page answers When / Do / See / Done. Fast vs Deep must differ in TASK and OUTPUT, not three swapped words. Do not follow [`docs/pdf-content-v02.md`](docs/pdf-content-v02.md) as an add-pages ticket.
- **Clip trap:** `.page` is a fixed Letter frame with `overflow: hidden`. Extra sentences disappear. On overflow, cut copy — never add a 22nd or 44th `<section class="page">`.

## 5. Paid PDF Commerce Standard

Du paid PDFs:

- **CEO AI Operations Playbook** — 21 pages, $9.99 (entry).
- **CEO AI Strategy Playbook** — 43 pages, $19.99 (flagship).

Commerce invariants:

- Stripe Payment Links, ne custom cart ([`config/sot.json`](config/sot.json) `commerce.stripePaymentLinks`).
- `commerce.allowPlaceholderCheckout: false` Production.
- [`index.html`](index.html) turi static `https://buy.stripe.com/...` href fallbacks.
- [`commerce.js`](commerce.js) hidruoja iš SOT, bet checkout veikia prieš SOT fetch'ą.
- Buyer copy be overclaim:
  - jokio "under 60 seconds" timing
  - jokio fake precise PD price comparison
  - jokio anonymous quotes kaip named endorsements

## 6. Fulfillment Standard (žr. [`memo_pdf.md`](memo_pdf.md))

Same-domain rule: Stripe success URL + webhook URL + Vercel Production env + Redis store + download API privalo būti **vienas** buyer-facing host. Šiam repo: `https://www.promptanatomy.ceo` (`ceo-teal.vercel.app` = tas pats Vercel projektas, ne Stripe host).

Webhook: `https://www.promptanatomy.ceo/api/stripe-webhook/` — trailing slash privalomas (`trailingSlash: true` 308; Stripe POST redirectų neseka).

Required fulfillment env (kanoninis sąrašas: [`.env.example`](.env.example)):

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_OPERATING_PDF`, `STRIPE_PRICE_STRATEGIC_PDF`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `DOWNLOAD_TOKEN_SECRET`
- `RESEND_API_KEY`, `FULFILLMENT_FROM_EMAIL`
- `PDF_OPERATING_SOURCE_URL`, `PDF_STRATEGIC_SOURCE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `SITE_URL`

Product mapping priority (defense in depth):

1. Payment Link metadata `product=operating|strategic`
2. Stripe Price IDs from env
3. Line-item amount
4. Session amount fallback (999 / 1999 cents)

## 7. SEO / GEO Standard

- Public pages naudoja `lang="en-US"`.
- Canonical storefront URL: **`/en/`**; production `/` redirects to `/en/` (`vercel.json`).
- Root [`index.html`](index.html) = frozen frontpage template (WebApplication, FAQPage, base Organization).
- Built [`en/index.html`](en/index.html) adds GEO JSON-LD: enhanced Organization, **Person** (Tomas Staniulis), WebSite, Product×2, HowTo — see [`docs/GEO_STACK.md`](docs/GEO_STACK.md).
- Generated: `robots.txt`, `sitemap.xml`, `llms.txt` (`config/sot.json` → `geo`; `npm run build`).
- OG image 1200×630, `og:image` → `assets/og/og-cover.png?v=N` (cache-bust per release).
- `lt/` = regression-only (`noindex`).

## 8. Quality Gates

CI tiesos šaltinis:

```bash
npm run test:mixed     # test + smoke + e2e + a11y + visual
```

Lokali baseline:

```bash
npm ci
npm test               # structure (~144 tests) + html-validator + eslint
npm run test:smoke
npm run test:e2e
npm run test:visual    # hero + ops-center + pdf-guides baselines
npm run test:a11y
```

Asset / PDF copy keitimams:

```bash
npm run pdf:assets     # regen all PNGs + PDFs + OG
npm test               # verify min sizes + alt text
npm run build          # en/ + lt/ locale pages
```

## 9. Drift Checklist

Prieš merge:

- Ar redagavau SOT, ne hardcoded copy?
- Ar copy išliko en-US?
- Ar IA v3 taisyklė laikoma (net copy reduction first screen)?
- Ar hero neturi `.use-cases-strip`, ops neturi intro/value paragraphs?
- Ar depth tip = `#depthTip.field-help` (ne chip inside `.depth-bar`)?
- Ar form laukai turi `box-sizing: border-box` + grid `min-width: 0` (no border bleed)?
- Ar `#stickyCopyBtn.is-hidden` naudoja `display: none` (nav alignment)?
- Ar cover'is liko 5 elementų (eyebrow + title + subtitle + callout + footer)?
- Ar callout `strong` gold ant violet?
- Ar `Page X/Y` footer numeracija konsistentinė (21 / 43)?
- Ar interior page atsako When / Do / See / Done (ne feature list)?
- Ar tekstas netrūksta į footerį (`.page` yra `overflow: hidden`)?
- Ar po cover/HTML keitimo paleidau `npm run pdf:assets`?
- Ar `npm test` praėjo?
- Ar `npm run build` regeneravo en/lt locale puslapius?
- Ar Stripe href fallback'ai vis dar veikia be JS?
- Ar atnaujinau **šį failą** jei keitė homepage IA / ops DOM?

## 10. Sister Repo Boundary

Šis repo:

- `promptanatomy.ceo` — CEO/COO produktas
- Violet + amber tema
- Du PDF (Operations + Strategy)
- Vercel + Upstash + Vercel Blob + Resend pattern (kaip sister)

Sister repo ([`DITreneris/teacher`](https://github.com/DITreneris/teacher)):

- `promptanatomy.online` — K-12 teachers Edu MVP
- Navy + gold tema
- Du PDF (Beginners + Advanced)
- Tas pats commerce/fulfillment pattern (žr. abu `memo_pdf.md`)
- **Niekada** nedėlioti CEO copy į teacher repo ir atvirkščiai.

## 11. Known UI regressions (fixed — do not reintroduce)

| Symptom | Root cause | Gold fix |
|---------|------------|----------|
| Form field borders clip past Strategic Context card | `width: 100%` + content-box + grid `min-width: auto` | Global `border-box`; `min-width: 0` on ops grid columns/cells |
| Nav Playbooks “floating” with gap on the right | `#stickyCopyBtn` used `visibility: hidden` (still in flex layout) | `.is-hidden { display: none }` |
| Depth tip looks like messy double frame | Full-width `.chip--tip` inside `.depth-bar` | `#depthTip.field-help` below bar |
| Five headline layers above tool (IA v2) | strip + ops value + intro + duplicate use-case h2 | IA v3 inline use cases; slim ops header |
| PDF page looks unfinished / text missing at footer | V02 expansion + `.page { overflow: hidden }` | Rewrite in place; compress prompt boilerplate; visually check clip |

## 12. Current Known Follow-Ups

Šie nėra blokeriai, bet neturėtų būti pamiršti:

- Stripe live URLs + `allowPlaceholderCheckout: false` — closed 2026-09-02 (Phase 15). Do not reopen as a first ticket.
- Real testimonials prieš stronger paid promotion.
- WebP siblings PDF cover'iams ([`scripts/optimize-pdf-covers.js`](scripts/optimize-pdf-covers.js)) — sharp dep optional.
- Programmatic OG generation (satori) — current SVG pipeline pakanka MVP.
- CSP enforcement (current Report-Only).

---

*Last updated: 2026-09-03. PDF interior maturity-in-place (When/Do/See/Done); clip trap on `.page { overflow: hidden }`; Phase 15 commerce follow-ups closed.*
