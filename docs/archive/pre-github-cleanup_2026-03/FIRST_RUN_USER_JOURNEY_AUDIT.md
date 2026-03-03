# Pirmo paleidimo vartotojo kelionės auditas

Tikslinis scenarijus: **pirmas apsilankymas -> sugeneruoti -> nukopijuoti užklausą (promptą)**.

## 1) Kelionės žemėlapis (esama būsena)

1. Vartotojas patenka į `index.html` ir mato hero bloką su CTA.
2. Pereina į `#operationsCenter`, pasirenka režimą ir gylį.
3. Užpildo pagrindinius laukus, promptas generuojamas realiu laiku (`opsOutput`).
4. Nukopijuoja promptą per vieną iš kopijavimo mygtukų.
5. Tęsia veiksmą išorėje (ChatGPT / Claude).

## 2) Trinties taškai ir naudos spragos

- CTA buvo labiau funkcinis nei naudos orientuotas (`Pradėti`).
- Trūko aiškaus "ką daryti toliau" po kopijavimo.
- Kai kurie terminai gali būti per techniniai pirmai sesijai (`Board-ready`, `Runway`).
- Produkto pavadinimas tarp failų buvo nenuoseklus (`DI Operacinis Centras` vs `DI Vaizdo Generatorius`); tai sutvarkyta dokumentacijos atnaujinimuose.
- Destruktyvus sesijų veiksmas turėjo nepakankamai aiškų tekstą (`Valyti`).

## 2.1) Feature -> rizika -> testavimo scope (mixed)

| Feature | Rizika | Testo sluoksnis |
|---|---|---|
| Režimai + gylis (`MASTER/DIENOS/SAVAITES`, `GREITA/GILU/BOARD`) | Neteisingas promptas ar neteisinga panelė | Smoke + E2E |
| Kopijavimas (`outputCopyBtn`, `outputCopyCta`, `stickyCopyBtn`) | Nepavyksta copy arba vartotojas negauna grįžtamojo ryšio | Smoke + E2E |
| Sesijos (`save/load/clear`) | Prarandamas kontekstas, neveikia grįžimas į sesiją | E2E |
| Accordion + hero žingsniai | Netvarkinga navigacija mobiliame ekrane | Smoke + E2E |
| Mobile layout 320–768 | Horizontal scroll, susispaudę CTA, sunkiai paspaudžiami mygtukai | Smoke + rankinis QA |
| A11y ir keyboard | Fokusas/navigacija neaiški arba stringa | E2E + rankinis QA |

## 3) Mikrocopy paketas (`current -> new`)

### `index.html`

- `Pradėti` -> `Pradėti generuoti promptą`
- `Šablonų biblioteka ↓` -> `Rinktis paruoštą šabloną ↓`
- Hero pastraipa apie "3 režimus" -> naudos orientuota pastraipa su 5 min. rezultatu
- Pridėta pagalbinė gylio žinutė: `Nežinai nuo ko pradėti? Rinkis „Greita“.`
- Output instrukcija:
  - `Nukopijuokite promptą ir įklijuokite...` -> `Nukopijuok promptą, įklijuok... ir paleisk analizę.`
- Output CTA:
  - `KOPIJUOTI PROMPTĄ` -> `KOPIJUOTI PROMPTĄ IR ANALIZUOTI`
- Sesijų mygtukas:
  - `Valyti` -> `Ištrinti sesijas`

### `README.md`

- Projekto pavadinimas ir aprašas perkelti iš "vaizdo generatoriaus" į "operacinį centrą".
- Įrankio paskirtis perrašyta į CEO/COO operacinių sprendimų kontekstą.

### `privatumas.html`

- Pavadinimai ir grįžimo nuorodos sulygintos su "DI Operacinis Centras".
- Patikslintas spin-off numeris ir paskirtis.
- `localStorage` aprašas atnaujintas pagal realų elgesį (tema, gylis, sesijos).

## 4) Didesni usability pakeitimai (aptarimui atskirai)

Prioritetinis backlogas:

