# Agentų taisyklės (lean)

Tikslas: minimali agentų darbo tvarka šiam repo.

## Kalbos ir lokalizacija (SOT)

**Pozicija (nuo 2026-05):** produktą vystome **tik anglų kalba (EN)**. Lokalizacijos fokusas – **JAV (USA)**: US English, `en-US` formatai, USD, JAV auditorijai tinkamas copy ir trust signalai.

| Kas | Politika |
|-----|----------|
| **Vystymas** | Nauji tekstai, UX, SEO, schema, feature'ai – tik EN. Šablonas: root `index.html` (EN). Kanoninis kelias: `/en/`. |
| **LT (`/lt/`)** | Lieka kaip **tiesioginis legacy/regression testų kelias** (`npm test`, smoke), bet ne kaip viešas kalbos pasirinkimas. **Nevystome:** nekeisti LT copy, nepridėti LT turinio, nešalinti LT build. |
| **Build** | `npm run build` vis dar generuoja `lt/index.html` – LT puslapis turi likti techninis/regression paviršius, ne aktyvi SEO lokalizacija. |
| **generator.js** | `locale === 'lt'` šakos paliekamos dėl `/lt/` suderinamumo ir testų; nauja logika – EN-first, LT šakos tik jei būtina techninei suderinamumui. |

Jei užduotis konfliktuoja su šia politika (pvz. „išversk į LT“), Orchestratorius prioritetizuoja EN/USA ir pažymi LT kaip out of scope.

## Rolės

- **Orchestrator** - nustato prioritetą ir užduočių seką.
- **Content** - tvarko tekstus ir promptus.
- **UI/UX** - tvarko UX, a11y, vizualinę hierarchiją.
- **QA** - tikrina kokybę prieš merge ir release.

## Darbo seka

1. Orchestrator suformuoja užduotį.
2. Content/UI įgyvendina pakeitimus.
3. QA patikrina ir grąžina taisymams arba patvirtina.

## Parallel lanes ir failų savininkystė

Kad agentai dirbtų paraleliai be konfliktų:

| Lane | Savininkas | Failai | Kitų lane draudimas |
|------|------------|--------|---------------------|
| **SOT / kryptis** | Orchestrator | `config/sot.json` (`productDecision`, `commerce`, `brand`) | Content nekeičia `commerce` be O sign-off |
| **Turinio blueprint** | Content | `config/sot.json` (`buyerProblems`, `pdfGuides`, `productBlueprint`) | Po F1 merge ant Orchestrator bazės |
| **PDF HTML/CSS** | Content → Design (serial per PDF) | `docs/pdf-source/*.html` (operator-local; gitignored) + `pdf-print.css` (tracked) | Du agentai ne redaguoja to paties HTML. Interiors stay off GitHub HEAD. Lesson (2026-09-03): interior work is **maturity-in-place** (When/Do/See/Done), not V02 page adds. `.page` is a clipped Letter box (`overflow: hidden`) — cut copy on overflow, never add a 22nd/44th section. |
| **Storefront** | UI/UX | `index.html`, `style.css`, `commerce.js` | Neliesti kol SOT promises neužrakinti; audit → `docs/STOREFRONT_AUDIT.md` |
| **Export / assets** | Engineering/Ops | `npm run pdf:export`, `assets/pdf-covers/` | Tik po HTML stabilizacijos. Lesson (2026-09-03): `pdf:export` does not update buyer files — run `pdf:upload-blob` (same `paid-pdfs/` paths, env URLs stay). On this Windows, `test:mixed` smoke teardown can fail `wmic.exe ENOENT`; run smoke/e2e/visual/a11y against `serve :3300`. |
| **Commerce live** | Ops + Orchestrator | Stripe Dashboard, Vercel env, `allowPlaceholderCheckout` | Ne paraleliai su masiniu `sot` rewrite. Lesson (2026-09-02): Stripe webhook URL must end with `/` when `vercel.json` has `trailingSlash: true` — Stripe does not follow POST 308. Lesson (2026-09-08/09): one Stripe account fans out `checkout.session.completed` to every endpoint — `.ceo` must 200-ignore Hire/hub SKUs (`success_url` host or hub `plan`), not 500; unmapped `.ceo` still 500. |

**Merge taisyklė:** vienas `sot.json` commitų seka — Orchestrator (F1) → Content (F2–F3) → QA `npm test`.

## Kokybės vartai

- Prieš merge: `npm test`.
- Prieš release arba UX/commerce flow keitimą: `npm run test:mixed` (smoke, e2e, a11y).
- Paid-flow testų plėtra (planas): [`docs/PAID_FLOW_TEST_BACKLOG.md`](docs/PAID_FLOW_TEST_BACKLOG.md).

## Dokumentų taisyklė

**Aktyvūs (operaciniai):**

| Failas | Paskirtis |
|--------|-----------|
| `README.md` | Paleidimas, QA/deploy santrauka |
| `docs/INDEX.md` | Dokumentacijos žemėlapis |
| `docs/CURRENT_TRUTH.md` | Kanoniniai faktai (21/43, EN-first, Vercel) |
| `todo.md` | Fazės, demand Now/Next/Later, Phase 18 log |
| `docs/roadmap.md` | 90-day Manage spoke GTM (demand / harvest) |
| `AGENTS.md` | Agentų lanes ir merge taisyklės |
| `memo_pdf.md` | Stripe + fulfillment runbook |
| `docs/LAUNCH_CHECKLIST.md` | Phases 15–17 gate |
| `docs/STYLEGUIDE.md` | PDF/storefront dizaino SOT |
| `gold_legacy_standard.md` | Premium UI/PDF/commerce patterns |
| `docs/PAID_FLOW_TEST_BACKLOG.md` | Commerce/a11y testų backlog |
| `docs/GEO_STACK.md` | AI crawlers, llms.txt, sitemap, schema |
| `docs/DESIGN-SYSTEM.md` | Storefront tokens + components (DS 1.1) |

- Planning and history live under `docs/INDEX.md` (not daily SOT). Archive stays in `docs/archive/`.
- Prieš docs pakeitimus: [`docs/CURRENT_TRUTH.md`](docs/CURRENT_TRUTH.md).
