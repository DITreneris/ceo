# Mobile UI/UX auditas – Personalas (HR atrankos promptai)

**Data:** 2026-02-26  
**Apimtis:** index.html – responsive breakpoints, touch targets, skaitomumas, vartotojo kelionė mobilėje.

---

## 1. Kas jau gerai

| Sritis | Būsena |
|--------|--------|
| **Viewport** | `width=device-width, initial-scale=1.0` – teisingai |
| **Touch targets** | Dauguma mygtukų/ nuorodų turi `min-height: 44px` (WCAG/Apple rekomendacija) |
| **Breakpoints** | Nuoseklūs: 1024px, 768px, 480px, 375px |
| **Horizontal scroll** | Code-block: `overflow-x: auto`, `-webkit-overflow-scrolling: touch` |
| **Reduced motion** | `prefers-reduced-motion: reduce` – animacijos sumažinamos |
| **Kopijavimo flow** | Veikia be pasirinkimo: mygtukas kopijuoja pagal `data-prompt-id` |
| **Skip link** | Yra „Pereiti prie turinio“ – prieinamumui |

---

## 2. Problemos ir rekomendacijos

### 2.1 Touch targets ir tarpai

| Elementas | Problema | Rekomendacija |
|-----------|----------|----------------|
| **Checkbox „Pažymėjau kaip atlikau“** | Pati varnelė ~22×22px (< 44px). Label didina paspaudimo zoną, bet vizualiai maža. | Padidinti checkbox iki bent 24×24px mobilėje arba pridėti `padding` į tėvinį label, kad tap area būtų ≥44px. |
| **Code-block toolbar** | `pointer-events: none` – ant mobilės nepaspaudžiama; tik informacinė. | Palikti kaip yra (toolbar – hint), arba mobilėje rodyti „Kopijuoti“ kaip matomą mygtuką virš bloko. |
| **„Kas toliau?“ nuorodos** | 375px: `padding: 12px 14px`, `font-size: 14px` – gali būti ankštos. | Patikrinti 320px plotį; jei dvi nuorodos eina į vieną eilutę – riboti `min-width` arba leisti laisvai lūžti. |
| **Header badges** | Ant labai siauro ekrano (320px) gali persidengti ar per daug suspausti. | 375px ir mažiau: `flex-wrap`, `gap`; gal `badge` font-size 11px. |

### 2.2 Skaitomumas ir tipografika

| Elementas | Problema | Rekomendacija |
|-----------|----------|----------------|
| **Code-block tekstas** | 375px: `font-size: 13px` – riba skaitomumui (WCAG siūlo ≥16px body). | Mobilėje palikti 14px minimum (768px jau 14px); 375px ne mažinti iki 13px arba naudoti tik labai trumpiems eilutėms. |
| **Instructions antraštė** | `display: flex` su ikona + tekstas + `prompt-time` – ant siauro ekrano gali suspaustis. | 480px/375px: `flex-wrap: wrap`; `prompt-time` antra eilute arba mažesnis šriftas. |
| **Hero H1** | 480px: 28px; 375px: 24px – priimtina, bet 24px labai mažas ekranams. | 375px: ne mažinti žemiau 24px; užtikrinti `line-height` ~1.2. |

### 2.3 Layout ir tarpai

| Elementas | Problema | Rekomendacija |
|-----------|----------|----------------|
| **Hero CTA** | 480px: CTA stulpelyje, `max-width: 280px` – centruota. | Įsitikinti, kad ant 320px mygtukai neperžengia ekrano (padding 16px + 280px + 16px = 312px – ok). |
| **Modal** | `max-height: 90vh`, `align-items: flex-end` – pusė ekrano. | Gerai; pridėti `env(safe-area-inset-bottom)` jei naudojami įrenginiai su „notch“. |
| **Toast** | `left: 12px; right: 12px; bottom: 16px` (375px). | Pridėti `padding-bottom: env(safe-area-inset-bottom)` kad neįsiliestų į home indicator. |

### 2.4 Safe area (notch / home indicator)

