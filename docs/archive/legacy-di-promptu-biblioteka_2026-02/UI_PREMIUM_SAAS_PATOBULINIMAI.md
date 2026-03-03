# C-level premium SaaS UI – ką dar galima patobulinti

**Tikslas:** Pakelti jau „premium“ UI į **C-level / enterprise SaaS** lygį – subtilūs judesiai, nuoseklus motion, skaitomumas, gylis, mikro-detalių.  
**Kontekstas:** STYLEGUIDE ir UI_AUDIT jau įvedė design tokenus, 1px border, shadow ritmą, CTA hierarchiją. Žemiau – **papildomi** patobulinimai be turinio/struktūros laužymo.

**Data:** 2026-02-26

---

## 1. Kas jau padaryta (pagrindas)

- Design tokenai: `--r-card`, `--r-btn`, `--r-badge`, `--r-hero`, `--shadow-soft/medium/elevated`, `--space-8`…`32`, 1px border.
- Hero: gradient + radial + grain, solid/glass CTA, hover/active, min-height 54px primary.
- Badge sistema: vienodi padding/height (40px), border-radius, letter-spacing.
- Progreso juosta, toast, code-block su left accent ir toolbar.
- `prefers-reduced-motion: reduce` – animacijos/transition sumažinami iki 0.01ms.
- Focus-visible 3px outline, WCAG AA kontrastas.

---

## 2. Motion ir laiko sistema (C-level polish)

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Trukmės tokenai** | `:root { --duration-fast: 150ms; --duration-normal: 250ms; --duration-slow: 400ms; --ease-out: cubic-bezier(0.33, 1, 0.68, 1); --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); }` | Vienodas „breathing“ ritmas – ne `0.2s ease` visur skirtingai. |
| **Progreso juosta – smooth fill** | `.progress-bar-fill { transition: width 0.5s var(--ease-out); }` (arba 0.6s) | Užbaigimo jausmas, ne staigus šuolis. |
| **Toast – entrance** | `transition: transform 0.35s var(--ease-out), opacity 0.3s ease;` + galima `transform: translateY(12px) → 0` su šiek tiek scale(0.98)→1 | „Atsiranda“, ne tik opacity. |
| **Kortelės hover** | Jau yra `transition: box-shadow 0.25s ease, transform 0.2s ease` – galima pakeisti į `var(--duration-normal) var(--ease-out)` | Nuoseklus motion system. |
| **Fazės užbaigimo „tick“** | Kai fazė pažymima atlikta – trumpa checkmark animacija arba progress bar trumpas „pulse“ (tik jei bus fazių statusai) | Rezultato patvirtinimas. |

**Riba:** Visur naudoti `prefers-reduced-motion: reduce` – transition-duration 0.01ms (jau yra globaliai).

---

## 3. Tipografija ir skaitomumas

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Ribotas teksto plotis (prompt)** | `.code-text` arba `.prompt-body` – `max-width: 72ch` arba 65ch (optional) su `margin: 0 auto` jei centruojama | Ilgas monospace tekstas skaitomesnis; C-level produktai riboja eilutės ilgį. |
| **Kintamasis line-height pagal kontekstą** | `:root { --leading-tight: 1.25; --leading-normal: 1.5; --leading-relaxed: 1.6; }` – antraštėms tight, body relaxed | Aiškesnė tipografinė hierarchija. |
| **Antraštės – tracking** | Hero h1: `letter-spacing: -0.02em`; sekcijų h2: `-0.01em` (jau -0.01em h1) | Šiek tiek „premium“ tankis dideliam tekstui. |
| **Kodo bloko teksto dydis** | `.code-text { font-size: 15px }` – galima 15px arba 16px su `line-height: 1.65` | Geriau skaitoma ilgesniam promptui. |

---

