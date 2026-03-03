# DI ATRANKOS SISTEMA – LOW HANGING FRUITS: ANALIZĖ

**Tikslas:** Padaryti, kad puslapis atrodytų kaip **SISTEMA** (6 fazės), o ne promptų sąrašas.  
**Apimtis:** Tik struktūros refaktorius, be naujo turinio.

**Data:** 2026-02-26

---

## 1. KAS DABAR YRA (dabartinė struktūra)

| Sritis | Dabartinis turinys / struktūra |
|--------|-------------------------------|
| **Hero** | „DI atrankos sistema Personalo vadovui“, „Veikianti darbuotojų atrankos ir išlaikymo sistema vos per ~30 min“, CTA: „Pradėti“, „Prisijunk prie bendruomenės“ |
| **Objectives** | Sekcija „Ką ši sistema padeda išspręsti“ + 4 bullet'ai (nulinis srautas, netinkami žmonės, lėtas tempas, prarandami talentai) |
| **Instructions** | „Kaip naudoti šią biblioteką“, ~3–5 min per žingsnį, 5 žingsnių sąrašas (pasirink promptą, Kopijuoti/Ctrl+C, įklijuok, pakeisk laukus) |
| **Progress** | „Panaudojai 0 iš 10 promptų“, progress bar 0–10, „Puiku – panaudojai visus 10.“ |
| **Promptai** | 10× `<article class="prompt">` su `.number`, `.category`, `.prompt-title`, `.prompt-desc`, code-block, info-box, vienas mygtukas „Kopijuoti promptą“, checkbox „Pažymėjau kaip atlikau“ |
| **Next steps** | „Kas toliau?“ + 10 nuorodų į #block1 … #block10 |
| **Community** | „Nori daugiau? Prisijunk prie WhatsApp grupės“, 2 CTA |
| **Footer** | „Sėkmės atrankoje“, priminimas apie [laukus], nuoroda į Promptų anatomiją, tag'ai |

**Būtina išlaikyti (LEGACY_GOLDEN_STANDARD + testai):**

- `id="main-content"`, `progressText`, `progressBarFill`, `toast`, `hiddenTextarea`
- 10× `id="block1"`…`block10`, `id="prompt1"`…`prompt10`
- Mygtukai: `data-prompt-id="prompt1"`…`prompt10`, aria-label „Kopijuoti promptą N…“
- Checkbox: `data-prompt-id="1"`…`10`, localStorage `di_prompt_done_1`…`10`
- Funkcijos: `copyPrompt`, `selectText`, `updateProgressIndicator`, `handleCodeBlockKeydown`
- Struktūra: kiekvienas promptas – article.prompt → .prompt-header, .prompt-body (.code-block + .info-box), .prompt-footer (.btn + .prompt-done)

---

## 2. SUSIEJIMAS: 10 PROMPTŲ → 6 FAZĖS

| Fazė | Spec pavadinimas | Laikas (spec) | Dabartiniai promptai (pavadinimai) |
|------|------------------|---------------|------------------------------------|
| **1** | Diagnostika | ~5–10 min | 1. Kur stringame? |
| **2** | Profilis | ~5–10 min | 2. Koks žmogus mums iš tikrųjų tinka? |
| **3** | Pritraukimas | ~3–5 min | 3. Perrašyk darbo skelbimą paprastai · 4. Kaip šiandien rasti daugiau žmonių? |
| **4** | Atranka | ~5–10 min | 5. Kaip geriau pravesti pokalbį? · 6. Kodėl kandidatai atsisako? |
| **5** | Pasiūlymas | ~5 min | 7. Kaip geriau pristatyti pasiūlymą? |
| **6** | Išlaikymas | ~5–10 min | 8. Kaip padėti naujam žmogui pirmus 3 mėnesius? · (+ 9, 10 žr. žemiau) |

**Promptai 9 ir 10:**  
- 9. Kodėl žmonės išeina?  
- 10. Pagrindinis promptas (vienas viskam)  

**Variantai (be turinio plėtimo):**

- **A)** Laikyti 9 ir 10 fazėje 6 (Išlaikymas) kaip papildomus žingsnius tos pačios fazės.
- **B)** Laikyti kaip „Papildomi įrankiai“ po 6 fazių (viena maža sekcija, tas pats vizualas kaip promptai).
- **C)** Neslėpti: 6 fazių viršuje kaip „sistemos“ vaizdas, toliau – visi 10 blokų su fazių badge'ais (1–6), progresas „0 / 6 fazės“ skaičiuojamas pagal „fazė atlikta, jei visi jos promptai pažymėti“.