| Problema | Rekomendacija |
|-----------|----------------|
| Nėra `env(safe-area-inset-*)` | Fiksuotiems elementams (toast, gal modal, footer) pridėti `padding-bottom: env(safe-area-inset-bottom)`; header – `padding-top: env(safe-area-inset-top)` jei full-bleed. |
| `viewport-fit=cover` neįjungtas | Jei norima naudoti edge-to-edge, `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`. |

### 2.5 Vartotojo kelionė (copy flow)

| Aspektas | Būsena | Rekomendacija |
|----------|--------|----------------|
| Tap ant code-block | Pasirinkimas (selectText) – naudingas desktop, ant mobilės gali būti neaišku. | Palikti; mygtukas „Kopijuoti promptą“ vis tiek kopijuoja be pasirinkimo – flow veikia. |
| Toast po kopijavimo | Rodomas 2–3 s. | Gerai; gal trumpai vibruoti (jei PWA) – neprivaloma. |
| Progresas (0/10) | Aiškus, localStorage. | Ok. |

### 2.6 Performance / UX smulkmenos

| Problema | Rekomendacija |
|-----------|----------------|
| Lucide ikonos | Užkraunamos iš CDN; pirmas piešimas gali truputį vėluoti. | Palikti; arba inline kritines SVG. |
| Ilgas puslapis | 10 promptų – daug scroll. | „Kas toliau?“ nuorodos jau padeda; gal sticky „Kopijuoti“ tik mobilėje – ne būtina. |
| Focus matomumas | `focus-visible` naudojamas. | Gerai; mobilėje focus retas, bet klaviatūra/AT palaikymui svarbu. |

---

## 3. Tobulinimo planas (prioritetai)

### P1 – Greiti pataisymai (nelaužant kodo)

1. **Toast / fiksuoti elementai:** Pridėti `padding-bottom: env(safe-area-inset-bottom)` toast ir, jei reikia, footer.
2. **Viewport (neprivaloma):** Pridėti `viewport-fit=cover` jei planuojama pilno ekrano išnaudojimas.
3. **Checkbox tap area:** Padidinti `.prompt-done-wrap` tap area mobilėje (pvz. `min-height: 44px`, `padding`), checkbox vizualiai 24px arba didesnis.

### P2 – Skaitomumas ir layout

4. **Code-block šriftas:** 375px breakpoint ne mažinti iki 13px; palikti 14px (arba 13px tik jei eilutės labai trumpos).
5. **Instructions antraštė:** 480px ir žemiau – `flex-wrap: wrap` ant `.instructions-title`; `prompt-time` antra eilute arba mažesnis.
6. **„Kas toliau?“ nuorodos:** 320px – patikrinti, ar nuorodos ne per platos; jei reikia – `min-width: 0` arba trumpesnis tekstas.

### P3 – Nice-to-have

7. **Header badges:** 375px – `flex-wrap`, mažesnis `gap` arba `font-size` badge.
8. **Sticky CTA:** Mobilėje galimybė padaryti „Kopijuoti promptą“ matomą scroll metu (sticky) – tik jei naudinga metrikoms.
9. **PWA / install:** Jei reikia „Add to Home Screen“ – manifest + service worker ( atskiras scope).

---

## 4. Testavimo checklist (mobilė)

- [ ] 320px, 375px, 414px plotis – layout be horizontal scroll (išskyrus code-block jei ilgas tekstas).
- [ ] Touch: visi mygtukai ir nuorodos ≥44px aukščio/pločio.
- [ ] Copy flow: tap code-block → tap „Kopijuoti“ → toast; clipboard turi tekstą.
- [ ] Progresas: pažymėti „Pažymėjau“ – skaičius atnaujinamas; refresh – būsena išsaugota.
- [ ] Safe area: iPhone su notch – toast/footer ne po „home indicator“.
- [ ] Focus: tab per mygtukus/code-block – matomas focus ring.
- [ ] Reduced motion: įjungus OS – animacijos minimalios.

---

**Santrauka:** Pagrindas mobilėje geras (viewport, 44px targetai, breakpoints, copy flow). Prioritetas – safe area, checkbox tap area, code-block šrifto dydis 375px ir instructions antraštės wrap; likusieji – layout smulkmenos ir optional sticky/PWA.
