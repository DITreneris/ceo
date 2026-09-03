# TODO

**Source of truth:** Build only for **EN-US / USA**. Audience: founders, CEOs, COOs, executive teams, AI consultants, and business operators. `/lt/` stays as a direct legacy/regression path only. Do not add EU compliance scope.

**Product goal:** Transform this repo from a useful AI prompt/tool project into a CEO/COO-grade premium SaaS-style PDF product system: clear, practical, trustworthy, polished, repeatable, and commercially ready.

**Current audit verdict (2026-09-03):** Phase 15 green. Maturity interiors exported 21/43 and uploaded to private Blob (same paths). Storefront previews (p2–p4) ready to deploy. Webhook must stay `https://www.promptanatomy.ceo/api/stripe-webhook/`. `allowPlaceholderCheckout: false`. Strategy ($19.99) test buy optional.

## Now → Next → Later

**Now (P0, must close before paid promotion):**

1. ~~Phase 15 — Restore Upstash Redis~~ — **Done 2026-09-02:** local `PONG`; Production health `{ "ok": true }`.
2. ~~Phase 15 — One live Operations test purchase~~ — **Done 2026-09-02** (webhook slash fix + fulfill). Refresh success page or email link.
3. ~~Phase 15 — Flip `allowPlaceholderCheckout: false`~~ — **Done 2026-09-02.**
4. Phase 17 — Manual buyer-journey QA on desktop + mobile (320 / 375 / 768 px).

**Next (P1, after launch unblockers):**

- ~~PDF content maturity (in-place)~~ — **Done 2026-09-03:** Operations + Strategy rewritten to When/Do/See/Done. Still 21/43 pages. Commerce untouched. Blob overwritten on existing `paid-pdfs/` paths.
- Phase 17 — Production deploy of storefront p2–p4 previews + docs (HTML already exported).
- Phase 18 — Post-launch buyer feedback loop (sales, refunds, support emails).
- ~~Design system consolidation~~ — **Done:** DS 1.1 Hardened ([`docs/ds_improvement_plan.md`](docs/ds_improvement_plan.md) §16). Optional later: 1.4b mobile DOM per [`docs/DS_MOBILE_DOM_SPIKE.md`](docs/DS_MOBILE_DOM_SPIKE.md).
- ~~Max ROI activation (Weekly default, sample data, empty-until-input, Copy&open AI)~~ — **Done** (storefront; does not replace Phase 15–17).
- Remaining engagement Should: post-copy Operations-first upsell; mobile View brief chip (no DOM reorder); funnel events (copy/sample/Stripe).

**Later (P2, optional follow-ups, not launch-blocking):**

- WebP siblings: `npm i -D sharp && npm run optimize:covers` → add `<picture>` `<source>` tags in `index.html` PDF cards.
- Programmatic OG generation (satori) — current SVG pipeline pakanka MVP.
- CSP enforcement (currently Report-Only).
- Real named testimonials prieš stronger paid promotion.

## Latest delta — PDF Assets Premium Reset (2026-05-21)

| Wave | Status | Summary |
|------|--------|---------|
| 1 — Critical bug fix | done | `render-pdf-preview-pages.js` `display: ''` (was `'flex'`); `.cover .cover-positioning strong` gold contrast; `body.pdf-asset-export` hides cover-meta + page-number on cover. |
| 2 — Cover rewrite | done | Operations + Strategy cover'iai pertvarkyti: unified eyebrow `PROMPT ANATOMY · CEO AI SYSTEM`, sharper subtitles, 2-line callouts, no metadata. About metadata į p2 `dl.kv`. |
| 3 — Interior cleanup | done | Strategic eyebrow klaida `Operations Hub` → `CEO AI System`; „Hub module: Operations" callout perdarytas; 28-page footer numeracija nuosekli `Page X/28`; `pdf-exec-summary` dubliavimas pašalintas. |
| 4 — SOT rename | done | `CEO Executive Strategic AI Playbook` → `CEO AI Strategy Playbook` per `config/sot.json`, `index.html`, `en/`, `lt/`, `commerce.js`, tests, README, audit. |
| 5 — OG redesign | done | `assets/og/og-cover.svg` violet brand match, dual-product cards, trust chips, `?v=3` cache-bust. |
| 6 — QA | done | `npm run pdf:assets` (21/21 + 43/43), 8 PNG + OG verify, `npm test` 103/103, `npm run build`. |
| 7 — Gold patterns | done | `docs/STYLEGUIDE.md`, `gold_legacy_standard.md`, `scripts/optimize-pdf-covers.js`, `npm run optimize:covers` (sharp-optional). |
| 8 — OG thumbnail refit | done | Removed eyebrow, subhead, trust pills, card kickers `PLAYBOOK 01/02`, page badges, and tagline. Single-word card titles `Operations` / `Strategy` at 52 px. Asymmetric gold accent — Operations highlighted, Strategy neutral. Footer wordmark 28 px + right-aligned price `$9.99 + $19.99`. Stale `og:image:alt` fixed across all `index.html`. Cache-bust `?v=3` → `?v=4`. `npm test` 103/103. Post-deploy validators (LinkedIn Inspector, FB Debugger, opengraph.xyz) require manual re-scrape after Vercel publish. |

