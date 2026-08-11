# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

EN-US storefront journey + **Design System 1.1 Hardened** ([`docs/ds_improvement_plan.md`](docs/ds_improvement_plan.md) §16). Does not block Phase 15–17 launch ([`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md)).

### Added

- **A→B→C launch/GEO pack (2026-08-11)** — Phase A audit: live-format Stripe Payment Links + blob ok; **Upstash Redis DNS `ENOTFOUND`** blocks `allowPlaceholderCheckout: false` and live purchases (see [`LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md)). Phase B: US outcome-language lift in SOT/storefront (hero lead, SEO description, PDF lead, footer, buyer FAQ Qs) without H1/IA change. Phase C: 8 US outcome citation queries in [`GEO_CITATION_PROMPTS.md`](docs/GEO_CITATION_PROMPTS.md); `llms-full.txt` **Problems we solve** from `buyerProblems` via [`scripts/build-geo-assets.js`](scripts/build-geo-assets.js).
- **GEO visibility hardening (2026-08)** — expand AI crawler allowlist (`Claude-SearchBot`, `Claude-User`, `Perplexity-User`, `Applebot-Extended`, `CCBot`, `meta-externalagent`); drop `success.html` from sitemap; rewrite `llms.txt` (flat markdown + `## Optional`); add `llms-full.txt`; `vercel.json` `text/plain` headers for discovery files; EN Product JSON-LD cover images + buyer `FAQPage`; SSR `buyerFaq` HTML on `/en/` with idempotent `commerce.js`; docs [`GEO_STACK.md`](docs/GEO_STACK.md), [`GEO_CITATION_PROMPTS.md`](docs/GEO_CITATION_PROMPTS.md). No root frontpage template edits.
- **Max ROI activation** — default mode **WEEKLY**; hero CTA *Build weekly brief*; ops title *Build your weekly brief*; **Try sample data** fills Weekly form; empty output until first input; Copy CTA/AI tools disabled until input; **Copy & open** ChatGPT/Claude/Gemini (copy → toast → open); SOT `opsCenter.sampleCta` + `opsOutput.emptyCopyToast`; structure tests **151/151**; visual baselines for ops center refreshed.

### Changed

- **EN copy audit remediation** — US English grammar/idiom/naming pass: fulfillment strategic display name → `CEO AI Strategy Playbook` (binary filenames unchanged); Strategy First-7 page map corrected (`20–21` / `26` / `5, 27`); refund idiom → `no-questions-asked`; Product FAQ → `Want the full Prompt Anatomy training?` (LT replace keys synced; `/en/` FAQPage JSON-LD preserved by tightening Organization schema replace); community title → `Running operations with AI?`; generator live + dormant EN prompts/rules/library; PDF body polish + `npm run pdf:assets` (21/43); visual baselines refreshed for copy wrap.
- **QW1b entity footer** — footer affiliation line matches hub sibling memo §3: `Part of Prompt Anatomy · Training & checkout → promptanatomy.app` with UTM `utm_source=ceo&utm_medium=entity_footer&utm_campaign=ecosystem`; LT regression string synced; hub map / hero CTAs unchanged.
- **IA slim v4 (PDF + FAQ + ops panel)** — PDF section deduped (removed compare strip, which-playbook line, per-card trust, delivery blurb, testimonials, publisher strip, card buyer-promise); single section trust row; `buyerFaq` 5→3; footer Product FAQ 6→3 (JSON-LD synced); `.ops-control-panel` card with mode tab icons; journey step 4 **Reuse templates**; structure tests **148/148**.

### Added

