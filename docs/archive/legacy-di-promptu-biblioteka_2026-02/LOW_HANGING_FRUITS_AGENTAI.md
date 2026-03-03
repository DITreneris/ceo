# DI ATRANKOS SISTEMA – LOW HANGING FRUITS: AGENTŲ PASKIRSTYMAS

**Šaltinis:** [LOW_HANGING_FRUITS_ANALIZE.md](LOW_HANGING_FRUITS_ANALIZE.md)  
**Modelis:** [AGENTS.md](../AGENTS.md)  
**Data:** 2026-02-26

---

## Tikslas

Paskirstyti LHF ir HR OS v2 užduotis agentams pagal rolę: **Orchestrator** → **Curriculum** → **Content** / **UI/UX** → **QA**.  
Apimtis: struktūros refaktorius, be naujo turinio plėtimo; golden standard ir testai išlaikomi.

---

## 1. ORCHESTRATOR

| Užduotis | Aprašymas |
|---------|-----------|
| **Prioritetų eilė** | Patvirtinti [LHF prioritetų eilę](LOW_HANGING_FRUITS_ANALIZE.md#5-prioritetų-eilė-įgyvendinimui) ir [§8 atnaujintą eilę](LOW_HANGING_FRUITS_ANALIZE.md#8-atnaujinta-prioritetų-eilė-lhf--hr-os-v2). |
| **Scope** | LHF 1–5 + pasirinktinai 6 (akordeonas); HR OS v2 punktai 6–9 – po LHF; 7.9 Premium UX – backlog. |
| **Koordinacija** | Po kiekvieno etapo: Content/UI/UX atiduoti → QA validacija → merge arba grąžinti. |

**Išvestis:** Užduočių eilė agentams, release scope (pvz. „LHF 1–5“, „+ sticky nav + statusai“).

---

## 2. CURRICULUM

| Užduotis | Aprašymas | Susiję LHF / § |
|----------|-----------|-----------------|
| **Fazių ↔ promptų map** | Nustatyti ir užfiksuoti: fazė 1 → prompt1; 2 → prompt2; 3 → 3,4; 4 → 5,6; 5 → 7; 6 → 8,9,10. Variantas C: 9 ir 10 – fazėje 6. | 2, 3.3, 3.5 |
| **Fazių pavadinimai (spec)** | 1. Diagnostika, 2. Profilis, 3. Pritraukimas, 4. Atranka, 5. Pasiūlymas, 6. Išlaikymas. Laikai pagal spec (~5–10 min ir kt.). | 2, 3.3 |
| **Progreso logikos spec** | „Fazė atlikta“ = visi tos fazės promptų checkbox'ai pažymėti. Bar: 0–6 fazės; aria-valuemax=6. | 3.5 |
| **Struktūros ribos** | 10× blockN, promptN lieka; galima pridėti `data-phase="1"`…`"6"` ant article. Accordion – visi 10 blokų lieka DOM (gali būti hidden). | 3.3, 3.4, 6 |

**Išvestis:** Specifikacija Content ir UI/UX agentams: fazių map, pavadinimai, progreso taisyklės, struktūros ribos.

---

## 3. CONTENT

Visi pakeitimai **tik tekstas**; nekeičiama: id, klasės, JS. Laikytis [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md).

| # | Užduotis | Ką keisti | LHF / § |
|---|----------|-----------|---------|
| 1 | **Hero reframe** | H1 (pvz. „DI atrankos sistema Personalo vadovui“), P („Veikianti atrankos struktūra per ~30 min.“), 6 fazių sąrašas (1. Diagnostika … 6. Išlaikymas), CTA tekstas „Peržiūrėti sistemą“, antrinis „Prisijunk prie bendruomenės“. | 3.1 |
| 2 | **Instrukcija** | Sutrumpinti iki 4 žingsnių: 1) Atidaryk fazę, 2) Nukopijuok promptą, 3) Įklijuok į DI, 4) Pakeisk [laukus]. Nelaužyti ol/li struktūros. | 3.2 |
| 3 | **Progreso tekstai** | `#progressText`: „Sistema: 0 / 6 fazės“ (ir atitinkamai „Sistema: 6 / 6 fazės“ arba „Puiku – atlikai visas 6 fazes.“). Progress bar `aria-label`: „Progresas: X iš 6 fazių“. | 3.5 |
| 4 | **Fazių badge tekstas** | Kiekvienam blokui: „FAZĖ N – Pavadinimas“ (pvz. „FAZĖ 1 – Diagnostika“). Be emoji arba su emoji – pagal STYLEGUIDE. | 3.3 |
| 5 | **Finalinis blokas** | Prieš community: „Sistema sukurta“ – „Tu turi veikiančią atrankos struktūrą.“ CTA tekstai: „Prisijungti prie bendruomenės“, „Plėsti HR OS“. Nebe „Kas toliau?“ su 10 nuorodomis. | 3.6 |
| 6 | **Mini dashboard** (jei įtraukiama) | Papildoma eilutė prie progreso: „~N min liko“ (apytikslis skaičiavimas pagal fazių trukmes). | 7.2 |
| 7 | **Mikro rezultato indikatoriai** | 6 trumpi sakiniai tik atliktoms fazėms: „✔ Diagnostika sukurta“, „✔ Kandidato profilis aiškus“, … „✔ Adaptacijos planas paruoštas“. | 7.6 |

