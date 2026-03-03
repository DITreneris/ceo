# Legacy Golden Standard – DI Promptų Biblioteka (Spin-off Nr. 3)

**Tikslas:** Dabartinis kodas yra atskaitos taškas (legacy golden standard). Keičiant **turinį** (promptus, antraštes, aprašymus) – būtina laikytis šios struktūros ir konvencijų. Struktūros, ID, CSS klasių ir JavaScript API nekeičiame be QA patvirtinimo ir dokumento atnaujinimo. Projektas: Spin-off Nr. 3 (10 promptų HR kasdienės atrankos sistemai).

**Versija:** 1.8  
**Data:** 2026-02-27  
**Kalba:** LT

**Sinchronizuota su kodu (2026-02-27):** **LHF + premium UI (6 fazės):** Hero – H1 „DI atrankos sistema Personalo vadovui“, P „Veikianti atrankos struktūra per ~30 min.“. Po H1 – horizontalus fazių procesas (1–6) `ul.header-phases` su `button.header-phase-link[data-phase]` – aktyvi fazė turi šviesų „mint“ foną, žalią taškelį, tamsų tekstą ir susieta su fazių akordeonu (paspaudus atidaro atitinkamą fazę žemiau). CTA: vienas pirminis mygtukas „Peržiūrėti sistemą“ → `#progressIndicator`. Instrukcija – 4 žingsniai: (1) pasirink fazę ir atidaryk, tada promptą; (2) „Kopijuoti promptą“ mygtukas arba `Ctrl/Cmd + C`; (3) įklijuok į ChatGPT/Claude/kitą DI; (4) pakeisk `[įmonė]`, `[pozicija]`, `[atlygis]`, `[ ]` savo duomenimis, DI vaidmens („Tu esi…“) nekeisk. Progresas – `#progressText`: „Sistema: 0 / 6 fazės“ / „Puiku – atlikai visas 6 fazes.“; `.progress-bar` `aria-valuemax="6"`, `aria-label`: „Progresas: X iš 6 fazių“. Kiekvienas `<article class="prompt">` turi `data-phase="1"` … `"6"`; `.number` ir `.category` (fazės numeris/pavadinimas) **privalo egzistuoti HTML**, bet vizualiai fazės viduje yra paslėpti (`.phase-body .prompt .number/.category { display:none; }`) – fazės pavadinimas rodomas tik fazės header'yje. Fazių map: 1→[1], 2→[2], 3→[3,4], 4→[5,6], 5→[7], 6→[8,9,10]. Promptai perkelti į fazių akordeoną `section.phase[data-phase]` (viena fazė – 1–3 promptai) – ID (`promptN`, `blockN`) nekeičiasi. Pabaigoje vienas community blokas (id="community"): antraštė „Sistema sukurta. Nori daugiau?“ + 2 CTA (WhatsApp grupė, „Promptų anatomija →“). Footer – be papildomo CTA, tik „Tai Spin-off Nr. 3 iš „Promptų anatomijos“.“. Skip-link, info-box `aria-label`, title, Lucide, motion tokenai (`--duration-*`, `--ease-*`) – kaip aprašyta STYLEGUIDE. **Struktūros testai** tikrina 10× prompt/block ID, progressText/progressBarFill, copyPrompt/selectText, localStorage, hiddenTextarea. **CI** ir **Deploy** – nepakeista.

---

## 0. Kodo bazės gyvavimo ciklas (nuo kodo iki deploy)

| Etapas | Kas | Kur / kaip |
|--------|-----|------------|
| **Įėjimo taškai** | Vienas puslapis – app | `index.html` (HTML + inline `<style>` + inline `<script>` IIFE). Antras puslapis: `privatumas.html`. Ikonos: Lucide UMD `https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`. |
| **Lokalus tikrinimas** | Testai + lint | `npm install` → `npm test` (= `node tests/structure.test.js` + `npm run lint:html` + `npm run lint:js`). Pasirinktinai: `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/ --standard WCAG2AA`. |
| **CI (push/PR)** | `.github/workflows/ci.yml` | Šakos: `main`, `develop`. Žingsniai: checkout → Node 20 → `npm install` → `npm test` → serve → wait-on → pa11y `/` ir `/privatumas.html` (`.pa11yrc.json`, WCAG2AA). |
| **Deploy** | `.github/workflows/deploy.yml` | Paleidžiama: push į `main` arba rankinis `workflow_dispatch`. Job **test:** checkout, Node 20, `npm install`, `npm test`. Job **deploy:** `upload-pages-artifact` su `path: .` → `deploy-pages` (environment: `github-pages`). Repo Settings → Pages → Source: **GitHub Actions**. |
| **Production URL** | Priklauso nuo repo | Šis projektas (04_personalas): dažniausiai `https://ditreneris.github.io/personalas/` (README). Alternatyva: `https://ditreneris.github.io/marketingas/` (DEPLOYMENT.md) – push į atitinkamą remote. |

