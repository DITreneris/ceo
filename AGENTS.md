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
| **PDF HTML/CSS** | Content → Design (serial per PDF) | `docs/pdf-source/*` | Du agentai ne redaguoja to paties HTML |
| **Storefront** | UI/UX | `index.html`, `style.css`, `commerce.js` | Neliesti kol SOT promises neužrakinti; audit → `docs/STOREFRONT_AUDIT.md` |
| **Export / assets** | Engineering/Ops | `npm run pdf:export`, `assets/pdf-covers/` | Tik po HTML stabilizacijos |
| **Commerce live** | Ops + Orchestrator | Stripe Dashboard, Vercel env, `allowPlaceholderCheckout` | Ne paraleliai su masiniu `sot` rewrite |

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
| `todo.md` | Fazės ir launch blockeriai |
| `AGENTS.md` | Agentų lanes ir merge taisyklės |
| `memo_pdf.md` | Stripe + fulfillment runbook |
| `docs/LAUNCH_CHECKLIST.md` | Phases 15–17 gate |
| `docs/STYLEGUIDE.md` | PDF/storefront dizaino SOT |
| `gold_legacy_standard.md` | Premium UI/PDF/commerce patterns |
| `docs/PAID_FLOW_TEST_BACKLOG.md` | Commerce/a11y testų backlog |

- Visa kita dokumentacija laikoma archyve (`docs/archive/`) arba planavimo lygiu (`docs/pre_deploy_plan.md`), jei nėra aiškiai grąžinta į aktyvią zoną.
- Prieš docs pakeitimus: [`docs/CURRENT_TRUTH.md`](docs/CURRENT_TRUTH.md).
