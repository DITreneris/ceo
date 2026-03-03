# Agentų planas: docs/MOBILE_UX_AUDIT.md įgyvendinimas

**Šaltinis:** [docs/MOBILE_UX_AUDIT.md](MOBILE_UX_AUDIT.md)  
**Data:** 2026-02-26  
**Workflow:** AGENTS.md (Orchestrator → Curriculum/UI/UX → QA)

---

## 1. Scope ir prioritetai (Orchestrator)

| Prioritetas | Apimtis | Agentai |
|-------------|---------|---------|
| **P1** | Greiti pataisymai (safe area, viewport, checkbox tap area) | UI/UX → QA |
| **P2** | Skaitomumas ir layout (code-block šriftas, instructions wrap, „Kas toliau?“ 320px) | UI/UX → QA |
| **P3** | Nice-to-have (badges wrap, sticky CTA, PWA – atskiras scope) | UI/UX / Curriculum (jei PWA) → QA |

**Orchestrator išvestis:** Užduočių eilė P1 → P2 → P3; kiekvienam ciklui – specifikacija UI/UX agentui.

---

## 2. Agentų užduotys pagal auditą

### 2.1 Orchestrator Agent

| Užduotis | Įvestis | Išvestis |
|----------|---------|----------|
| Nustatyti scope iš MOBILE_UX_AUDIT.md | MOBILE_UX_AUDIT.md, MUST_TODO.md | Prioritizuotas sąrašas (P1, P2, P3 punktai) |
| Paskirstyti užduotis UI/UX ir (jei reikia) Content | Tobulinimo planas §3 | Specifikacija per užduotis |
| Po kiekvienos iteracijos – QA validacija; QA fail → grąžinti UI/UX | QA ataskaita | Taisymų eilė arba merge |

---

### 2.2 Curriculum Agent

| Užduotis | Kada | Įvestis | Išvestis |
|----------|------|---------|----------|
| Struktūros rekomendacijos | Jei priimamas P3 (PWA / sticky CTA) – reikia nustatyti, ar keičiama puslapio logika/seka | Orchestrator scope P3 | Specifikacija: ar PWA atskiras scope, ar sticky CTA įeina į tą patį release |
| **Pastaba** | P1 ir P2 – tik CSS/HTML (breakpoints, safe area, tap area) – Curriculum neprivalomas | — | — |

---

### 2.3 UI/UX Agent

**Įvestis:** MOBILE_UX_AUDIT.md §2 (problemos ir rekomendacijos), §3 (tobulinimo planas), [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) (nekeisti ID, data-*, JS API).

| Prioritetas | Punktas | Veiksmas | Failai |
|-------------|---------|----------|--------|
| **P1** | Toast / fiksuoti elementai | Pridėti `padding-bottom: env(safe-area-inset-bottom)` toast ir footer (jei fiksuotas) | index.html (inline style arba `<style>`) |
| **P1** | Viewport (neprivaloma) | Jei priimta: `viewport-fit=cover` + safe-area insets | index.html `<meta name="viewport">` |
| **P1** | Checkbox tap area | `.prompt-done-wrap`: mobilėje `min-height: 44px`, padding; checkbox vizualiai ≥24px (arba tap area ≥44px) | index.html CSS |
| **P2** | Code-block šriftas | 375px breakpoint: ne mažinti iki 13px; palikti 14px (arba 13px tik labai trumpiems eilutėms) | index.html CSS |
| **P2** | Instructions antraštė | 480px ir žemiau: `.instructions-title` – `flex-wrap: wrap`; `prompt-time` antra eilute arba mažesnis šriftas | index.html CSS |
| **P2** | „Kas toliau?“ nuorodos | 320px: patikrinti plotį; `min-width: 0` arba leisti laisvai lūžti, kad nebūtų horizontal scroll | index.html CSS |
| **P3** | Header badges | 375px ir mažiau: `flex-wrap`, `gap`, gal `font-size: 11px` badge | index.html CSS |
| **P3** | Sticky CTA / PWA | Atskirai (jei į scope); sticky – tik CSS; PWA – manifest + SW (Curriculum scope) | — |