**Svarbu:** Prieš merge/PR – `npm test` turi praeiti. Prieš release – CHANGELOG atnaujintas, SemVer. Gyvas testavimas po deploy – [docs/TESTAVIMAS.md](TESTAVIMAS.md).

---

## 1. Santrauka

| Kategorija | Fiksuota (nekeičiame keisdami turinį) | Leidžiama keisti (turinys) |
|------------|----------------------------------------|----------------------------|
| **HTML** | Struktūra: `<main id="main-content">`, sekcijos, 10× `<article class="prompt">`, 6× `section.phase` (akordeonas), id `block1`–`block10`, `prompt1`–`prompt10`, data-* atributai | Tekstai: hero h1/p, .objectives sąrašas, instrukcijos, .prompt-title, .prompt-desc, `<pre class="code-text">` turinys, .info-content, community ir footer turinys, privatumas.html |
| **CSS** | `:root` kintamieji, komponentų klasės (.code-block, .btn, .toast, .progress-bar ir kt.) – žr. [STYLEGUIDE.md](../STYLEGUIDE.md) | Nėra (turinio keitimas neturi keisti klasių ar layout) |
| **JS** | IIFE, CONFIG, selectText, copyPrompt, handleCodeBlockKeydown, fallbackCopy, showSuccess/showError/showToast, localStorage raktai `di_prompt_done_1`…`10`, debounce; HTML kviečia onclick/onkeydown | Nėra |
| **A11y** | Skip link `#main-content`, role="button"/tabindex="0" ant .code-block, aria-label mygtukams ir checkbox, aria-live/role="progressbar", toast role="status" | Nėra (prieinamumo atributų reikšmes keisti tik pagal reikalavimus, nekeičiant struktūros) |

**Promptų turinio formatas:** Kiekvieno prompto tekstas `<pre class="code-text">` laikosi šablono: **META** (vaidmuo su patirtimi, tikslas, auditorija, kontekstas), **INPUT** (konkretūs duomenys/placeholderiai, apribojimai), **OUTPUT** (formatas, struktūra, kalba, tonas). Keičiant turinį – išlaikyti šią struktūrą siekiant vienodo praktiškumo.

---

## 2. HTML struktūros schema

