# Mobile UI/UX tobulinimo planas – hierarchija ir fokusavimas

**Data:** 2026-03  
**Apimtis:** Tik mobile (max-width: 768px / 480px). Nelaužome kodo – tik CSS ir mikro copy.

---

## Esmė

Čia ne struktūros problema, o **hierarchijos ir fokusavimo** problema. Mobile ekrane turi būti **1 aiškus kelias**. Dabar vartotojui rodomi keli vienodai „garsūs“ elementai – režimai, analizės gylis, keli CTA, šablonas. Tai sklaido dėmesį.

**Tikslas:** Premium SaaS mobile = mažiau spalvos, daugiau kontrasto. Vienas pagrindinis sprendimas per ekraną.

---

## 8 problemų ir sprendimų santrauka

| # | Problema | Sprendimas |
|---|----------|------------|
| 1 | Per daug vizualiai „sunkių“ violetinių blokų | Vienas pagrindinis violetinis CTA. Režimai ir analizės gylis – neutralūs, aktyvus tik subtle border + background tint. Analizės blokui sumažinta saturacija. |
| 2 | „Analizės gylis“ atrodo kaip atskiras produktas | Segmented control: viena eilutė „Greita \| Gilu \| Valdybai“, be didelio kortelės background. |
| 3 | Dvi pagrindinės CTA konkuruoja | Mobile – vienas primary CTA. „Rinktis šabloną“ – secondary (ghost/outline, mažesnis). |
| 4 | Per daug vertikalaus oro tarp žingsnių | Sumažinti padding ~20–25%, compact stepper arba horizontalus progress viršuje. |
| 5 | Badge „Spin-off Nr. 5“ ir „Promptų anatomija“ triukšmas | Mažesnis font, mažiau kontrasto, arba tik vienas badge. |
| 6 | Mikro copy per ilgas | „Nežinai, nuo ko pradėti? Rinkis „Greita“.“ → „Nežinai? Rinkis Greita.“ |
| 7 | Shadow sistema per stipri | Mažesnis blur/opacity; soft elevation, ne glow. |
| 8 | Hierarchijos tvarka | Siekti: Hero → Režimas → Analizės gylis (inline) → Forma → CTA. Mažiau „kortelių“. |

---

## TOP 5 pataisos (didžiausias efektas)

1. **Vienas primary CTA per ekraną** – tik „Gauti savaitės prioritetus“ vizualiai stiprus; „Rinktis šabloną“ – secondary.
2. **Analizės gylis – inline, ne atskira kortelė** – segmented control, neutralus fonas.
3. **Sumažinti violetinės spalvos kiekį** – režimai ir gylis aktyvūs su border + tint, ne pilnas violetinis.
4. **Sumažinti vertical padding step sekcijoje** – ekonomiškesnis scroll.
5. **Supaprastinti badge triukšmą** – mažesnis font, mažesnis kontrastas.

---

## Įgyvendinimo statusas

- [x] **1 primary CTA** – mobile: outline CTA ghost stilius (mažesnis, šviesesnis).
- [x] **Analizės gylis inline** – mobile: neutralus fonas, mažesnis padding, segmented išvaizda.
- [x] **Mažiau violet** – mobile: režimai ir gylis aktyvūs su border + tint.
- [x] **Step padding** – mobile: sumažintas žingsnių gap/padding.
- [x] **Horizontalus progress (mobile)** – žingsniai kaip horizontalus stepperis: numeriai 1–4 viršuje, etiketės (Režimas, Forma, Rezultatas, Biblioteka) apačioje, jungianti linija tarp žingsnių.
- [x] **Badge** – mobile: tik „Promptų anatomija“; „Spin-off Nr. 5“ paslėptas (apačioje nurodyta). Mažesnis font, šviesesnis stilius.
- [x] **Mikro copy** – „Nežinai? Rinkis Greita.“
- [x] **Shadows** – mobile: suminkštinti šešėliai.
- [ ] **Hierarchijos tvarka (8)** – reikia sprendimo: ar keisti DOM eilę (Režimas → Gylis → Forma)? Gali paveikti anchor ir JS.

---

## Klausimai tolesniam darbui

1. **Hierarchijos eilė:** Ar norite, kad mobile būtų vizualiai/struktūriškai „Režimas → Analizės gylis (inline) → Forma → CTA“? Tai gali reikalauti HTML eilės keitimo arba CSS order – ar anchor `#operationsCenter` ir scroll turi likti kaip dabar?

2. **Vienas badge:** Ar palikti tik vieną badge (pvz. „Spin-off Nr. 5“) ir „Promptų anatomija“ perkelti į footer / mažesnę nuorodą?

3. **Stepper vs horizontal progress:** Ar norite viršuje horizontalų progress indicator (1–2–3–4) vietoj dabartinių pill žingsnių, kad sutaupytumėte vertikalios vietos?

4. **Desktop:** Ar visi šie pakeitimai tik mobile, ar norite atitiktų tonų (mažiau violetų, vienas CTA) ir desktop hero?

5. **A/B arba matavimas:** Ar planuojate matuoti konversiją / laiką iki pirmo CTA paspaudimo prieš ir po pakeitimų?

---

## Nuorodos

- Aktyvus UI standartas: [README.md#golden-standard-ui](../README.md#golden-standard-ui).
- Todo: [todo.md](../todo.md).