Rekomenduojama **C**: vizualiai 6 fazės (badge + trumpas aprašymas), kiekviena fazė atidaro/vadina į savo promptus; visi 10 blokų lieka, ID/JS nelaužomi; progresas „Sistema: X / 6 fazės“ – fazė laikoma atlikta, kai visi tos fazės promptų checkbox'ai pažymėti.

---

## 3. KĄ VERTA PANAUDOTI (prioritetas)

### 3.1 Hero reframe (be plėtimo)

- **Panaudoti:** Esamą hero bloką (gradient, badge'ai, .header-cta).
- **Pakeisti tik tekstą / nuorodas:**
  - H1: **„DI atrankos sistema HR vadovui“** (arba palikti „Personalo vadovui“ pagal toną).
  - P: **„Veikianti atrankos struktūra per ~30 min.“**
  - Pridėti **sąrašą 6 fazių** (1. Diagnostika … 6. Išlaikymas) – trumpi pavadinimai, viena eilutė arba dvi.
  - Pirminis CTA: **„Peržiūrėti sistemą“** → `#progressIndicator` arba pirmą fazę (pvz. `#block1` arba `#phase1`).
  - Antrinis CTA: „Prisijunk prie bendruomenės“ → `#community` (jau yra).

**Riba:** Nepridedame naujų skyrių tekste – tik perfrazuojame ir pridedame 6 fazių sąrašą į hero.

---

### 3.2 Instrukcija (sutrumpinta)

- **Panaudoti:** Esamą `<section class="instructions">` ir `id="instructions-title"`.
- **Pakeisti turinį į 4 žingsnius:**
  1. Atidaryk fazę  
  2. Nukopijuok promptą  
  3. Įklijuok į DI  
  4. Pakeisk [laukus]  

**Riba:** Nelaužome HTML struktūros (ol/li), tik keičiame tekstą.

---

### 3.3 Fazių struktūra (badge vietoj „1, 2, … 10“)

- **Panaudoti:** Esamus `<article class="prompt">` – nekeičiame skaičiaus (10) nei ID.
- **Pridėti:** Fazių kontekstą – pvz. `data-phase="1"` … `data-phase="6"` ant article arba wrapper.
- **Vizualas:**  
  - Vietoj vien tik `.number` (1…10) rodyti **fazės badge**: pvz. „🟢 FAZĖ 1 – DIAGNOSTIKA“ (arba tik „FAZĖ 1 – Diagnostika“ be emoji, priklausomai nuo STYLEGUIDE).  
  - Laikas: jau yra `.prompt-time` – galima suderinti su spec (~5–10 min ir kt.).  
  - „Atidaryti“ – dabartinis blokas jau „atidarytas“ (nėra accordion); jei vėliau darysime accordion, mygtukas „Atidaryti“ scroll'intų į atitinkamą bloką arba atidarytų sekciją.

**Riba:** Tas pats 10 article, tie patys block1–block10, prompt1–prompt10; pridėti tik data-phase + keisti .number/.category į fazių badge'us.

---

### 3.4 Akordeono struktūra (optional – didesnis pakeitimas)

- **Spec:** Paspaudus fazę – rodomas promptas, **vienas** mygtukas „Kopijuoti promptą“, be dubliavimo, be ilgų paaiškinimų.
- **Dabartinė būklė:** Kiekvienas promptas jau turi **vieną** „Kopijuoti promptą“ mygtuką; code-block turi savo „Kopijuoti“ (toolbar) – tai gali būti laikoma dubliavimu.
- **Ką panaudoti:**  
  - Jei accordion: fazės 1–6 kaip antraštės; atidarius fazę – viduje 1 arba 2 promptai (ta pati article.prompt struktūra).  
  - Vienas aiškus mygtukas: palikti tik .btn „Kopijuoti promptą“; code-block toolbar tekstą „Kopijuoti“ galima palikti (a11y) arba sutrumpinti į ikoną, kad vizualiai būtų vienas „Kopijuoti promptą“ veiksmas.
- **Riba:** Be turinio plėtimo – accordion tik slėpia/rodo esamus blokus; jei accordion per daug keičia DOM/testus, galima **atidėti** ir tik sutvarkyti vizualą (vienas ryškiausias CTA – „Kopijuoti promptą“).

---

### 3.5 Progreso indikatorius

- **Panaudoti:** Tą patį `#progressIndicator`, `#progressText`, `#progressBarFill`, `.progress-bar` (aria-valuenow/min/max ir aria-label).
- **Pakeisti:**  
  - Tekstas: iš „Panaudojai 0 iš 10 promptų“ → **„Sistema: 0 / 6 fazės“** (ir atitinkamai „Sistema: 6 / 6 fazės“ arba „Puiku – atlikai visas 6 fazes.“).  
  - Logika: fazė laikoma atlikta, kai **visi** tos fazės promptų checkbox'ai pažymėti. Pvz. fazė 3 = promptai 3, 4; fazė 4 = 5, 6; fazė 6 = 8 (arba 8,9,10 jei 9–10 priskiriame fazei 6).  
  - Bar: `aria-valuemax="6"`, fill = (atliktų fazių skaičius) / 6 * 100%, aria-label „Progresas: X iš 6 fazių“.

**Riba:** JS keičiamas tik progresui (skaičiuoti atliktas fazes pagal checkbox'us); localStorage ir checkbox'ai lieka pagal promptą (1–10).

---

### 3.6 Finalinis blokas (minimalus)

- **Panaudoti:** Esamą `next-steps` ir/arba `community` + `footer`.
- **Pakeisti:**  
  - Prieš community: trumpas blokas **„Sistema sukurta“** – „Tu turi veikiančią atrankos struktūrą.“  
  - CTA: „Prisijungti prie bendruomenės“ (→ #community arba WhatsApp), „Plėsti HR OS“ (→ anatomija arba išorinė nuoroda).  
- **Riba:** Nebe „Kas toliau?“ su 10 nuorodomis; vietoj to – vienas trumpas „Sistema sukurta“ + 2 CTA. Nuorodas į #block1…10 galima perkelti į hero („Peržiūrėti sistemą“) arba pašalinti, jei fazės viršuje aiškiai veda į turinį.

---

## 4. EFEKTAS (santrauka)

- **Nebelieka:** Ilgo scroll į 10 atskirų „užduočių“ jausmo, „10 promptų“ / „bibliotekos“ įspūdžio viršuje.
- **Atsiranda:** 6 fazių naratyvas, progresas „0 / 6 fazės“, hero su „Peržiūrėti sistemą“, trumpa instrukcija, minimalus uždarymo blokas „Sistema sukurta“.

**Turinys nepadidėja; suvokimas – kad tai mini HR OS (procesas), o ne promptų sąrašas.**

---

## 5. PRIORITETŲ EILĖ (įgyvendinimui)

1. **Hero reframe** – tekstas + 6 fazių sąrašas + CTA „Peržiūrėti sistemą“ (mažai rizikos).
2. **Instrukcija** – sutrumpinti iki 4 žingsnių (tik turinys).
3. **Progreso indikatorius** – „Sistema: X / 6 fazės“, JS skaičiuoja fazes (reikia phase→prompts map).
4. **Fazių badge** – data-phase + vizualas „FAZĖ N – Pavadinimas“ (CSS + minimalūs HTML pakeitimai).
5. **Finalinis blokas** – „Sistema sukurta“ + 2 CTA; next-steps supaprastinti arba pašalinti.
6. **Akordeonas** (optional) – tik jei norima sumažinti vizualinį triukšmą; reikia susitarti dėl testų (10 block/prompt ID vis tiek turi egzistuoti).

---

## 6. SAUGUMAS TESTAMS IR GOLDEN STANDARD

- **Struktūros testas** (`tests/structure.test.js`): tikrina 10× promptN, blockN, ≥10 mygtukų „Kopijuoti promptą“, ≥10 .code-block, ≥10 .prompt-done, progressText, progressBarFill, toast, main-content, copyPrompt/selectText, localStorage, hiddenTextarea.  
  Jei progreso tekstas keičiamas į „Sistema: X / 6 fazės“, testas **netikrina** to teksto – tik elementų buvimą. Jei vėliau būtų accordion, **visi 10 blokų turi likti DOM'e** (gali būti hidden), kad testai nepultų.
- **LEGACY_GOLDEN_STANDARD:** Atnaujinti po refaktorius: progressText/aria-label aprašymą („Sistema: 0 / 6 fazės“, „Progresas: 0 iš 6 fazių“), hero teksto pakeitimus, next-steps/footer pakeitimus, ir – jei pridedami – data-phase, fazių badge klasės.

---

## 7. HR OS v2 – UX SISTEMINIMO PLANAS (ką dar verta įtraukti)

**Šaltinis:** DI ATRANKOS SISTEMA – UX SISTEMINIMO PLANAS (HR OS v2).  
**Principas:** Sistema UX prasme = **kur jis yra** + **ką jau padarė** + **kas bus toliau** + **koks galutinis rezultatas**.  
**Riba:** Be turinio plėtimo – tik struktūra, progresas ir kontrolė.

Žemiau – HR OS v2 punktai, susiejimas su esama analize ir rekomendacija: įtraukti / atidėti / premium.

---

### 7.1 Sticky fazių navigacija (OS jausmas)

| Spec | Vertinimas |
|------|------------|
| **Kas:** Viršuje sticky: Diagnostika → Profilis → … → Išlaikymas. Aktyvi fazė paryškinta + progress. | **Verta įtraukti** (2 eilė po LHF). |
| **Kodėl:** Greitas šokinėjimas, matoma struktūra, „sistema“ jaučiasi. | |
| **Priklausomybės:** Reikia fazių map (block1→fazė1 ir t.t.), scroll spy arba „aktyvi“ būsena pagal scroll/viewport. | |
| **Riba:** Nepridedame naujo turinio – tik 6 žodžiai + nuorodos į #phase1…#phase6 arba #blockX. | |

**Rekomendacija:** Įtraukti po to, kai jau veikia fazių badge ir progresas „X / 6“. Sticky nav gali būti supaprastintas (tik nuorodos, be dropdown).

---

### 7.2 Mini dashboard viršuje

| Spec | Vertinimas |
|------|------------|
| **Kas:** Blokas po hero: „Sistema: 2 / 6 fazės baigtos“, „~15 min liko“. | **Verta įtraukti** (sujungiama su 3.5). |
| **Kodėl:** SaaS pojūtis, „ką jau padarė“ + „kas toliau“. | |
| **Įgyvendinimas:** Tas pats `#progressIndicator` – išplėsti tekstą: „Sistema: X / 6 fazės“ + papildoma eilutė „~Y min liko“ (apytikslis: (6−X)×~8 min arba pagal realias fazių trukmes). | |

**Rekomendacija:** Įtraukti kartu su progreso refactor (3.5). Viena eilutė „~N min liko“ – maža rizika.

---

### 7.3 Fazės statusai (🟢 Atlikta / 🔵 Aktyvi / ⚪ Neatidaryta)

| Spec | Vertinimas |
|------|------------|
| **Kas:** Kiekviena fazė turi būseną; būsenos saugomos localStorage. | **Verta įtraukti** (workflow sistema). |
| **Kodėl:** „Kur jis yra“ + „ką jau padarė“. | |
| **Priklausomybės:** Jau turime `di_prompt_done_1`…`10` – fazės „atlikta“ gali būti išvesta iš to (visi tos fazės promptai pažymėti). „Aktyvi“ = paskutinė atidaryta/scroll'inta; „neatidaryta“ = default. | |
| **Riba:** Naujas raktas pvz. `di_phase_active` (fazės nr.) arba išvesti iš scroll – be naujo turinio. | |

**Rekomendacija:** Įtraukti po sticky nav arba kartu su juo. Badge'uose rodyti spalvą/ikoną pagal būseną (atlikta / aktyvi / neatidaryta).

---

### 7.4 Akordeono principas

| Spec | Vertinimas |
|------|------------|
| **Kas:** Fazė rodo tik pavadinimą + trukmę; atsidaro paspaudus; vienas mygtukas „Kopijuoti promptą“. | Jau aptarta **3.4**; **optional**, didesnis pakeitimas. |
| **Riba:** Visi 10 blokų lieka DOM'e (hidden atidarius), kad testai nepultų. | |

**Rekomendacija:** LHF – tik vienas aiškus CTA (be dubliavimo). Pilną accordion daryti po sticky nav + dashboard + statusų.

---

### 7.5 „Kitas žingsnis“ mechanika

| Spec | Vertinimas |
|------|------------|
| **Kas:** Po promptu: [Pažymėti kaip atlikta] [→ Eiti į kitą fazę]. Paspaudus – uždaro seną, atidaro naują, scroll į viršų. | **Verta įtraukti** (sistema „juda“). |
| **Kodėl:** „Kas bus toliau“ – aiškus next step. | |
| **Įgyvendinimas:** Esamas checkbox „Pažymėjau kaip atlikau“ + naujas mygtukas „→ Kitas fazė“. Kitas fazė = pirmas neatliktas; scroll į tą fazę + jei accordion – atidaryti. | |

**Rekomendacija:** Įtraukti po fazių statusų (7.3) ir, jei bus, accordion (7.4). Be accordion – „Kitas fazė“ tik scroll'iną į kitą fazės bloką.

---

### 7.6 Mikro rezultato indikatorius

| Spec | Vertinimas |
|------|------------|
| **Kas:** Po kiekvienos fazės: ✔ Diagnostika sukurta, ✔ Kandidato profilis aiškus, … ✔ Adaptacijos planas paruoštas. | **Verta įtraukti** (artefaktai). |
| **Kodėl:** „Koks galutinis rezultatas“ – sistema kuria konkrečius dalykus. | |
| **Riba:** Tik 6 trumpi sakiniai, be turinio plėtimo. | |

**Rekomendacija:** Rodyti tik **atliktoms** fazėms (checkbox'ai). Pvz. po fazės header arba prie badge: „✔ Diagnostika sukurta“ – jei fazė 1 atlikta. Maža HTML/JS prieplauka.

---

### 7.7 Mini funnel schema hero dalyje

| Spec | Vertinimas |
|------|------------|
| **Kas:** Vienoje eilutėje: Problema → Profilis → Srautas → Atranka → Pasiūlymas → Išlaikymas (arba sutrumpintai). | **Verta įtraukti** (architektūra). |
| **Kodėl:** Hero jau reframe – šis funnel pakeičia arba papildo 6 fazių sąrašą viena trumpa eilute. | |

**Rekomendacija:** Įtraukti į hero reframe (3.1) – arba kaip 6 fazių sąrašą, arba kaip vieną eilutę su rodyklėmis (Problema → Profilis → …). Nesudėtinga.

---

### 7.8 Finalinis blokas (su PDF CTA)

| Spec | Vertinimas |
|------|------------|
| **Kas:** „Sistema sukurta“ + [Atsisiųsti mano atrankos sistemą PDF] [Prisijungti prie bendruomenės] [Plėsti HR OS]. | **Verta įtraukti** – PDF – **jei yra techninis sprendimas**. |
| **Riba:** Be turinio plėtimo – PDF = esamo puslapio / promptų eksportas (print-to-PDF arba generuotas PDF). | |

**Rekomendacija:** „Sistema sukurta“ + 2 CTA jau įtraukti (3.6). Trečią CTA „Atsisiųsti PDF“ pridėti tik jei sutarta: arba `window.print()` + „Išsaugoti kaip PDF“, arba serveris/generavimas – atskiras scope.

---

### 7.9 Premium UX (SaaS lygis)

| Spec | Vertinimas |
|------|------------|
| Smooth progress bar, fazės užbaigimo animacija, tooltip „Ką ši fazė duoda?“, Light/Dark, ribotas prompto plotis. | **Atidėti** – po pagrindinio sisteminimo. |
| **Riba:** Tooltip = trumpas tekstas (ne e-book). Dark mode ir animacijos – atskiras iteracijos. | |

**Rekomendacija:** Neįtraukti į pirmą sisteminimo release; užfiksuoti kaip „v2 polish“ arba „Premium UX“ backlog.

---

### 7.10 Ko nedaryti (bendri principai)

- ❌ Neplėsti teksto.  
- ❌ Nedaryti e-book tipo paaiškinimų.  
- ❌ Nedėti per daug CTA.  
- ❌ Nedaryti dar ilgesnio scroll.

**Sistema = struktūra + progresas + judėjimas + rezultatas.** Šiuos principus naudoti kaip filtru refactor ir naujoms funkcijoms.

---

## 8. ATNAUJINTA PRIORITETŲ EILĖ (LHF + HR OS v2)

| Eilė | Elementas | Šaltinis | Pastaba |
|------|-----------|----------|---------|
| 1 | Hero reframe + 6 fazės / mini funnel | 3.1, 7.7 | Tekstas, CTA „Peržiūrėti sistemą“. |
| 2 | Instrukcija 4 žingsniai | 3.2 | Tik turinys. |
| 3 | Progresas „Sistema: X / 6 fazės“ + „~N min liko“ | 3.5, 7.2 | Mini dashboard. |
| 4 | Fazių badge + data-phase | 3.3 | Vizualas. |
| 5 | Finalinis blokas „Sistema sukurta“ + 2 CTA | 3.6 | PDF CTA – jei sutarta (7.8). |
| 6 | Fazės statusai (atlikta / aktyvi / neatidaryta) | 7.3 | Badge spalva/ikona, localStorage. |
| 7 | Mikro rezultato indikatorius (✔ … sukurta) | 7.6 | Tik atliktoms fazėms. |
| 8 | Sticky fazių navigacija | 7.1 | Po 6–7. |
| 9 | „Kitas žingsnis“ mygtukas | 7.5 | Scroll į kitą fazę. |
| 10 | Akordeonas (optional) | 3.4, 7.4 | Didesnis pakeitimas. |
| — | Premium UX (smooth bar, animacija, tooltip, dark) | 7.9 | Backlog. |

---

**Paskutinis atnaujinimas:** 2026-02-26 (pridėtas HR OS v2 UX sisteminimo planas – 7, 8)
