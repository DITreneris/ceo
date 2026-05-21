# DI Operacinis Centras

Trumpas įrankis CEO/COO darbui: iš įvestų verslo duomenų suformuoja aiškią DI užklausą, kurią gali iškart kopijuoti ir analizuoti.

## Greitas startas

- Atidaryk `index.html` naršyklėje arba locale puslapius: `/lt/`, `/en/` (po `npm run build`).
- Lokaliam serveriui:

```bash
npx serve . -l 3000
```

## Kasdienis workflow

1. Pasirink režimą ir analizės gylį.
2. Užpildyk pagrindinius laukus.
3. Nukopijuok sugeneruotą promptą.
4. Įklijuok į pasirinktą DI įrankį.

## Kalbos ir lokalizacija (SOT)

**Fokusas:** vystymas **tik EN**; rinka ir copy – **USA** (US English, USD, `en-US` datos, JAV trust/FAQ tonas).

| Kelias | Paskirtis |
|--------|-----------|
| `/en/`, root `index.html` | **Aktyvus produktas** – čia daromi visi pakeitimai. |
| `/lt/` | **Legacy/regression** – tiesioginis testavimo kelias, ne viešas kalbos pasirinkimas. LT tekstų nekeisti, nebent kritinis bendras bugfix. |

Techninė architektūra (Phase 2) lieka:

- **Path-based locale:** `/lt/` ir `/en/` – statiniai puslapiai po `npm run build`.
- **Šablonas:** root `index.html` = EN-US; build generuoja `lt/index.html` ir `en/index.html` (meta, canonical, asset keliai).
- **Viešas UI:** kalbos perjungiklio nėra; `/lt/` pasiekiamas tik tiesioginiu legacy/test URL.
- Dinaminis turinys – `generator.js` (EN šakos vystomos; LT šakos – suderinamumui, ne produktui).

Pilna agentų taisyklė: [AGENTS.md](AGENTS.md#kalbos-ir-lokalizacija-sot).

## Kalbų architektūra (techninė) — Phase 2

- Locale: `pathname` → query → `localStorage` → naršyklės kalba.
- Prieš deploy: `npm run build`.

## Product direction (locked, EN-US)

Decisions live in [`config/sot.json`](config/sot.json):

- **Operating PDF** — cadence playbook: repeatable daily/weekly CEO AI rituals (`pdfGuides.operating.buyerPromise`).
- **Strategic PDF** — flagship **CEO AI Strategy Playbook** (not a software “OS”): board-ready prompts, ROI, and governance-ready ownership (`productDecision.strategicPositioning`: `playbook`).
- **Launch scope** — two PDFs only; future modules listed in `productBlueprint.deferredModules`.
- **Storefront alignment** — Phase 8; gap list: [docs/STOREFRONT_AUDIT.md](docs/STOREFRONT_AUDIT.md).

## Paid PDF guides (EN-US)

| Guide | Pages | Price |
|-------|-------|-------|
| CEO AI Operations Playbook | 21 | $9.99 |
| CEO AI Strategy Playbook | 43 | $19.99 |

Canonical facts: [docs/CURRENT_TRUTH.md](docs/CURRENT_TRUTH.md).

- Storefront: `#pdf-guides` on root `index.html`; checkout via Stripe Payment Links (`config/sot.json`).
- Regenerate all assets: `npm run pdf:assets` (PDF export → `assets/pdf-covers/` PNG → `assets/og/og-cover.png`).
- Export only: `npm run pdf:export` → `api/_private/pdfs/`; upload: `npm run pdf:upload-blob`; env check: `npm run check:fulfillment`.
- Fulfillment runbook: [memo_pdf.md](memo_pdf.md).

## Build ir kokybės vartai

```bash
npm run build          # generuoja lt/index.html, en/index.html iš root index.html
npm test               # merge gate: struktūra, HTML lint, ESLint
npm run test:mixed     # release gate: test + smoke + e2e + a11y
```

Prieš merge pakanka `npm test`. Prieš production release — `npm run test:mixed` (žr. [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)).

## Deploy (Vercel — kanoninis)

**Production kelias:** Vercel (`vercel.json`, serverless `api/*`). Domenas: `https://www.promptanatomy.ceo`.

- **Web Analytics**: `/_vercel/insights/script.js` root `index.html`.
- **Canonical/hreflang**: `scripts/build-locale-pages.js` + `SITE_URL` env.
- **GitHub Pages** (`.github/workflows/deploy.yml`): **deprecated** — statinis legacy mirror, be fulfillment API. Nenaudoti kaip buyer-facing production.

Fulfillment: [memo_pdf.md](memo_pdf.md). Launch gate: [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## Golden Standard (UI)

Šis standartas taikomas kaip bazė kiekvienam UI pakeitimui.

- Brand identitetas: violetinė paliekama tiek `light`, tiek `dark` režime.
- White mode: švarus premium vaizdas su šiltu pilku fonu ir aiškiai atskirtomis baltomis kortelėmis.
- Kontrastas: input, placeholder ir pagalbiniai tekstai turi būti lengvai skaitomi be įtampos.
- Hierarchija: aiškūs skirtumai tarp `background`, `card`, `input` (tonų skirtumas 2-5%).
- CTA dominavimas: vienas pagrindinis CTA vizualiai stipriausias (svoris, mikro animacija, subtilus glow).
- Depth sistema: naudojami 2-3 nuoseklūs elevation lygiai, be atsitiktinių shadow reikšmių.
- Sessions blokas: aiškus header, tvarkingas empty state su pozityvia žinute.
- A11y: privalomas aiškus `:focus-visible`, klaviatūros navigacija ir pakankamas kontrastas.

## Dokumentacija

Visas aktyvus docs įėjimas yra `docs/INDEX.md`.
