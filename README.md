# AI Operations Center

Free weekly operating-brief builder for US CEOs and COOs, plus two paid playbooks. Canonical site: [https://www.promptanatomy.ceo/en/](https://www.promptanatomy.ceo/en/).

## Quick start

- Open root `index.html` or, after `npm run build`, `/en/` (canonical) and `/lt/` (legacy).
- Local server:

```bash
npx serve . -l 3000
```

## Daily workflow

1. Choose mode and analysis depth.
2. Fill the core fields.
3. Copy the generated prompt.
4. Paste it into ChatGPT, Claude, or Gemini.

## Language (SOT)

Product work is **English only** for a **USA** audience (`en-US`, USD).

| Path | Role |
|------|------|
| `/en/`, root `index.html` | Active product. All new copy, UX, and SEO land here. |
| `/lt/` | Legacy / regression test path only. Not a public language switch. Do not expand LT copy. |

- **Template:** root `index.html` is EN-US. `npm run build` writes `en/index.html` and `lt/index.html`.
- **Public UI:** no language switcher. `/lt/` is a direct URL for tests.
- Dynamic copy lives in `generator.js` (EN-first; LT branches for compatibility).

Agent policy: [AGENTS.md](AGENTS.md#kalbos-ir-lokalizacija-sot).

## Product direction (locked)

Decisions live in [`config/sot.json`](config/sot.json):

- **Operating PDF** — daily/weekly CEO AI cadence (`pdfGuides.operating.buyerPromise`).
- **Strategic PDF** — **CEO AI Strategy Playbook** (not a software “OS”): board-ready prompts, ROI, ownership (`productDecision.strategicPositioning`: `playbook`).
- **Launch scope** — two PDFs only. Deferred modules: `productBlueprint.deferredModules`.

## Paid PDF guides

| Guide | Pages | Price |
|-------|-------|-------|
| CEO AI Operations Playbook | 21 | $9.99 |
| CEO AI Strategy Playbook | 43 | $19.99 |

Canonical facts: [docs/CURRENT_TRUTH.md](docs/CURRENT_TRUTH.md).

- Storefront: `#pdf-guides` on root `index.html`; Stripe Payment Links in `config/sot.json`.
- Export: `npm run pdf:export` → gitignored `api/_private/pdfs/` (HTML interiors are operator-local; see [docs/pdf-source/README.md](docs/pdf-source/README.md)).
- Upload: `npm run pdf:upload-blob`. Env check: `npm run check:fulfillment`.
- Fulfillment runbook: [memo_pdf.md](memo_pdf.md).

## Quality gates

```bash
npm run build          # writes lt/index.html and en/index.html
npm test               # merge gate: structure, HTML lint, ESLint
npm run test:mixed     # release gate: test + smoke + e2e + a11y
```

Merge: `npm test`. Production / UX-flow release: `npm run test:mixed` ([docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)).

## Deploy (Vercel)

**Production:** Vercel (`vercel.json`, serverless `api/*`). Host: `https://www.promptanatomy.ceo`.

- **Web Analytics:** `/_vercel/insights/script.js` on root `index.html`.
- **Canonical / hreflang:** `scripts/build-locale-pages.js` + `SITE_URL`.
- **GitHub Pages** is disabled. Do not use it as buyer-facing production.

Fulfillment: [memo_pdf.md](memo_pdf.md). Launch gate: [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

Storefront is **light only**. Tokens and components: [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).

## Documentation

Start at [docs/INDEX.md](docs/INDEX.md).
