# Gold Legacy Standard — Prompt Anatomy CEO AI System

**Product:** Prompt Anatomy CEO AI System (Operations + Strategy playbooks)
**Production:** https://www.promptanatomy.ceo/ (post-deploy)
**Repository:** local repo `05_DI_operacine_sistema_TOP_vadvams_CEO_COO`
**Sister repo:** [`DITreneris/teacher`](https://github.com/DITreneris/teacher) (Edu MVP, separate brand/theme)
**Current gold baseline:** v1.1.0, May 2026
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

Core failai:

- [`index.html`](index.html), [`generator.js`](generator.js), [`commerce.js`](commerce.js), [`style.css`](style.css), [`config/sot.json`](config/sot.json)
- [`docs/pdf-source/operating-cadence.html`](docs/pdf-source/operating-cadence.html), [`docs/pdf-source/strategic-os.html`](docs/pdf-source/strategic-os.html), [`docs/pdf-source/pdf-print.css`](docs/pdf-source/pdf-print.css)
- [`scripts/export-pdfs.js`](scripts/export-pdfs.js), [`scripts/render-pdf-preview-pages.js`](scripts/render-pdf-preview-pages.js)

**Homepage flow (2026-05, aligned with sister `DITreneris/teacher`):**

1. Hero — primary CTA free tool (`#operationsCenter`); secondary → `#pdf-guides`; 4-step stepper → library via step 4 (no hero tertiary link). Glass preview card desktop-only.
2. `#operationsCenter` — free prompt generator.
3. `#pdf-guides` — paid PDF storefront (optional executive playbooks eyebrow, card kickers, publisher strip → `promptanatomy.app`).
4. `#library` — template library (collapsed by default).
5. `#rules` — economic discipline rules (collapsed).
6. `#community` — Telegram + app.

Sticky nav: **Playbooks** → `#pdf-guides` + Copy prompt. Copy hooks: `config/sot.json` → `copy.pdfStorefront`; hydrate via `commerce.js` → `initPdfStorefrontCopy`.

## 2. Source of Truth Standard

[`config/sot.json`](config/sot.json) yra brand, mode labels, library prompts, theme spalvų, PDF guide metadata, commerce copy, buyer FAQ, Stripe URL, pricing, testimonialų ir legal operatorių metadata source.

Nehardcode'inti naują commerce ar buyer-facing marketing copy HTML, jei SOT sekcija jau egzistuoja.

SOT sekcijos:

- `brand` — produkto vardas, edition, positioning.
- `colors` ir `theme` — brand paletė ir runtime theme tokens.
- `productDecision` — strateginis pozicionavimas (`playbook` not "OS"), launch scope, pricing rationale.
- `buyerProblems` — 8 named CEO problems.
- `pdfGuides` — `operating` (12p, $9.99) ir `strategic` (28p, $19.99) struktūra, chapters, buyerPromise.
- `productBlueprint` — overall pages, prompt counts.
- `commerce` — Stripe URL, pricing, delivery promise, compare strip.
- `buyerFaq` — buyer FAQ + JSON-LD mirror.

## 3. Design System Standard

Kanoninis DS gidas: [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md) (PDF/OG) · Storefront DS 1.0: [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md), [`styles/tokens.css`](styles/tokens.css), [`docs/ds_improvement_plan.md`](docs/ds_improvement_plan.md).

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
- Cover'is = vienas pažadas per 2 sekundes (eyebrow + title + subtitle + 2-line callout + footer).
- NIEKADA ant cover: Audience/Length/Version/Format/Pair-with/Page X/Y.
- `.cover .cover-positioning strong` privalo būti gold (`#FFB300`), ne primary violet — kitaip kontrasto bug ant violetinio fono.
- Eyebrow naming visiems CEO produktams: `PROMPT ANATOMY · CEO AI SYSTEM`.
- Footer page numbers konsistentinis `Page X/12` (operating) arba `Page X/28` (strategic).

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

Same-domain rule: Stripe success URL + webhook URL + Vercel Production env + Redis store + download API privalo būti **vienas** buyer-facing host. Šiam repo: `https://www.promptanatomy.ceo`.

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
- Canonical URLs use `.html` where applicable.
- [`index.html`](index.html) turi JSON-LD: Organization, WebSite, SoftwareApplication, FAQPage, Product/Offer, HowTo.
- OG image 1200×630, `og:image` rodo į `assets/og/og-cover.png?v=N` (cache-bust per release).
- `lt/` kelias laikomas regression-only (nedeklaruojam aktyvios LT lokalizacijos).

## 8. Quality Gates

CI tiesos šaltinis:

```bash
npm run test:mixed     # test + smoke + e2e + a11y
```

Lokali baseline:

```bash
npm ci
npm test               # structure (103 tests) + html-validator + eslint
npm run test:smoke
npm run test:e2e
npm run test:a11y
```

Asset / PDF copy keitimams:

```bash
npm run pdf:assets     # regen all PNGs + PDFs + OG
npm test               # verify min sizes + alt text
```

## 9. Drift Checklist

Prieš merge:

- Ar redagavau SOT, ne hardcoded copy?
- Ar copy išliko en-US?
- Ar cover'is liko 5 elementų (eyebrow + title + subtitle + callout + footer)?
- Ar callout `strong` gold ant violet?
- Ar `Page X/Y` footer numeracija konsistentinė?
- Ar po cover/HTML keitimo paleidau `npm run pdf:assets`?
- Ar `npm test` praėjo (103/103)?
- Ar `npm run build` regeneravo en/lt locale puslapius?
- Ar Stripe href fallback'ai vis dar veikia be JS?

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

## 11. Current Known Follow-Ups

Šie nėra blokeriai, bet neturėtų būti pamiršti:

- Real Stripe live URLs (`config/sot.json` `commerce.stripePaymentLinks`) — vis dar placeholder.
- `commerce.allowPlaceholderCheckout` flip į `false` prieš production launch.
- Real testimonials prieš stronger paid promotion.
- WebP siblings PDF cover'iams ([`scripts/optimize-pdf-covers.js`](scripts/optimize-pdf-covers.js)) — sharp dep optional.
- Programmatic OG generation (satori) — current SVG pipeline pakanka MVP.
- CSP enforcement (current Report-Only).

---

*Last updated: 2026-05-21. Reference baseline po PDF Assets Premium Reset (Wave 1–7).*