```
index.html
├── <a class="skip-link" href="#main-content">Pereiti prie turinio</a>
├── <div class="container">
│   └── <main id="main-content">
│       ├── <header class="header">        (hero: .header-badges, h1, p, .header-phases, .header-cta)
│       ├── <section class="objectives">   (h2#objectives-title, p.objectives-intro, ul > li)
│       ├── <section class="instructions"> (h2#instructions-title, ol > li)
│       ├── <div class="progress-wrap" id="progressIndicator" aria-live="polite" aria-atomic="true">
│       │   ├── <p id="progressText">  (pradžia: „Sistema: 0 / 6 fazės“; JS atnaujina į „Sistema: X / 6 fazės“ / „Puiku – atlikai visas 6 fazes.“)
│       │   └── <div class="progress-bar" role="progressbar" aria-valuenow/min, aria-valuemax="6" aria-label="Progresas: 0 iš 6 fazių">
│       │       └── <div class="progress-bar-fill" id="progressBarFill">
│       ├── 10× <article class="prompt" data-phase="1"…"6">
│       │   ├── <div class="prompt-header">
│       │   │   ├── <div class="prompt-meta"> (.number „FAZĖ N“, .category fazės pavadinimas, .prompt-time)
│       │   │   ├── <h2 class="prompt-title">
│       │   │   └── <p class="prompt-desc">
│       │   ├── <div class="prompt-body">
│       │   │   ├── <div class="code-block" id="blockN" ...>
│       │   │   │   ├── <span class="code-block-toolbar" aria-hidden="true"><i data-lucide="copy" class="icon icon--sm"></i> Kopijuoti</span>
│       │   │   │   └── <pre class="code-text" id="promptN">  ← TURINYS KEICIAMAS
│       │   │   └── <div class="info-box" role="note" aria-label="Informacija: promptas N">
│       │   │       ├── <div class="info-item"> (.info-icon: Lucide lightbulb, .info-content: strong „Naudok kai:“ + p)  ← TURINYS KEICIAMAS
│       │   │       └── <div class="info-item info-item-replace"> (.info-icon: Lucide pencil, .info-content: strong „Pakeisk prieš naudodamas:“ + p)  ← TURINYS KEICIAMAS
│       │   └── <div class="prompt-footer">
│       │       ├── <p class="prompt-cta">
│       │       ├── <button class="btn" onclick="copyPrompt(this, 'promptN')" data-prompt-id="promptN" aria-label="Kopijuoti promptą N į mainų atmintinę">
│       │       └── <label class="prompt-done-wrap">
│       │           └── <input type="checkbox" class="prompt-done" data-prompt-id="N" aria-label="Pažymėti, kad atlikai šį žingsnį">
│       ├── 6× <section class="phase" data-phase="1"…"6">  (akordeonas: fazės header + fazės promptai)
│       ├── <section class="community" id="community">
│       └── <footer class="footer">
├── <textarea class="hidden" id="hiddenTextarea" aria-hidden="true">
└── <div class="toast" id="toast" role="status" aria-live="polite" aria-label="Kopijavimo pranešimas">
```

**Būtini ID ir atributai (nekeisti):**

- `main-content`, `progressIndicator`, `progressText`, `progressBarFill`, `toast`, `hiddenTextarea`
- Kiekvienam promptui: `id="block1"` … `id="block10"`, `id="prompt1"` … `id="prompt10"`
- Mygtukas: `data-prompt-id="prompt1"` … `"prompt10"`, `aria-label="Kopijuoti promptą N į mainų atmintinę"`
- Checkbox: `data-prompt-id="1"` … `"10"`, `aria-label="Pažymėti, kad atlikai šį žingsnį"`
- Progreso juosta: `#progressText` – matomas tekstas (JS: „Sistema: X / 6 fazės“ arba „Puiku – atlikai visas 6 fazes.“). `.progress-bar` – `aria-valuemax="6"`, `aria-label="Progresas: 0 iš 6 fazių"` (pradžia); JS atnaujina į „Progresas: X iš 6 fazių“.
- Info-box: `aria-label="Informacija: promptas N"` (N 1–10; skaičiumi arba žodžiu pagal implementaciją).
- Toast: `id="toast"`, `role="status"`, `aria-live="polite"`, `aria-label="Kopijavimo pranešimas"`.
- hiddenTextarea: `id="hiddenTextarea"`, `class="hidden"`, `aria-hidden="true"` (aria-label neprivalomas).
- localStorage raktai: `di_prompt_done_1` … `di_prompt_done_10` (naudojami JS); reikšmės `'true'` / `'false'`.

---

## 3. JavaScript API (fiksuota)

