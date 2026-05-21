# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- **Vercel production build (Next.js detection)** — Deploy failed with `No Next.js version detected` because the Vercel project Framework Preset was Next.js while this repo is static HTML/CSS/JS plus root `api/` serverless routes (no `next` dependency). Added `"framework": null` to `vercel.json` to override the dashboard preset and use existing `buildCommand: npm run build` + `outputDirectory: .` ([Vercel docs: `null` = Framework Preset "Other"](https://vercel.com/docs/project-configuration/vercel-json#framework)).
- **OG cover thumbnail readability** — Previous `og-cover.svg` carried ~7 text reading levels (eyebrow chip, headline×2, subhead, 3 trust pills, 2 card kickers, 2 card titles, 2 card tails, 2 page badges, wordmark, tagline). At X/LinkedIn/FB feed thumbnail sizes (~300–550 px wide) only the headline survived. Refit to 4 reading levels per `assets/og/README.md` "≤4 main text blocks" spec.
- **Stale OG alt text** — `og:image:alt` / `twitter:image:alt` in `index.html`, `en/index.html`, `lt/index.html` still read `AI Operations Center — Run AI like ops. Strategy, Process, Execution.` from a previous layout; replaced with content matching the current two-playbook PNG.
- **Interior PNG render bug (critical)** — `scripts/render-pdf-preview-pages.js` priskyrė `display: 'flex'` visiems `<section class="page">`, todėl interior puslapių `<h2>`, `<p>`, `<ul>`, `<table>` virsdavo horizontaliais flex stulpeliais (4-simbolių pločio kolonėlės). Pakeista į `display: ''` (CSS default), tad cover'is išsaugo savo `display: flex`, o interior puslapiai grįžta į block layout. Visi `*-p2/p3/p4.png` dabar skaitomi.
- **Cover callout kontrasto bug** — globalus `strong { color: #4A148C }` darė „Run AI like ops." violetinį ant violetinio fono. Pridėtas `.cover .cover-positioning strong { color: #FFB300 }` ir `.cover .cover-positioning { color: #FFFFFF }` (mirror sister repo `DITreneris/teacher`).
- **Strategic 28-page footer numeracija** — buvo gaps (Page 11, 18, 22 trūko) ir dublikatai. Visi 28 puslapiai dabar nuosekliai `Page X/28` su brand-left `CEO AI Strategy Playbook`.

### Added

- **Premium cover layout (PDF + OG)** — abu cover'iai (Operations + Strategy) ir OG kortelė pertvarkyti pagal premium standartą: 5 elementai cover'yje (eyebrow + title + subtitle + 2-eilučių callout + footer); be metadata triukšmo (Audience/Length/Version/Format/Pair-with perkelta į p2 `dl.kv` blokus); be `Page 1/12` ant cover (paslėpta per `body.pdf-asset-export .cover-page-number`).
- **OG cover violet redesign** — `assets/og/og-cover.svg` perdarytas iš dark abstract „Strategy/Process/Execution" pilių į premium violet brand match: dual-product cards (Operations 12p + Strategy 28p), trust chips (FOR US CEOs & COOs · 12 + 28 PAGES · $9.99 · $19.99), eyebrow `PROMPT ANATOMY · CEO AI SYSTEM`. Cache-bust `?v=2` → `?v=3`.
- **Design system docs** — [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md) (kanoninis DS gidas su brand tokens, cover anatomy, drift checklist) + [`gold_legacy_standard.md`](gold_legacy_standard.md) (referencinis baseline su sister-repo boundary).
- **WebP cover optimization (optional)** — [`scripts/optimize-pdf-covers.js`](scripts/optimize-pdf-covers.js) + `npm run optimize:covers`; generuoja WebP siblings PDF cover/preview ir OG PNG'ams (graceful skip jei `sharp` neįdiegtas — `npm i -D sharp` enables).

### Changed