## Phase 1 — Product Direction

- [x] Define the main paid PDF promise for US CEOs and COOs.
- [x] Decide whether the Strategic PDF should be upgraded into a true AI Operating System or renamed as a strategic prompt playbook.
- [x] Narrow the product around practical AI workflows, operating cadence, governance-lite ownership, ROI logic, and decision support.
- [x] Remove or postpone topics that do not support the US CEO/COO buyer.
- [x] Align product names, prices, and page promises with actual PDF value.
- [x] Keep the first launch focused on executive usefulness, not broad AI transformation.

**Locked in:** `config/sot.json` → `productDecision`, `pdfGuides.*.buyerPromise`, `commerce.compareStrip.strategicLabel`.

## Phase 2 — CEO/COO Problem Coverage

- [x] Map the PDFs to high-value buyer problems: unclear ROI, random prompting, tool overload, weak ownership, low-quality outputs, fragmented knowledge, poor decision support, and lack of repeatable workflows.
- [x] Confirm each paid PDF solves a specific executive problem.
- [x] Remove sections that do not map to a buyer pain.
- [x] Add missing blocks where the buyer expects structure: maturity model, workflow map, decision model, ROI scorecard, action plan.
- [x] Keep the scope USA-focused and business-operator focused.

**Locked in:** `buyerProblems`, `pdfGuides.*.solvesProblems`, chapter `painIds` / `action` / `notes` (implementation in Phases 4–5).

## Phase 3 — Flagship PDF Blueprint

- [x] Create the ideal structure for the flagship PDF: cover, promise, executive summary, diagnosis, maturity model, workflow map, ownership model, implementation roadmap, ROI logic, templates, checklists, risks, and 30-day action plan.
- [x] Decide which parts belong in the current Strategic PDF.
- [x] Decide which parts should become future standalone PDFs.
- [x] Ensure the flagship PDF feels like a paid executive playbook, not a prompt export.

**Locked in:** `productBlueprint.flagship`, `productBlueprint.operating`, `productBlueprint.deferredModules`.

---

**Polished launch (repo):** Phases 4–14 done in codebase; Phases 15–17 gate in [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md) (manual Stripe/Vercel).

## Phase 4 — Content Rewriting Iteration 1

- [x] Rewrite PDF copy in clear US English.
- [x] Use CEO/COO language: priorities, ownership, risk, cash, execution, board readiness.
- [x] Remove generic AI advice.
- [x] Strengthen executive summaries, checklists, worksheets, and decision frameworks.
- [x] Add stronger practical examples for US operators.
- [x] Replace vague claims with specific outcomes and constraints.
- [x] Keep content practical, direct, and implementation-focused.

## Phase 5 — PDF Structure Iteration 1

- [x] Review current PDF page flow.
- [x] Improve section order for executive readability.
- [x] Add missing premium blocks: executive summary, workflow map, maturity model, decision model, action plan.
- [x] Add a board-ready one-page template.
- [x] Add a simple risk matrix or decision-risk table.
- [x] Add a practical ROI / value tracking page.
- [x] Reduce pages that feel like simple prompt lists.
- [x] Make each PDF feel like a paid product, not a blog export.

## Phase 6 — PDF Product Modules

- [x] Keep and improve the CEO AI Operations Playbook.
- [x] Upgrade or reposition the CEO Strategic AI Operating System.
- [x] Plan future modules only after the first two PDFs are stable.
- [x] Candidate future modules: AI ROI Scorecard, AI Governance Lite for Leadership Teams, Board AI Briefing Kit, Executive AI Stack Standard.
- [x] Avoid building too many products before the core system is premium.

## Phase 7 — Design System Iteration 1

- [x] Review typography, spacing, colors, cards, tables, callouts, and page rhythm.
- [x] Standardize reusable PDF components.
- [x] Improve visual hierarchy for quick executive scanning.
- [x] Keep the brand premium, clean, and restrained.
- [x] Avoid decorative design that does not improve clarity.
- [x] Make tables, checklists, worksheets, and diagrams feel consistent across PDFs.

## Phase 8 — UI / UX Iteration 1