**Riba:** Nė vienas pakeitimas nekeičia `id`, `class`, `data-prompt-id`, JS funkcijų.

---

## 4. UI/UX

Dizainas, HTML struktūra (data-*, wrapper), CSS, a11y, JS susijęs su UI (progresas, sticky nav, statusai, mygtukai). Nekeičia promptų teksto.

| # | Užduotis | Ką daryti | LHF / § |
|---|----------|-----------|---------|
| 1 | **Hero** | CTA nuorodos: pirminis → `#progressIndicator` arba `#block1`/`#phase1`; antrinis → `#community`. Layout 6 fazių sąrašui (viena/dvi eilutės). | 3.1 |
| 2 | **data-phase** | Pridėti kiekvienam `<article class="prompt">` atributą `data-phase="1"` … `data-phase="6"` pagal Curriculum map. | 3.3 |
| 3 | **Fazių badge vizualas** | CSS/HTML: rodyti fazės badge (pvz. .number/.category pakeitimas į fazės etiketę). Laikas `.prompt-time` suderinti su spec. | 3.3 |
| 4 | **Progreso indikatorius (JS)** | Skaičiuoti atliktas fazes pagal checkbox'us (phase→prompts map iš Curriculum). Atnaujinti progressBarFill (0–6), aria-valuenow, aria-valuemax=6. localStorage lieka di_prompt_done_1…10. | 3.5 |
| 5 | **Finalinis blokas** | Layout „Sistema sukurta“ + 2 CTA; next-steps supaprastinti arba pašalinti (nuorodos į #block1…10 perkelti į hero arba pašalinti). | 3.6 |
| 6 | **Fazių statusai** | Badge spalva/ikona: atlikta / aktyvi / neatidaryta. „Aktyvi“ = scroll/viewport arba `di_phase_active`; atlikta = iš checkbox'ų. | 7.3 |
| 7 | **Sticky fazių navigacija** | Viršuje sticky: 6 nuorodų (Diagnostika … Išlaikymas) į #phase1…#phase6 arba #blockX; aktyvi fazė paryškinta. | 7.1 |
| 8 | **„Kitas žingsnis“ mygtukas** | Po promptu: [Pažymėti kaip atlikta] [→ Kitas fazė]. Paspaudus – scroll į kitą fazę; jei bus accordion – atidaryti. | 7.5 |
| 9 | **Akordeonas** (optional) | Fazės 1–6 kaip antraštės; atidarius – viduje 1–2 promptai. Vienas aiškus mygtukas „Kopijuoti promptą“; code-block toolbar – ikona arba sutrumpintas tekstas. Visi 10 blokų lieka DOM (hidden atsidarius). | 3.4, 7.4 |
| 10 | **Mini dashboard „~N min liko“** | JS: skaičiuoti likusį laiką pagal (6−X)×~8 min arba fazių trukmes; rodyti po „Sistema: X / 6 fazės“. | 7.2 |

**Riba:** 10× blockN, promptN, mygtukai data-prompt-id, checkbox data-prompt-id, copyPrompt/selectText, toast, hiddenTextarea – neišimami. A11y: aria-label, aria-valuenow/min/max, skip-link, role – atnaujinti pagal naujus tekstus (Content).

---

## 5. QA

| Užduotis | Kada | Ką tikrinti |
|----------|------|-------------|
| **Struktūros testai** | Prieš kiekvieną merge | `npm test`: 10× promptN, blockN, ≥10 mygtukų „Kopijuoti promptą“, ≥10 .code-block, ≥10 .prompt-done, progressText, progressBarFill, toast, main-content, copyPrompt/selectText, localStorage, hiddenTextarea. Jei progreso tekstas keičiamas – testas tikrina elementų buvimą, ne konkretų tekstą; jei accordion – visi 10 blokų DOM'e (gali būti hidden). |
| **LEGACY_GOLDEN_STANDARD** | Po refaktorius | Atnaujinti docs/LEGACY_GOLDEN_STANDARD.md: progressText/aria-label („Sistema: 0 / 6 fazės“, „Progresas: 0 iš 6 fazių“), hero teksto pakeitimai, next-steps/footer, data-phase, fazių badge klasės. |
| **Lint ir a11y** | Prieš merge | `npm run lint:html`, `npm run lint:js`; pa11y (CI arba lokaliai). |
| **Dokumentacija** | Prieš merge / release | docs/DOCUMENTATION.md atitikimas pakeitimams; prieš release – CHANGELOG.md, SemVer. |

**Išvestis:** Pass → merge; Fail → grąžinti Content arba UI/UX.

---

## 6. DARBO EILĖ (rekomenduojama)

| Etapas | Agentas(-ai) | Užduotis |
|--------|--------------|----------|
| 0 | **Orchestrator** | Patvirtinti prioritetus (§5, §8). |
| 1 | **Curriculum** | Fazių map, pavadinimai, progreso logikos spec, struktūros ribos. |
| 2 | **Content** | LHF 1–2: Hero reframe (tekstas), Instrukcija 4 žingsniai. |
| 3 | **UI/UX** | Hero nuorodos + layout; data-phase + fazių badge vizualas (LHF 3, 4). |
| 4 | **Content** | Progreso tekstai, finalinis blokas „Sistema sukurta“ (LHF 3, 5). |
| 5 | **UI/UX** | Progreso JS (X/6 fazės), finalinis blokas layout (LHF 3.5, 3.6). |
| 6 | **QA** | `npm test`, golden standard atnaujinimas, lint, a11y. |
| 7 | **Content + UI/UX** | HR OS v2: mini dashboard tekstas (7.2), mikro rezultato sakiniai (7.6), fazių statusų tekstai jei reikia. |
| 8 | **UI/UX** | Sticky nav (7.1), fazių statusai (7.3), „Kitas žingsnis“ (7.5). |
| 9 | **QA** | Pakartoti validaciją. |
| 10 | **Optional** | Akordeonas (3.4); po to QA. |

---

## 7. SAUGUMAS

- **Struktūros testas** netikrina konkretaus progressText teksto – tik elementų buvimą. Jei vėliau būtų accordion – visi 10 blokų turi likti DOM'e (gali būti hidden).
- **Content** niekada nekeičia id/klasės/JS.
- **UI/UX** keičia struktūrą (data-phase, wrapper) ir JS tik pagal Curriculum spec; QA fiksuoja pakeitimus LEGACY_GOLDEN_STANDARD.

---

**Paskutinis atnaujinimas:** 2026-02-26
