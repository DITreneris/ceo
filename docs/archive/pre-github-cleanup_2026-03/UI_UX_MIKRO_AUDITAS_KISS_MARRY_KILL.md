# UI/UX Mikro Auditas su KISS-MARRY-KILL

## Paskirtis

Šis dokumentas aprašo, kaip vykdyti trumpą, bet aukštos kokybės UI/UX mikro auditą `DI Operacinis Centras` produktui ir kaip paversti išvadas į aiškų `KISS-MARRY-KILL` veiksmų planą.

Terminų taisyklė: pirmas paminėjimas `užklausa (promptas)`, toliau `promptas`.

## Audito scope

### Kritinis first-run kelias

`Landing -> režimo pasirinkimas -> gylio pasirinkimas -> formos pildymas -> prompto kopijavimas -> perėjimas į AI įrankį`

### Vertinami artefaktai

- `index.html` (hero, operacinio centro flow, CTA, bibliotekos/rules discoverability).
- `style.css` (hierarchija, kontrastas, mobile elgsena, focus states, dark mode).
- `generator.js` (live prompt generacija, mode/depth, sesijos, copy ir AI launchers).
- `copy.js` (accordion atidarymo logika, hero-step navigacija, toast valdymas).
- `docs/FIRST_RUN_USER_JOURNEY_AUDIT.md` (ankstesnės trinties vietos ir backlogo tęstinumas).

## Kas jau veikia (baseline)

- Aiškus pagrindinis darbo centras su 3 režimais ir 3 gylio lygiais.
- Promptas generuojamas realiu laiku, matomas simbolių skaičius.
- Yra keli kopijavimo taškai (sticky/nav, output icon, primary CTA, library copy).
- Yra sesijų išsaugojimas ir užkrovimas (`localStorage`), kas palaiko iteracinį darbą.
- A11y bazė gera: skip link, `aria-live`, klaviatūrinis sesijų valdymas, `focus-visible`, `prefers-reduced-motion`.
- Dark mode palaikomas ir saugomas tarp sesijų.

## Mikro-audito praktikos (geriausios praktikos)

### 1) Heuristinis karkasas

Naudoti NN/g 10 heuristikų rinkinį kaip bazinį filtrą:

- Sistemos būsenos matomumas.
- Atitikimas vartotojo kalbai ir mentaliniam modeliui.
- Kontrolė ir laisvė (undo/clear/exit).
- Nuoseklumas ir standartai.
- Klaidos prevencija.
- Atpažinimas vietoje atminties apkrovos.
- Lankstumas ir efektyvumas.
- Minimalistinė, tikslą palaikanti sąsaja.
- Klaidos atpažinimas ir atsistatymas.
- Kontekstinė pagalba.

### 2) Vertinimo procesas (NN/g rekomenduojamas)

- 3-5 nepriklausomi vertintojai (ne vienas).
- Vienas siauras scope (vienas kritinis srautas).
- 1-2 val. timebox vertintojui.
- Tik po individualaus vertinimo vykdyti konsolidaciją.

### 3) Formų ir klaidų praktikos

- Mažinti laukų trintį (field economy, aiški prioritetinė seka).
- Vengti sudėtingų daugiasluoksnių sprendimų ten, kur reikia greito completion.
- Klaidas rodyti aiškiai ir prie lauko, su suprantamu taisymo veiksmu.
- Užtikrinti kontrastą ir semantinį klaidų susiejimą (`aria-describedby`, `Error` modelis).

### 4) A11y ir patikimumo praktikos

- Orientuotis į WCAG 2.2 AA (kontrastas, keyboard flow, focus order, status message).
- Nenaikinti turimų `focus-visible` ir skip-link mechanizmų.
- Prieš release tikrinti realų first-run scenarijų mobiliuose pločiuose (320-375px).

## Pritaikytas audito procesas komandai

1. **Orchestrator**: patvirtina scope (`first-run copy success`) ir sėkmės metrikas.
2. **UI/UX agentas**: atlieka heuristinį perėjimą ir sužymi KISS/MARRY/KILL.
3. **QA agentas**: tikrina įgyvendinimą (`npm test`, a11y smoke, copy flow, mobile).
4. **Orchestrator**: prioretizuoja 30/60/90 į backlog (`todo.md`, `roadmap.md`).
5. **Release gate**: dokumentacija + testavimo žurnalas prieš deploy.

## KISS-MARRY-KILL planas (pritaikyta kodų bazei)

## KISS (laikyti ir saugoti)

- **Live output panelė**: real-time prompto generacija + simbolių skaitiklis (`generator.js`).
- **Trijų lygių gylio modelis**: aiškus ir vertingas sprendimų kontekste.
- **Sesijų mechanika**: išsaugojimas ir greitas atstatymas (`MAX_SESSIONS`, keyboard load).
- **A11y pamatas**: skip link, focus-visible, `aria-live` pranešimai, reduced motion.
- **Open-only AI launcher logika**: aiškus saugumo modelis su host allowlist.

## MARRY (investuoti, didžiausias ROI)