- **selectText(element)** – pasirenka tekstą .code-block `<pre>` elemente; kviečiamas iš onclick ir onkeydown (Enter/Space).
- **copyPrompt(button, promptId)** – kopijuoja promptą pagal `promptId` (pvz. `'prompt1'`) į mainų atmintinę; kviečiamas iš .btn onclick.
- **handleCodeBlockKeydown(event, element)** – klaviatūros navigacija code-block (Enter/Space).
- **updateProgressIndicator()** – skaičiuoja atliktas fazes (fazė atlikta, kai visi tos fazės promptų checkbox'ai pažymėti; PHASE_TO_PROMPTS map 1→[1], 2→[2], 3→[3,4], 4→[5,6], 5→[7], 6→[8,9,10]), atnaujina `#progressText` („Sistema: X / 6 fazės“ / „Puiku – atlikai visas 6 fazes.“), `#progressBarFill` plotį (0–6), `.progress-bar` `aria-valuenow`, `aria-valuemax="6"`, `aria-label` („Progresas: X iš 6 fazių“).
- **CONFIG** – SELECTION_TIMEOUT, TOAST_DURATION, BUTTON_RESET_TIMEOUT, ERROR_TIMEOUT, DEBOUNCE_DELAY.
- **localStorage:** raktai `di_prompt_done_1` … `di_prompt_done_10`; reikšmės `'true'` / `'false'`.

Keičiant turinį **nepridėti** naujų `onclick`/`onkeydown` handlerių, nekeisti funkcijų pavadinimų, neištraukti JS į atskirą failą be proceso atnaujinimo (žr. [KODO_BAZES_ANALIZE.md](../KODO_BAZES_ANALIZE.md)).

---

## 4. .code-block komponentas (fiksuota)

`.code-block` viršuje turi toolbar'ą `.code-block-toolbar` su Lucide copy ikona ir tekstu „Kopijuoti“.

| Savybė | Reikšmė | Pastaba |
|--------|---------|---------|
| Toolbar | `<span class="code-block-toolbar"><i data-lucide="copy" …></i> Kopijuoti</span>` | Tekstas „Kopijuoti“ nekeičiamas be Content/UI koordinacijos |
| Pozicija | `position:absolute`, `top: var(--space-12)`, `right: var(--space-16)` | Visada bloko viršuje dešinėje, nesikerta su turiniu |
| Interakcija | Hover/focus padidina opacity; click ant viso `.code-block` pažymi tekstą | copyPrompt / selectText logika aprašyta JS API |

Koreguojant `.code-block` ar `.prompt` CSS, patikrinti: toolbar matomas, neatsiremia į kraštus ir nepasidengia tekstu.

---

## 5. Checklist prieš commit (Content / QA)

- [ ] Nepakeisti jokių `id` (block1–block10, prompt1–prompt10, progressText, progressBarFill, toast, main-content, hiddenTextarea).
- [ ] Nepakeisti `data-prompt-id` ant mygtukų ir checkbox (prompt1…prompt10 ir 1…10).
- [ ] Kiekvienas promptas lieka tos pačios struktūros: .prompt-header → .prompt-body (.code-block + .info-box su 2× .info-item) → .prompt-footer (.btn + .prompt-done).
- [ ] .code-block turi `onclick="selectText(this)"` ir `onkeydown="handleCodeBlockKeydown(event, this)"`; .btn – `onclick="copyPrompt(this, 'promptN')"` su atitinkamu N.
- [ ] Nauji ar pakeisti promptai naudoja tą patį HTML šabloną (article.prompt su tais pačiais klasėmis ir atributais).
- [ ] Prieš merge: `npm test` praeina; jei release – CHANGELOG atnaujintas, versija SemVer.

**Struktūros testas** (`tests/structure.test.js`) tikrina: 10× `id="promptN"` ir `id="blockN"`, ≥10 mygtukų „Kopijuoti promptą“, ≥10 `.code-block`, ≥10 `.prompt-done`, skip-link į `#main-content`, `id="main-content"`, progressText + progressBarFill, toast + role="status", nuorodą į privatumas.html, `copyPrompt`/`selectText`, `localStorage` + `di_prompt_done_`, `hiddenTextarea`, `lang="lt"`, privatumas.html egzistavimą.

---

## 6. Susiję dokumentai

- [index.html](../index.html) – pagrindinis puslapis (implementacija)
- [tests/structure.test.js](../tests/structure.test.js) – struktūriniai testai (būtini elementai)
- [STYLEGUIDE.md](../STYLEGUIDE.md) – spalvų paletė, komponentai, tipografija
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy į GitHub Pages, troubleshooting
- [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) – QA kriterijai, komandos
- [docs/TESTAVIMAS.md](TESTAVIMAS.md) – gyvo testavimo scenarijai
- [KODO_BAZES_ANALIZE.md](../KODO_BAZES_ANALIZE.md) – gili kodo analizė, neatitikimai, rekomendacijos
- [AGENTS.md](../AGENTS.md) – agentų rolės ir užduočių seka (skyrius „Užduočių seka ir golden standard“)
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų inventorius

---

**Paskutinis atnaujinimas:** 2026-02-26 (LHF v1.7: 6 fazių sisteminimas – hero, instrukcija 4 žingsniai, progresas X/6 fazės, data-phase, fazių badge, „Sistema sukurta“, PHASE_TO_PROMPTS, updateProgressIndicator pagal fazes)