- [x] Review homepage PDF storefront.
- [x] Improve US English product copy, CTA clarity, preview flow, FAQ, and trust signals.
- [x] Check CEO/COO buyer journey from landing page to purchase.
- [x] Improve mobile readability and spacing.
- [x] Keep one clear primary action per product.
- [x] Make preview pages match the final premium promise.
- [x] Align storefront claims with actual PDF contents.

## Phase 9 — PDF Generation Iteration 1

- [x] Run PDF export.
- [x] Check page count, page breaks, overflow, typography, and visual consistency.
- [x] Fix layout issues.
- [x] Re-export PDFs.
- [x] Repeat until PDFs are stable.

## Phase 10 — PNG / Preview Generation Iteration 1

- [x] Generate PDF cover and preview PNG assets.
- [x] Check image sharpness, cropping, file size, and storefront fit.
- [x] Regenerate assets after PDF layout changes.
- [x] Verify OG/social preview assets before production.

## Phase 11 — Quality Assurance Iteration 1

- [x] Run structure tests.
- [x] Run HTML and JS lint checks.
- [x] Run smoke tests.
- [x] Run e2e checks for core user flows.
- [x] Run accessibility checks.
- [x] Manually inspect exported PDFs.
- [x] Manually inspect generated PNG previews.
- [x] Fix critical issues before launch.

## Phase 12 — Content Rewriting Iteration 2

- [x] Re-read PDFs as a US CEO/COO buyer.
- [x] Remove weak claims, vague language, and filler.
- [x] Improve examples, templates, and implementation steps.
- [x] Check whether the PDFs answer: “What do I do Monday morning?”
- [x] Check whether the PDFs answer: “Who owns this inside the company?”
- [x] Check whether the PDFs answer: “How do I know this is working?”
- [x] Confirm every section supports buyer trust and paid value.

## Phase 13 — UI / UX Iteration 2

- [x] Re-test the full storefront experience.
- [x] Improve CTA wording, pricing presentation, refund copy, and delivery explanation.
- [x] Check desktop and mobile layouts.
- [x] Confirm previews match the final PDF quality.
- [x] Remove or soften unsupported claims.
- [x] Make pricing feel aligned with PDF depth.

## Phase 14 — Design System Iteration 2

- [x] Tighten spacing and hierarchy after real content is final.
- [x] Standardize final PDF page components.
- [x] Remove inconsistent styling.
- [x] Confirm all pages feel like one premium product family.
- [x] Confirm PDF, PNG previews, and storefront share one visual language.

## Phase 15 — Commerce and Fulfillment Readiness

- [x] Replace placeholder checkout links.
- [x] Confirm fulfillment configuration.
- [x] Confirm Stripe product names, prices, and metadata.
- [x] Confirm download email, success page, refund copy, and license copy.
- [ ] Confirm private PDF storage and signed download flow.
- [x] Run fulfillment health checks.
- [x] Run one full test purchase flow before launch.

**Gate:** [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)

## Phase 16 — Final Export and Asset Freeze

- [x] Export final PDFs.
- [x] Generate final PNG preview assets.
- [x] Generate final cover assets.
- [x] Verify page counts.
- [x] Verify preview pages.
- [x] Freeze final PDF names, versions, prices, and product claims.

## Phase 17 — Final QA and Release

- [x] Run full QA.
- [x] Run full smoke and e2e checks.
- [x] Run accessibility checks.
- [ ] Review the full buyer journey on desktop and mobile (320 / 375 / 768 px).
- [x] Prepare production deploy.
- [ ] Deploy only after content, PDFs, PNGs, payment, fulfillment, and QA all pass.

**P0 dependency:** All Phase 15 items must be green first (live Stripe URLs + env + test purchase).

## Phase 17b — Canonical Contact Consistency

- [ ] **Canonical business contact — verify all match:**
  - Prompt Anatomy · 1311 Park St · Unit #654 · Alameda, CA 94501 · info@promptanatomy.app
  - Sources: `config/sot.json#legal.address` (SOT), `index.html #footerAddress`, `en/index.html #footerAddress`, `docs/pdf-source/operating-cadence.html` p.20 contact block, `docs/pdf-source/strategic-os.html` p.43 contact block.
  - Verify all match after `npm run pdf:export`.
- [ ] **PDF version labels:** operating-cadence.html "Length" = 21 pages · Version 2.1; strategic-os.html = 43 pages · Version 2.1.
- [ ] **Quick picks QA:** CEO quick picks (p.21 ops) and Strategic shortcuts (p.42 strategy) render correctly in exported PDFs — no overflow, icons visible, copy-paste works.

## Phase 18 — Post-Launch Iteration

- [ ] Review sales, refunds, support emails, and buyer questions.
- [ ] Identify which PDF pages create confusion or strongest value.
- [ ] Improve copy, templates, and previews based on real buyer feedback.
- [ ] Plan the next PDF module only after the first launch proves demand.