## 4. Gylis ir elevation (ne „flat“)

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Kortelė – subtilus inner highlight** | `.prompt` viršutinis kraštas: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.5)` (ant šviesaus fono) | Mažas „glass“ kraštas – depth be per didelio šešėlio. |
| **Code-block – depth** | Jau yra `inset 0 1px 2px rgba(0,0,0,0.02)` – galima pridėti labai švelnų `0 1px 0 rgba(255,255,255,0.6) inset` viršuje | Nuoseklus „pressed“ arba „raised“ jausmas. |
| **Sticky nav (būsimas)** | Kai bus fazių nav – `backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.85)`, `box-shadow: 0 1px 0 rgba(0,0,0,0.06)` | OS-level jausmas. |
| **Shadow hierarchy** | Nenaudoti >2 shadow sluoksnių viename elemente; laikytis tokenų (soft / medium / elevated) | Nuoseklumas > „stiprumas“. |

---

## 5. Mikro-interakcijos ir feedback

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Mygtukas – active state** | `.btn:active`, `.cta-button:active` – `transform: scale(0.98)` arba `translateY(1px)` (hero jau turi) | „Paspaudimo“ jausmas. |
| **Checkbox – focus ring** | `.prompt-done:focus-visible` – outline 2px arba 3px `var(--accent-gold)`, outline-offset 2px | Prieinamumas + vizualinis feedback. |
| **Copy success – trumpas „pulse“** | Mygtukas jau keičia tekstą į „Nukopijuota!“; galima pridėti `.btn.success` – `box-shadow: 0 0 0 2px var(--green)` (focus ring atspalvis) 0.3s | Aiškus sėkmės signalas. |
| **Link hover – underline** | Nuorodoms (footer, secondary): `text-underline-offset: 3px`, `transition: color 0.2s` (jei dar nėra) | Tvarkingas hover. |

---

## 6. Spalva ir kontrastas (subtilumas)

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Ne per ryškios borders** | Visur 1px – spalva `var(--border-subtle)` arba `--border-subtle-dark`; ne grynas `--border` ten, kur norima „lengvesnio“ bloko | Mažiau „rėmo“, daugiau turinio. |
| **Info box – švelnesnė** | `.info-box` – border jau `rgba(13,148,136,0.12)` – palikti; fonas galima `rgba(204,251,241,0.35)` jei norima dar švelniau | Nes konkuruoja su code-block. |
| **Progreso wrap** | Jau `--orange-light` + 2px accent – OK; galima border 1px + `--border-subtle` jei norima mažiau „rėmo“. | Nuoseklumas su kitomis kortelėmis. |

---

## 7. Responsive ir touch

| Patobulinimas | Kas | Kodėl premium |
|---------------|-----|----------------|
| **Touch targets** | Visi interaktyvūs ≥44px (jau min-height 44px daug kur) – patikrinti badge, .prompt-time, next-steps links | C-level = ir mobilius atitinka. |
| **Safe area** | `padding` su `env(safe-area-inset-bottom)` toast arba sticky CTA (jei bus) – telefonuose su notch | Nėra „nukirstų“ elementų. |
| **Scroll-behavior** | `html { scroll-behavior: smooth }` – jau yra; galima `scroll-padding-top` jei bus sticky nav (kad nepaslėptų antraštės) | Šokinėjimas į #block – antraštė matoma. |

---

## 8. Optional: „delight“ ir premium plus

| Patobulinimas | Kas | Pastaba |
|---------------|-----|----------|
| **Tooltip „Ką ši fazė duoda?“** | `title` arba custom tooltip ant fazės badge (trumpas 1 sakinys) | HR OS v2 – backlog; ne e-book. |
| **Light / Dark režimas** | `prefers-color-scheme: dark` + `:root` override arba toggle; atskiras scope | Didesnis darbas; atskiras iteracijos. |
| **Fokusuoto bloko „highlight“** | Kai vartotojas scroll'ina – aktyvi fazė su švelniu left border arba background tint | Priklauso nuo sticky nav / scroll spy. |
| **Skeleton / loading** | Jei būtų dinaminis turinys – skeleton; šiame projekte be API nereikia | N/A kol nėra async. |

---

## 9. Ko vengti (C-level = restraint)

- **Per stiprūs šešėliai** – laikytis tokenų (soft / medium / elevated).
- **Per daug animacijų** – 1–2 „hero“ momentai (toast, progress fill), likusiai subtilus transition.
- **Per daug spalvų** – viena akcentų šeima (žalia + tamsiai pilka + teal papildomai).
- **Skirtingi transition laikai** – naudoti `--duration-*` ir `--ease-*` visur.

---

## 10. Prioritetų eilė (įgyvendinimui)

| Eilė | Kategorija | Veiksmas | Pastanga |
|------|------------|----------|----------|
| 1 | Motion | Įvesti `--duration-*` ir `--ease-out`/`--ease-in-out`; progress bar fill 0.5s ease-out | Maža |
| 2 | Motion | Toast entrance – transform + opacity su ease-out | Maža |
| 3 | Tipografija | Ribotas `.code-text` max-width (pvz. 72ch) optional | Maža |
| 4 | Depth | Kortelė inset highlight (1px viršuje) – jei vizualiai tinka | Maža |
| 5 | Mikro | .btn.success – green focus ring 0.3s po copy | Maža |
| 6 | A11y | .prompt-done:focus-visible outline | Maža |
| 7 | Responsive | scroll-padding-top kai bus sticky nav; safe-area toast | Vidutinė |
| 8 | Optional | Fazės užbaigimo „tick“ animacija (kai bus fazių statusai) | Vidutinė |
| 9 | Optional | Dark mode / tooltip / aktyvios fazės highlight | Atskiras scope |

---

## 11. Susiję dokumentai

- [STYLEGUIDE.md](../STYLEGUIDE.md) – po pakeitimų atnaujinti tokenų skyrių (duration, ease)
- [docs/UI_AUDIT.md](UI_AUDIT.md) – pagrindinės problemos ir sprendimai
- [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) – CSS reikšmės gali keistis, struktūra/ID ne

---

**Paskutinis atnaujinimas:** 2026-02-26
