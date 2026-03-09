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

## Kalbų architektūra (LT/EN) — Phase 2

- **Path-based locale:** `/lt/` ir `/en/` yra tikri statiniai puslapiai (pilnas app HTML), be client-side redirect. Locale sprendžiamas pirmiausia iš `pathname`, paskui iš query, `localStorage` ir naršyklės kalbos.
- **Vienas šaltinis, build:** root `index.html` yra šablonas; `npm run build` generuoja `lt/index.html` ir `en/index.html` su teisingais `lang`, title, meta, canonical, hreflang ir asset keliais. Prieš deploy paleisk `npm run build` (arba CI step).
- **Kalbos perjungiklis:** iš `/lt/` perjungus į EN atidaro `/en/` (ir atvirkščiai) su išsaugotu `mode`, `depth` ir hash.
- **Root:** `/` ir `index.html?lang=…` lieka kaip alternatyvus įėjimas (query/localStorage/navigator).
- Dinaminis turinys (`MODES`, `DEPTH_LEVELS`, `LIBRARY_PROMPTS`, `RULES`) valdomas viename šaltinyje `generator.js`.

## Build ir kokybės vartai

```bash
npm run build   # generuoja lt/index.html, en/index.html iš root index.html
npm test        # struktūra, lint
npm run test:smoke
npm run test:e2e
```

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