- **OG cover thumbnail-first refit** — `assets/og/og-cover.svg` reduced to 4 reading levels (headline + 2 product cards + footer). Removed: eyebrow chip `PROMPT ANATOMY · CEO AI SYSTEM`, subhead `Daily ops cadence…`, three trust pills (`FOR US CEOs & COOs`, `12 + 28 PAGES`, `$9.99 · $19.99`), card kickers `PLAYBOOK 01/02`, page badges (`12/28 PAGES`), and right-aligned tagline `Run AI like operations — not like search.`. Card titles shortened to single-word `Operations` / `Strategy` at 52 px with small `CEO AI PLAYBOOK · 01/02` kickers (12 px) and one-line tails (`Daily workflows`, `Decisions & ROI`). Asymmetric accent — Operations keeps gold border, Strategy gets neutral white border. Footer wordmark bumped 20 → 28 px; price `$9.99 + $19.99` moved to right-aligned footer text. Headline restated as `Two CEO Playbooks. / One AI System.` at 64 px (slightly tighter than the prior 68 px to maintain a gap from the right card column). Cache-bust `?v=3` → `?v=4` across `index.html`, `en/index.html`, `lt/index.html`, `scripts/trace-og.js`. PNG export 213 KB (well under 300 KB target).
- **Strategic product rename** — `CEO Executive Strategic AI Playbook` → `CEO AI Strategy Playbook` (drop redundant „Executive Strategic"). Legacy išsaugotas `config/sot.json` `labelLegacy`. Atnaujinta: `config/sot.json`, `index.html`, `en/`, `lt/`, `commerce.js`, `tests/structure.test.js`, `README.md`, `docs/STOREFRONT_AUDIT.md`, abu PDF source HTML, OG SVG.
- **Unified eyebrow naming** — visi PDF cover + interior + OG eyebrow naudoja `PROMPT ANATOMY · CEO AI SYSTEM` (anksčiau buvo 3 nesuderinti: `HUB MODULE: OPERATIONS`, `OPERATIONS HUB`, `OPERATIONS MODULE`). Strategic cover'yje buvo klaida `Operations Hub` — pataisyta.
- **Strategic interior copy** — „Hub module: Operations" callout perdarytas į „AI Operations Center at promptanatomy.ceo". Pašalintas `pdf-exec-summary` class dubliavimas (section + inner div).
- **Operating interior copy** — visos „Strategic Playbook" / „Executive Strategic AI Playbook" nuorodos sulygiuotos su nauju `CEO AI Strategy Playbook` naming.
- **Polished launch (Phases 4–14)** — Premium PDF rewrite: Operating 12p (workflow map, CEO/COO copy), Strategic 28p (executive summary, maturity, ROI scorecard, 30-day plan; Hub ecosystem cut; playbook positioning). Storefront Phase 8: `buyerPromise` hydration, Strategic Playbook naming, mobile PDF card styles. `docs/LAUNCH_CHECKLIST.md` for Phases 15–17.
- **EN-US produkto kryptis** — root `index.html` ir `/en/` sulygiuoti su USA/EN-US pozicionavimu; viešas LT/EN kalbos perjungiklis pašalintas. `/lt/` paliktas kaip `noindex` legacy/regression kelias.
- **SOT** — `config/sot.json` papildytas EN-US brand, copy, SEO, rules ir legal metaduomenimis pagal sister repo gold praktikas, išlaikant CEO/COO produkto identitetą.
- **Commerce copy** — PDF delivery promise suformuluotas konservatyviau; publish gate su `allowPlaceholderCheckout: false` išlieka prieš launch.

## [1.1.0] - 2026-05-18

CEO premium PDF guides ir Stripe fulfillment stack (EN-US, `promptanatomy.ceo`). Fazė 1: turinys ir export; Fazė 2: storefront, API, legal. Live checkout reikalauja rankinio Stripe/Vercel env (žr. [memo_pdf.md](memo_pdf.md)).

### Pridėta

**Fazė 1 — PDF turinys ir export**

- **`docs/pdf-source/`** — `operating-cadence.html` (12 psl., Daily/Weekly), `strategic-os.html` (24 psl., Strategic/Board), bendras `pdf-print.css` (Letter, CEO violet `#4A148C` / gold `#FFB300`).
- **`scripts/export-pdfs.js`** — Playwright HTML→PDF; page-count gate (12 / 24); išvestis `api/_private/pdfs/CEO_Operations_Playbook.pdf`, `CEO_Strategic_AI_OS.pdf`.
- **`scripts/render-pdf-preview-pages.js`** — watermarked peržiūros PNG (p2–p4) → `assets/pdf-covers/`.
- **`scripts/upload-pdfs-to-blob.js`** — Blob upload; env `PDF_OPERATING_*`, `PDF_STRATEGIC_*`.
- **`config/sot.json`** — `pdfGuides` TOC, `commerce` (kainos, Stripe placeholder links, compare strip, testimonials), `buyerFaq`, `legal.address`.
- **`.gitignore`** — `api/_private/pdfs/*.pdf`, preview debug PNG.

**Fazė 2 — Commerce ir fulfillment**

- **Storefront** — `#pdf-guides` `index.html`: dvi kortelės ($9.99 Operations Playbook, $19.99 Strategic AI OS), compare strip, TOC accordion, 3-page preview dialog, buyer FAQ, trust row; **`commerce.js`** (SOT hydration, Stripe CTA, preview).
- **`style.css`** — `.pdf-guides-*`, success/legal puslapiai.
- **API** — `api/_lib/fulfillment.js` (`operating` / `strategic`, amount fallback 999 / 1999 ct), `api/stripe-webhook.js`, `api/download.js`, `api/download-link.js`, `api/fulfillment-health.js`.
- **`scripts/check-fulfillment-env.js`** — `npm run check:fulfillment`.
- **Legal / post-purchase** — `success.html` (poll download-link), `terms.html` (`#paid-pdf-license`, Executive license), `privacy.html` (EN-US processors).
- **Dokumentacija** — [memo_pdf.md](memo_pdf.md) CEO product ids ir env; [README.md](README.md) „Paid PDF guides“.

**Testai ir kokybė**

- **`tests/structure.test.js`** — +15 PDF/commerce patikrinimų (kainos, viršeliai, API failai, publish gate kai `allowPlaceholderCheckout: false`).
- **`lint:html`** — `index.html`, `success.html`, `terms.html`, `privacy.html`.
- **`test:a11y`** — papildomai `success.html`, `terms.html`.
- **`.eslintrc.json`** — `api/**/*.js` Node env.

### Pakeista

- **`vercel.json`** — security headers (nosniff, DENY frame, HSTS, referrer); `/api/*` `Cache-Control: private, no-store`; pašalintas `@vercel/static-build` konfliktas su serverless `api/`.
- **`package.json`** v1.1.0 — scripts `pdf:export`, `pdf:upload-blob`, `pdf:preview-images`, `check:fulfillment`; deps `stripe`, `@upstash/redis`, `resend`; devDep `@vercel/blob`.
- **`scripts/build-locale-pages.js`** — locale keliai: `commerce.js`, `terms.html`, `privacy.html`.
- **Footer** — nuorodos `privacy.html` · `terms.html` (LT `privatumas.html` lieka).
- **`.env.example`** — pilnas fulfillment env sąrašas CEO produktams.

### Deploy (rankinis, ne release blocker)

- Stripe Payment Links su `metadata.product` = `operating` | `strategic`; success URL `https://www.promptanatomy.ceo/success.html?session_id={CHECKOUT_SESSION_ID}`.
- Vercel Production env + `npm run pdf:upload-blob` → `PDF_*_SOURCE_URL`.
- Prieš launch: `config/sot.json` → `allowPlaceholderCheckout: false` ir tikros `buy.stripe.com` nuorodos.

## [1.0.0] - 2026-05

### Pridėta

- **Kalbų politika (SOT)** – dokumentuota EN-only vystymo ir USA lokalizacijos kryptis: [AGENTS.md](AGENTS.md#kalbos-ir-lokalizacija-sot), [README.md](README.md#kalbos-ir-lokalizacija-sot). `/lt/` paliekamas nuorodai ir testams, be LT copy vystymo.
- **Premium OG social card sistema** – `assets/og/og-cover.svg` (1200×630), `og-cover.png`, [assets/og/README.md](assets/og/README.md).
- **Open Graph + Twitter meta** – pilnas blokas `index.html` (`og:url`, `og:image` 1200×630, `twitter:image`, locale alternate).
- **Locale-aware OG** – `scripts/build-locale-pages.js` 5b: `og:url`, LT `og:locale` / social title.
- **Vercel deploy** – `vercel.json`, `.vercelignore`, cache headers (`/assets/og/*`, CSS/JS).
- **EN statinis turinys (build)** – `en/index.html` body EN; Phase 2 path locale `/lt/`, `/en/`.
- **SEO/GEO blokas** – „What it is / Who it's for…“ tarp Hero ir įrankio.
- **Schema** – JSON-LD `WebApplication` + `FAQPage`, `Organization`.
- **robots.txt** – `Allow: /`.
- **Kalbos auditas EN: DI→AI** – „AI Operations Center“, USD placeholderiai.
- **Brand alignment** – Hub badge, AI OS footer, 6-block hint, Hub mini-map, hero steps, gold active tab.
- **Vercel Web Analytics** – `/_vercel/insights/script.js`.
- **Legal** – `privatumas.html` ant `style.css` + `body.legal-page`.
- **`npm run trace:og`** – `scripts/trace-og.js`.

### Pakeista

- **Bendruomenės CTA: WhatsApp → Telegram** – `https://t.me/prompt_anatomy`; `generator.js` runtime href.
- **generator.js** – Hub/AI OS brand tekstai, footer FAQ (data storage, Fast/Deep/Board).
- **Canonical/hreflang** – `SITE_URL` default `https://www.promptanatomy.ceo`.
- **Border token** – `var(--border)` formose.

### Pataisyta

- **X (Twitter) OG** – root `og:url`, `og-cover.png?v=3` cache-bust (post premium redesign).
- **LT locale build** – gylio `</button>` regresija (`<//button>`); struktūriniai testai.
- **CSS tokenai** – `--radius-md`, shadow set suvienodinimas.
- **ESLint** – `scripts/build-locale-pages.js` node env.