1. **Tikras vedlys (wizard)** vietoje vizualinių žingsnių (didelis poveikis, vidutinė/aukšta apimtis).
2. **Kopijavimo veiksmų konsolidacija** į vieną aiškų primary CTA (vidutinis poveikis, vidutinė apimtis).
3. **Formos pilnumo signalai** (būtinų laukų indikacija / kokybės balas) prieš naudojimą (didelis poveikis, vidutinė apimtis).
4. **Po-kopijavimo būsena** su aiškiu "next step" bloku (vidutinis poveikis, maža/vidutinė apimtis).
5. **Šablonų bibliotekos atradimo stiprinimas** pirmam naudojimui (vidutinis poveikis, vidutinė apimtis).

## 5) QA vartai ir checklist

- Prieš merge: `npm ci` + `npm test`.
- Prieš merge: `npm run test:smoke` + `npm run test:e2e`.
- CI turi praeiti su pa11y patikra abiem puslapiams (`/` ir `/privatumas.html`).
- Prieš release: atnaujinti `CHANGELOG.md` pagal realų first-run pakeitimų scope.
- Po deploy: atlikti ir užfiksuoti smoke testą `docs/TESTAVIMAS.md`.

## 5.1) Mobile remediacijos prioritetai (320–768)

1. **P0** - pašalinti horizontal scroll riziką top nav, output/sessions ir accordion antraštėse.
2. **P0** - užtikrinti 44px touch target kritiniams mygtukams.
3. **P1** - pridėti aiškų `focus-visible` sesijų elementams ir pilną keyboard navigaciją mode/depth valdikliams.
4. **P1** - sutvarkyti accordion tankį mažame ekrane (`<=480`) ir sumažinti veiksmų konkurenciją output zonoje.

## 6) Kalbos kokybės standartas (LT)

- Vartotojui matomas tekstas rašomas lietuviškai, aiškiai ir lakoniškai.
- Žargonas keičiamas į suprantamus terminus (`runway` -> `veikimo rezervas`, `pipeline` -> `pardavimų eilė`).
- Paliekami tik būtini trumpiniai, kai jie įprasti verslo kontekste (`CEO`, `COO`, `LTV`, `CAC`).
- Kiekvienas CTA turi aiškų veiksmą ir naudą, be neaiškių bendrinių žodžių.

## 7) Diskretiški AI įrankių mygtukai

- Įdėta diskretiška `Atidaryti ChatGPT / Claude / Gemini` eilutė output zonoje po pagrindiniu kopijavimo CTA.
- Pirminis veiksmas (`KOPIJUOTI PROMPTĄ IR ANALIZUOTI`) išlieka prioritetinis, o įrankių mygtukai veikia kaip secondary.
- Elgsena yra `open-only`: mygtukai tik atidaro naują langą, be automatinio kopijavimo ar papildomų šalutinių veiksmų.
- Atidarymo logika apsaugota host allowlist principu (`chatgpt.com`, `claude.ai`, `gemini.google.com`).

### Smulkiems turinio pakeitimams

- Paleisti `npm test` (struktūra + HTML lint + JS lint).
- Patikrinti, kad nepasikeitė funkciniai `id`, `role`, `aria-*` atributai.
- Rankinis smoke test:
  - režimo/gylio perjungimas;
  - prompto generacija;
  - kopijavimo mygtukai;
  - nuoroda į `privatumas.html`.

### Didesniems usability pakeitimams

- Paleisti `npm test`.
- Paleisti pa11y pagal CI standartą (`/` ir `/privatumas.html`).
- Rankinis a11y testas:
  - klaviatūros navigacija ir `focus-visible`;
  - live region pranešimai (`toast`, `opsOutput`);
  - mobile viewport (320-375px) be horizontalaus scroll.
- Prieš release atnaujinti susijusią dokumentaciją (`README.md`, `CHANGELOG.md`, `docs/TESTAVIMAS.md` pagal scope).

## 8) Susijęs tęstinis auditas

- Detalus vykdymo modelis, KPI ir prioritetizavimas pagal `KISS-MARRY-KILL`:
  - `docs/UI_UX_MIKRO_AUDITAS_KISS_MARRY_KILL.md`