- **Hero lineage badges (teacher parity)** — `.header-badges` above H1: **Prompt Anatomy** → [promptanatomy.app](https://www.promptanatomy.app/), **Hub module: Operations** spin-off (gold border); SOT `copy.hero.badgeParent` / `badgeSpinoff`; hydrated in `commerce.js` `initHeroCopy`; mobile (≤768px) hides spin-off per sister [teacher](https://github.com/DITreneris/teacher) pattern; structure test *Hero Prompt Anatomy lineage badges*.
- **CEO frontpage premium (Phase A+B)** — Playbooks nav contrast fix (removed from `.btn--ghost` inherit); ops `step-badge` removed; journey `::before` zero hack removed; EN `<title>` no longer overwritten by `generator.js`; SOT repositioning prompt → **operating brief**; H1 *Turn scattered KPIs into a clear weekly CEO brief*; hero promise line + `trust.heroStrip`; rich preview card (action/owner rows); `copy.journeySteps` executive labels; `CEO Weekly Operating Brief` ops title.
- **GEO stack (no frontpage template edits)** — `config/sot.json` → `geo` (crawlers, llms, entity: Tomas Staniulis founder + [LinkedIn](https://www.linkedin.com/in/staniulis/) + [X](https://x.com/TStaniulis_NFT), hub [promptanatomy.app](https://www.promptanatomy.app/)); [`scripts/build-geo-assets.js`](scripts/build-geo-assets.js) → `robots.txt`, `sitemap.xml`, `llms.txt`; EN-only JSON-LD injection in [`scripts/build-locale-pages.js`](scripts/build-locale-pages.js) (`Person`, `WebSite`, `Product`×2, `HowTo`); `/` → `/en/` redirect in [`vercel.json`](vercel.json); [`docs/GEO_STACK.md`](docs/GEO_STACK.md).
- **Hero refactor** — [`docs/hero_refactor.md`](docs/hero_refactor.md): two-column hero with dark glass weekly-priorities preview; 4-step scroll spy; ops duplicate stepper removed; sticky copy gated on form input.
- **DS 1.1 — visual regression** — [`tests/e2e/visual-storefront.spec.js`](tests/e2e/visual-storefront.spec.js), baselines in `tests/e2e/__screenshots__/`, `npm run test:visual` / `test:visual:update`, included in `npm run test:mixed`.
- **DS 1.1 — tokens** — extended `--shadow-*` and `--text-*` set in [`styles/tokens.css`](styles/tokens.css); CI guards for shadow/type usage, border-box, and ops grid `min-width: 0` (structure tests **~144/144**).
- **DS 1.1 — mobile DOM spike** — [`docs/DS_MOBILE_DOM_SPIKE.md`](docs/DS_MOBILE_DOM_SPIKE.md) (1.4b gated; no DOM reorder shipped).
- **DS 1.0 — design system** — [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md), [`docs/COMPONENT-RULES.md`](docs/COMPONENT-RULES.md); partitioned CSS (`styles/tokens.css`, `base.css`, `components.css`, `sections.css`, `responsive.css`); `style.css` imports only.
- **DS 1.0 — components** — `.btn`, `.card`, `.chip`, `.trust-row`; price `.price__now` / `.price__was`; SOT hydration (`initTrustRow`, `initPdfCardBullets`, `initOpsUpsell`, `initPdfStorefrontCopy`, `initHeroCopy`, `initNavCopy`).
- **Storefront UX** — sticky Playbooks nav; hero benefit-first layout; PDF eyebrow/kickers/publisher strip; section order Ops → PDF guides → Library → Rules.
- **Documentation SOT** — [`docs/CURRENT_TRUTH.md`](docs/CURRENT_TRUTH.md), [`docs/DOCUMENTATION_STATUS.md`](docs/DOCUMENTATION_STATUS.md), [`docs/PAID_FLOW_TEST_BACKLOG.md`](docs/PAID_FLOW_TEST_BACKLOG.md).
- **`REDIS_KEY_PREFIX`** — optional Upstash namespace (`ceo:`) in [`api/_lib/fulfillment.js`](api/_lib/fulfillment.js); [`.env.example`](.env.example), [`memo_pdf.md`](memo_pdf.md).
- **Premium PDF + OG assets** — 5-element cover anatomy; [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md); [`scripts/optimize-pdf-covers.js`](scripts/optimize-pdf-covers.js) (`npm run optimize:covers`, optional `sharp`).
- **A11y** — `privacy.html` in `npm run test:a11y`.

### Changed

- **Gold legacy standard** — [`gold_legacy_standard.md`](gold_legacy_standard.md) v1.2.0: IA v3 homepage flow, ops DOM contracts, UI regression table (form overflow, nav alignment, depth tip); drift checklist updated.
- **IA v3 integrate** — use cases inline in hero (`hero.useCasesLabel` + text-only `heroStrip`); removed `.use-cases-strip`; ops title *Build your weekly brief*; removed ops value/intro paragraphs; compact journey stepper (`.ops-journey-steps--compact`); shortened hero lead; net copy reduction on first screen.
- **Nav Playbooks CTA** — sticky link → `.btn.btn--nav-secondary` (solid white on dark nav); copy *CEO playbooks* + commerce aria-label from SOT `copy.nav`; hydrated via `initNavCopy`.
- **Depth tip** — moved out of `.depth-bar` to `#depthTip.field-help` below bar (no gold chip frame); copy *Not sure? Start with Fast.*; `aria-describedby="depthTip"` unchanged.
- **Ops form layout** — global `box-sizing: border-box` in [`styles/base.css`](styles/base.css); `min-width: 0` on `.ops-layout` columns and `.ops-form-grid` cells; `max-width: 100%` on field inputs.
- **Hero slim v2** — eyebrow (`copy.hero.eyebrow`) replaces promise paragraph; preview card summary list (`detail` only, no Owner/Action); shortened `ctaMeta` and lead; primary CTA *Build weekly brief*; visual baseline `hero-above-fold.png` updated.
- **Ops workspace clarity** — [`docs/ops_workspace_plan.md`](docs/ops_workspace_plan.md): `.ops-form-grid` `align-items: start`; runway help spans full row (`.field-help--row`); SOT-driven output placeholder + toast (`copy.opsOutput.{emptyPlaceholder,copiedToast}`); `#sessionsPanel` moved out of the right sidebar to a sibling under `.ops-layout` (full-width tile grid); themed scrollbar + brighter ops tool ghost buttons; visual baselines `ops-center-desktop.png` / `ops-center-mobile.png`.
- **Hero de-clutter (journey-aligned)** — removed hero badges, product line, and 4-step row (badges restored later — see *Hero lineage badges*); relocated `.ops-journey-steps` to `#operationsCenter`; soft secondary CTA without playbook prices; preview card trimmed to P1–P3 + “+1 priority”.
- **Hero refactor** — hero stepper moved to ops center with scroll spy (`copy.js`); `#opsOutputSection` anchor; hero limited to 2 CTAs (playbooks secondary).
- **DS 1.1** — all partitioned `box-shadow` / `font-size` use CSS variables; LCP inline `:root` in `index.html` mirrors tokens; storefront CTAs use `.btn` + modifiers (legacy aliases kept); structure tests **~144/144** (incl. overflow guards).
- **DS 0.8** — monolithic CSS split; hex → tokens on hot paths; spacing on `--space-*` grid.
- **DS 0.6** — hero density (work steps → ops center); unified primary CTA via `--shadow-cta`.
- **Hero / SEO copy (variant B)** — H1 *Turn KPIs into weekly priorities*; playbooks pricing in meta/secondary CTA; `seo` synced in `config/sot.json`.
- **PDF storefront** — trust row on cards; compare strip; ops upsell → `#pdf-guides`.
- **Storefront theme** — light-only (no dark-mode toggle); legacy `di_ops_center_theme` cleared in [`generator.js`](generator.js).
- **EN-US direction** — root + `/en/` canonical; `/lt/` `noindex` regression only; public LT/EN switcher removed.
- **Live Stripe links** — `commerce.stripePaymentLinks` + static CTA `href`s → `buy.stripe.com/...` (publish gate still `allowPlaceholderCheckout: true` until live test purchases).
- **Repo governance** — [`AGENTS.md`](AGENTS.md), [`README.md`](README.md), [`docs/INDEX.md`](docs/INDEX.md), launch docs aligned to v2.1 / Vercel canonical deploy.
- **OG / naming** — thumbnail-first `og-cover.svg` (`?v=4`); unified `PROMPT ANATOMY · CEO AI SYSTEM` eyebrow; **CEO AI Strategy Playbook** rename.

### Removed

- **Hero promise line** — `copy.hero.promise` / `.hero-promise` (positioning moved to eyebrow).
- **Hero use-cases strip card** — `.use-cases-strip` removed (IA v3); use cases live inline in hero via `.hero-use-cases`.
- **Ops value/intro paragraphs** — `copy.opsCenter.value`, `copy.opsCenter.intro`, `data-copy-ops-intro` removed from storefront (IA v3).
- **Depth tip chip inside depth bar** — `.chip.chip--tip` full-width row inside `.depth-bar` (replaced by `#depthTip.field-help` below).
- **Hero tertiary CTA** — `Browse templates` link and `copy.hero.tertiaryCta` / `tertiaryHref` (library via step 4 only).
- **Ops duplicate stepper** — `.ops-work-steps` removed from operations center.

### Fixed

- **CI structure test** — mobile hero badge `font-size: 10px` → `var(--text-2xs)` in [`styles/responsive.css`](styles/responsive.css) (DS px guard **148/148**).
- **Ops form field overflow** — input/textarea borders no longer clip past `.ops-form-section` card edge (`width: 100%` + content-box + grid `min-width: auto` regression).
- **Nav Playbooks alignment** — `#stickyCopyBtn.is-hidden` uses `display: none` instead of `visibility: hidden` so hidden copy button does not reserve flex space beside Playbooks CTA.
- **Playbooks nav contrast** — `.top-nav-playbooks-link` no longer inherits body text color on dark sticky nav (DS 0.8 `.btn--ghost` regression).
- **Journey stepper numbering** — removed duplicate ops `step-badge` and `.ops-journey-step-num::before` leading zero.
- **EN document title** — `generator.js` skips title/hero copy overrides on EN; SOT `seo.title` preserved.
- **DS 1.0.1 — contrast** — `npm run test:a11y` clean (ops upsell gold on dark panel; PDF kickers `--primary-dark` on light cards).
- **DS 1.0.1 — hex CI** — partitioned CSS hex-free; literals only in `tokens.css`.
- Undefined CSS variables `--primary-dark`, `--shadow-cta`, `--space-10`.
- E2E meta description assertion vs `config/sot.json` → `seo.description`.
- **CI `lint:html`** — W3C 403 fallback via [`scripts/lint-html.js`](scripts/lint-html.js).
- **Vercel build** — `"framework": null` in `vercel.json` (static site + `api/`, not Next.js).
- **PDF preview PNG** — interior pages no longer forced `display: flex` in [`scripts/render-pdf-preview-pages.js`](scripts/render-pdf-preview-pages.js).
- **Cover contrast** — gold `strong` on violet covers; Strategy footer page numbering.

### Ops (verified 2026-05-21)

- Vercel Production env + `GET /api/fulfillment-health/` → `ok`.
- Blob PDFs uploaded; Resend/Stripe/Upstash configured per [`memo_pdf.md`](memo_pdf.md).

### Remaining before paid promotion

- `commerce.allowPlaceholderCheckout: false` after one live test purchase per product.
- Manual buyer-journey QA (320 / 375 / 768 px) per [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md).

## [2.1.0] - 2026-05-21

### Added

- **CEO quick picks page** (Operations p.21) — 5 inline SVG micro-prompts (Monday morning, Cash red flag, Priority cap, Friday reflection, Escalate to Strategy) with `.prompt-tip` / `.prompt-tip-grid` layout. Light `#FFF8E6` background, gold border, 2-min copy-paste format.
- **Strategic shortcuts page** (Strategy p.42) — 6 inline SVG micro-prompts derived from `LIBRARY_PROMPTS` (Runway snapshot, LTV/CAC check, Top 3 risks, Growth lever pick, CEO reflection, Price test). Same `.prompt-tip` visual system.
- **Growth levers execution page** (Strategy p.19, split from old p.18) — prompt-only page after the scoring matrix.
- **Risk matrix worksheet page** (Strategy p.24, split from old p.22) — filled sample table with early-warning callout.
- **PDF contact blocks** — full `Prompt Anatomy · 1311 Park St · Unit #654 · Alameda, CA 94501` address + `info@promptanatomy.app` on license pages of both PDFs (ops p.20, strategy p.43).
- **CSS additions** — `.prompt-tip`, `.prompt-tip-grid`, `.prompt-tip-header`, `.prompt-tip-icon`, `.prompt-tip-label`, `.prompt-tip-when`, `.prompt-tip-paste`, `.prompt-tip-output`, `.prompt-block--compact`, `.pdf-contact-block` in `pdf-print.css`.

### Changed

- **Layout fix — Operations** — Daily prompt page (was p.5) split into p.5 (Fast) and p.6 (Deep); Weekly prompt page (was p.8) split into p.9 (Fast) and p.10 (Deep). Eliminates footer overlap on both pages.
- **Layout fix — Strategy** — Growth levers (was p.18) split into p.18 (matrix) + p.19 (prompt); Risk management (was p.22) split into p.23 (prompt) + p.24 (worksheet).
- **Page counts** — Operations: 18 → **21**; Strategy: 40 → **43**.
- **Footer safe zone** — `pdf-print.css` `.page` padding-bottom: 18mm → **22mm** (prevents content overflow above absolute footer).
- **`config/sot.json`** — `pdfGuides.operating.pages` 18→21, `strategic.pages` 40→43, `version` 2.0→2.1, `buyerPromise` updated, new `chapters` for quick picks and strategic shortcuts; `commerce.pricing.pages` updated.
- **`scripts/export-pdfs.js`** — `expectedPages` 18→21 and 40→43.
- **`package.json`** — version `2.1.0`.
- **Preview assets** — `assets/pdf-covers/*.png` regenerated via `npm run pdf:assets`.
- **Storefront `index.html`** — lead, specs, and TOC counts updated to 21/43; quick picks and strategic shortcuts mentioned in specs.
- **`todo.md`** — Phase 17b added: canonical contact consistency checklist.
- **`docs/pdf-source/operating-cadence.html`** — "Length" 18→21, page h2 headings split (Daily Fast / Daily Deep / Weekly Fast / Weekly Deep), License and contact page upgraded with full postal address.
- **`docs/pdf-source/strategic-os.html`** — "Length" 40→43, all internal page cross-references updated, License and contact page upgraded with full postal address.

### Fixed

- Content overflow on Operations pages 5 and 8 (two large `pre` blocks per page caused footer text overlap — resolved by page split).
- Content overflow risk on Strategy pages 18 and 22 (matrix + prompt combined — resolved by split).
- Missing mailing address in both PDF license pages (was email-only; now full postal block).

---

## [2.0.0] - 2026-05-21

### Added

- **PDF Content V2** — Operations playbook expanded to **18 pages** (operating loop, First 7 days, daily sample output, weekly meeting agenda, decision log, full prompts with quality gates). Strategy playbook expanded to **40 pages** (First 7 days, board memo example, ROI/cash completed samples, delegation matrix, function prompt library, 90-day phases, decision review template). Blueprint: [`docs/pdf-content-v02.md`](docs/pdf-content-v02.md).
- **PDF print blocks** — `.example-block`, `.bad-good-compare`, `.callout-decision`, `.review-gate`, `.scorecard-filled` in [`docs/pdf-source/pdf-print.css`](docs/pdf-source/pdf-print.css).

### Changed

- **`config/sot.json`** — `pdfGuides` pages/promises/chapters, `commerce.pricing.pages`, `productDecision` v2 rationale and `promptAuditV2`.
- **PDF sources** — [`docs/pdf-source/operating-cadence.html`](docs/pdf-source/operating-cadence.html), [`docs/pdf-source/strategic-os.html`](docs/pdf-source/strategic-os.html) (Version 2.0 in metadata).
- **Storefront** — `index.html` / `en/` lead, specs, buyer promises aligned with V2 deliverables (18-page / 40-page).
- **`scripts/export-pdfs.js`** — expected page counts 18 / 40.
- **`package.json`** — version `2.0.0`.
- **Docs** — [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md), [`gold_legacy_standard.md`](gold_legacy_standard.md) page counts 18 / 40.

### How to view PDFs locally

| What | Path | Command |
|------|------|---------|
| **Exported PDFs (buyer files)** | `api/_private/pdfs/CEO_Operations_Playbook.pdf` (21p), `api/_private/pdfs/CEO_Strategic_AI_OS.pdf` (43p) | `npm run pdf:export` |
| **HTML source (browser preview)** | `docs/pdf-source/operating-cadence.html`, `docs/pdf-source/strategic-os.html` | Open file in Chrome/Edge → Print preview, or serve repo and open URL |
| **Storefront preview PNGs** | `assets/pdf-covers/operating.png`, `strategic.png`, `*-p2.png` … `*-p4.png` | `npm run pdf:preview-images` or full `npm run pdf:assets` |

Note: `api/_private/pdfs/*.pdf` is **gitignored** — PDFs exist on disk after export but are not committed. Production buyers get files via Stripe fulfillment (`/api/download`) or Blob URLs after `npm run pdf:upload-blob`.

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