**Išvestis:** CSS/HTML pakeitimai (be id/klasės/JS API laužymo); prieinamumo patikros (focus, touch targets).

---

### 2.4 Content Agent

| Užduotis | Kada | Įvestis | Išvestis |
|----------|------|---------|----------|
| Trumpesnis tekstas „Kas toliau?“ | Tik jei 320px rekomendacija įgyvendinama per teksto trumpinimą (auditas: „arba trumpesnis tekstas“) | UI/UX / Orchestrator nurodymas | Pakeisti tik nuorodų tekstus; nekeisti id/klasių |
| **Pastaba** | Dauguma audit punktų – tik CSS/layout; Content įtraukiamas tik jei reikia keisti copy. | — | — |

---

### 2.5 QA Agent

**Įvestis:** UI/UX (ir Content, jei buvo) pakeitimų diff, [docs/MOBILE_UX_AUDIT.md](MOBILE_UX_AUDIT.md) §4 (Testavimo checklist), [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md).

| Užduotis | Veiksmas |
|----------|----------|
| Lint ir testai | `npm test`, `npm run lint:html`, `npm run lint:js` |
| Golden standard | Patikrinti, kad pakeitimai nepažeidžia HTML id, data-*, JS API; jei keičiama struktūra – atnaujinti LEGACY_GOLDEN_STANDARD.md |
| Mobilė (checklist) | 320px, 375px, 414px – be horizontal scroll; touch ≥44px; copy flow; progresas; safe area (notch); focus; reduced motion |
| A11y | `npx pa11y http://localhost:3000/ --standard WCAG2AA` (po `npx serve -s . -l 3000`) |
| Dokumentacija | Prieš merge: ar DOCUMENTATION.md inventoriuje įrašytas MOBILE_UX_AUDIT.md (jei dar ne); release – CHANGELOG.md, SemVer |

**Išvestis:** Ataskaita pass / grąžinti UI/UX (arba Content) su konkretūs taisymų punktai.

---

## 3. Siuntimo seka (vykdymo eilė)

```
1. Orchestrator: iš MOBILE_UX_AUDIT.md suformuoti P1 specifikaciją → UI/UX
2. UI/UX: įgyvendinti P1 (safe area, viewport, checkbox tap area) → commit [UI] …
3. Orchestrator: perduoti QA
4. QA: npm test, lint, mobile checklist §4, golden standard → ataskaita
5a. QA pass → merge P1; Orchestrator pradeda P2
5b. QA fail → grąžinti UI/UX su taisymų sąrašu
6. Kartoti 1–5 P2 (skaitomumas, layout), tada P3 (jei į scope)
7. Release: QA tikrina CHANGELOG, SemVer; tag + deploy
```

---

## 4. Dokumentacijos atnaujinimai

| Dokumentas | Kas atnaujina | Kada |
|------------|----------------|------|
| docs/DOCUMENTATION.md | QA / Orchestrator | Pridėti MOBILE_UX_AUDIT.md į inventorių (jei dar nėra) |
| docs/LEGACY_GOLDEN_STANDARD.md | QA | Jei UI pakeitimai keičia komponentų aprašymą (pvz. nauji breakpointai ar klasės) |
| CHANGELOG.md | Kiekvienas (pagal pakeitimą) | Release – sekcija „Pakeista“ / „Taisyta“ su mobile UX punktais |

---

## 5. Santrauka

| Agentas | Pagrindinė atsakomybė už MOBILE_UX_AUDIT |
|---------|-------------------------------------------|
| **Orchestrator** | Scope P1→P2→P3, užduočių eilė, koordinacija su QA |
| **Curriculum** | Tik jei P3 (PWA / didesnė logika) – scope ir seka |
| **UI/UX** | Visi CSS/HTML pakeitimai (safe area, tap area, breakpoints, tipografika, layout) |
| **Content** | Tik jei keičiamas nuorodų/tekstų copy (pvz. „Kas toliau?“) |
| **QA** | Testai, lint, mobile checklist, golden standard, a11y, dokumentacija, release |

**Šaltinis tiesiogiai:** [docs/MOBILE_UX_AUDIT.md](MOBILE_UX_AUDIT.md) – visos rekomendacijos ir testavimo checklist.