- **Vienas aiškus completion kelias po kopijavimo**: po `KOPIJUOTI PROMPTĄ IR ANALIZUOTI` parodyti "Next step" bloką (pvz., "1. Atidaryk įrankį, 2. Įklijuok, 3. Paleisk, 4. Grįžk su rezultatu").
- **Formos kokybės signalai**: įvesti "pakankamo užpildymo" indikatorių (pvz., checklist/progreso juosta) pagal aktyvų režimą.
- **Terminų supaprastinimas pradedančiajam**: kontekstinė mikro-pagalba prie sudėtingesnių laukų (`veikimo rezervas`, `pardavimų eilė`).
- **Klaidos/validacijos patternas**: jei įvedami netipiniai formatai, rodyti aiškų inline taisymo nurodymą.
- **Mobili prioritetinė tvarka**: užtikrinti, kad mobile pirmiausia matytų completion veiksmą ir tik tada papildomas pasirinktis.

## KILL (šalinti, jungti arba silpninti)

- **Perteklinė veiksmų konkurencija vienoje zonoje**: kai vartotojas dar negeneravo kokybiško prompto, mažinti antrinių veiksmų vizualų svorį.
- **Dubliuojamos trumpos instrukcijos**: sujungti panašias helper žinutes į vieną aiškų "ką daryti dabar" bloką.
- **Pseudo-žingsnių netikslumas hero dalyje**: jei žingsniai neatsinaujina pagal progresą, mažinti jų "aktyvaus vedlio" įspūdį arba paversti tikru progress komponentu.

## 30/60/90 įgyvendinimo planas

### 0-30 dienų (Quick wins)

- Įvesti po-kopijavimo "next step" mikro-scenarijų.
- Sutvarkyti pagalbos tekstų nuoseklumą pagal "aišku non-tech vartotojui".
- Sumažinti antrinių CTA vizualinį triukšmą output zonoje.
- Pridėti mini completion signalą (minimali versija).

### 31-60 dienų (Mid-term UX)

- Įdiegti režimo pagrindu veikiantį formos pilnumo scoring.
- Įdiegti validacijos patterną su aiškiu klaidos taisymu.
- Atnaujinti hero žingsnius į realų progress modelį arba neutralų informacinį variantą.

### 61-90 dienų (Stabilizacija ir scale)

- Atlikti pakartotinį mikro-auditą su 3-5 vertintojais.
- Palyginti KPI prieš/po ir patvirtinti, kas pereina į "standard pattern".
- Užfiksuoti design sprendimus docs, kad nebūtų regresijų.

## KPI ir sėkmės metrikos

- **Copy Success Rate**: `% sesijų, kuriose įvyksta prompto kopijavimas`.
- **Time to First Success**: laikas nuo atidarymo iki pirmo kopijavimo.
- **Form Completion Quality**: `% sesijų su pakankamai užpildytais laukais`.
- **Return-to-Session Rate**: `% vartotojų, grįžtančių prie išsaugotos sesijos`.
- **Mobile Completion Rate**: copy success rodiklis mobiliuose pločiuose.

## Validavimo checklist (prieš release)

### Funkcinis

- Veikia mode/depth perjungimai ir prompto persigeneravimas.
- Visi kopijavimo taškai veikia (`clipboard` + fallback).
- Sesijų išsaugojimas/užkrovimas/valymas veikia su klaviatūra ir pele.
- AI launcher mygtukai atidaro tik allowlist domenus.

### UX

- Pagrindinis CTA vizualiai pirmas pagal hierarchiją.
- Vartotojui aišku, ką daryti po kopijavimo (be interpretacijos).
- Formos pagalba trumpa, suprantama ir be vidinio žargono.

### A11y

- Focus tvarka logiška, `focus-visible` visur aiškiai matomas.
- Kontrastas atitinka WCAG 2.2 AA kritiniuose tekstuose ir CTA.
- `aria-live` pranešimai neperspaudžia ir yra informatyvūs.
- Mobile (320-375px) nėra horizontalaus scroll ir CTA nepersidengia.

### QA vartai

- `npm test` praeina.
- Rankinis smoke test: first-run kelias nuo hero iki kopijavimo.
- Jei keistas UX flow: atnaujinti `README.md`, `todo.md`, `roadmap.md`, `CHANGELOG.md`, `docs/TESTAVIMAS.md` pagal scope.

## Šaltiniai (internetinės gerosios praktikos)

- NN/g: 10 heuristikų ir heuristic evaluation procesas.
  - https://www.nngroup.com/articles/ten-usability-heuristics
  - https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/
- Baymard: formų trinties mažinimo praktikos.
  - https://baymard.com/blog/current-state-of-checkout-ux
  - https://baymard.com/blog/avoid-multi-column-forms
- GOV.UK Design System: validacijos ir klaidų patternai.
  - https://design-system.service.gov.uk/patterns/validation/
  - https://design-system.service.gov.uk/components/error-summary/
- WCAG 2.2 Quick Reference.
  - https://www.w3.org/WAI/WCAG22/quickref/
