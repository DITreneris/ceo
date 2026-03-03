# DI Promptų Biblioteka – stiliaus gidas (Spin-off Nr. 3)

**Versija:** 1.3  
**Data:** 2026-02-19  
**Kalba:** LT

Šis dokumentas aprašo spalvų gamą, tipografiją ir komponentų stilius projekte – Spin-off Nr. 3 (HR kasdienė atrankos sistema). Žalia pagrindinė paletė – CTA ir hero.

---

## 1. Spalvų paletė

### 1.1 Pagrindinės spalvos

| Kintamasis | Hex | Paskirtis | WCAG pastaba |
|------------|-----|-----------|--------------|
| `--bg` | `#F7F8FA` | Puslapio fonas | Tekstas `--text` ant jo atitinka AA |
| `--text` | `#1A202C` | Pagrindinis tekstas, antraštės | Kontrastas ant `--bg` > 4.5:1 |
| `--text-light` | `#4A5568` | Antrinis tekstas, meta | Kontrastas ant `--bg` > 4.5:1 |
| `--white` | `#FFFFFF` | Kortelių fonas, mygtukų tekstas | Naudoti ant tamsių fonų (ant žalios CTA atitinka AA) |

### 1.2 Akcentai (brand) – žalia CTA paletė

| Kintamasis | Hex | Paskirtis | Naudojimas |
|------------|-----|-----------|------------|
| `--accent-primary` | `#0E7A33` | Pagrindinė žalia (WCAG2AA 4.5:1) | CTA mygtukai, hero, progreso juosta |
| `--accent-primary-hover` | `#0B6B2D` | Tamsesnė žalia | Hover būsena CTA |
| `--accent-gold` | `#0E7A33` | Sutapatintas su primary žalia | Badge, focus ring, paryškinti elementai |
| `--accent-gold-dark` | `#0B6B2D` | Sutapatintas su accent-primary-hover | Hover, numerio badge |
| `--accent-dark` | `#3C485A` | Antrinis akcentas (tamsiai pilka) | Outline mygtukai, borders, antraštės |
| `--accent-dark-hover` | `#2D3848` | Hover būsena | Antrinių mygtukų hover |

**Kontrastas:** Ant žalios (`--accent-primary`, `--cta-bg`) naudoti **baltą tekstą** (`--white`) – atitinka WCAG AA. Ant `--accent-dark` – **baltas tekstas** (`--white`).

### 1.3 Tertiarinė (bibliotekos identitetas)

| Kintamasis | Hex | Paskirtis |
|------------|-----|-----------|
| `--tertiary` | `#0D9488` | Teal – kategorijos, „Kas toliau?“ blokas, info box |
| `--tertiary-dark` | `#0a5c54` | Tamsesnė teal – info-box strong, kategorija |
| `--tertiary-hover` | `#0f766e` | Hover būsena – next-steps nuorodos |
| `--tertiary-light` | `#CCFBF1` | Šviesus teal fonas |

### 1.4 Semantinės ir pagalbinės

| Kintamasis | Naudojimas |
|------------|------------|
| `--cta-bg` | `#0E7A33` – pagrindinis CTA fonas („Kopijuoti promptą“, kiti žali mygtukai); WCAG2AA 4.5:1 |
| `--cta-hover` | Sutapatintas su `--accent-primary-hover` (#0B6B2D) – CTA hover |
| `--cta-hero-bg` | `#FFFFFF` – hero pagrindinio CTA („Pradėti“) fonas – baltas, kad akys kristų per &lt;1 s |
| `--cta-hero-text` | `#0B6B2D` – hero pagrindinio CTA tekstas (žalias ant baltos) |
| `--cta-hero-hover-bg` | `#F0FDF4` – hero CTA hover fonas |
| `--blue` | Sutapatintas su `--accent-dark` (3C485A) – objektų rėmeliai, antraštės |
| `--blue-light` | `#E8ECF0` – šviesus fonas gradientuose |
| `--orange` | `#0E7A33` – pagrindinė žalia (suderinta su CTA, WCAG2AA) |
| `--orange-light` | `#ECFDF5` – šviesus žalios atspalvis (instrukcijos, progreso wrap, code-block hover) |
| `--green` | `#38A169` – sėkmės būsena (toast, checkbox, „Nukopijuota“) |
| `--green-dark` | `#2F855A` – btn.success hover |
| `--error` | `#E53E3E` – klaidos (form-input.error, form-error) |
| `--bg-subtle` | `#F7FAFC` – prompt-footer fonas |
| `--border` | `#CBD5E0` – rėmeliai, atskyrimai |
| `--community-cta-green` | `#0E7A33` – bendruomenės CTA (suderinta su žalia tema) |
| `--community-cta-green-hover` | `#0B6B2D` – hover būsena |

---

## 2. Design tokenai (premium SaaS nuoseklumas)

**Įvesti 2026-02-26.** Visi komponentai naudoja šiuos tokenus – vienoda „design system“ disciplina.

| Tokenas | Reikšmė | Paskirtis |
|---------|---------|-----------|
| `--r-card` | 16px | Kortelės, modal, footer |
| `--r-btn` | 12px | Mygtukai, code-block, info-box, progress-wrap, toast |
| `--r-badge` | 10px | Badge, chip, .number, .category, .prompt-time, .tag |
| `--r-hero` | 24px | Hero (header) border-radius |
| `--border-width` | 1px | Visi rėmeliai (hairline, ne 2–3px) |
| `--border-subtle` | rgba(203,213,224,0.6) | Šviesesni borderiai |
| `--border-subtle-dark` | rgba(60,72,90,0.15) | Tamsesni bet subtilūs |
| `--shadow-soft` | 2-lygio šešėlis | Kortelės, default elevation |
| `--shadow-medium` | 4px 16px | Hover, vidutinis |
| `--shadow-elevated` | 10px 30px | Hero, objectives, prompt hover – premium |
| `--shadow-card` | = --shadow-soft | Alias |
| `--shadow-card-hover` | = --shadow-medium | Alias |
| `--space-8` … `--space-32` | 8, 12, 16, 24, 32px | Tarpų ritmas |
| **Motion** | | |
| `--duration-fast` | 150ms | Greiti feedback (mygtukai) |
| `--duration-normal` | 250ms | Kortelės, hover, badge |
| `--duration-slow` | 400ms | Lėtesni perėjimai |
| `--ease-out` | cubic-bezier(0.33, 1, 0.68, 1) | Įėjimai, progress fill, toast |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Simetriški perėjimai |
| **Tipografija (leading)** | | |
| `--leading-tight` | 1.25 | Hero h1, antraštės |
| `--leading-normal` | 1.5 | Body, subtekstas |
| `--leading-relaxed` | 1.6 | Skaitomas tekstas, code-text |

**Principas:** Mažiau „rėmo“, daugiau „plokštumos“ – 1px border + vienas shadow token. Motion – vienodas „breathing“ ritmas; visur naudoti `var(--duration-*)` ir `var(--ease-out)` vietoj hardcoded `0.2s ease`. `prefers-reduced-motion: reduce` – globaliai 0.01ms. Badge/Chip – viena šeima: `min-height: 40px`, `padding: 10px 18px`, `font-size: 12–13px` (.badge, .number, .category, .prompt-time, .tag, .instructions code). Visi naudoja `--r-btn` (12px) arba `--r-badge` (10px); hardcoded 12px pakeisti į `var(--r-btn)`.

### 2.5 Ikonos (Lucide)

**Šaltinis:** [Lucide](https://lucide.dev/) – atviro kodo SVG ikonų rinkinys. Įkelta per CDN (`unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`). Elementai su atributu `data-lucide="icon-name"` po DOM užkrovimo pakeičiami į SVG (kvietimas `lucide.createIcons()`).

**Dydžiai (tokenai):** `--icon-size-sm` 16px, `--icon-size-md` 20px, `--icon-size-lg` 24px. Klasės: `.icon`, `.icon--sm`, `.icon--md`, `.icon--lg`. Ikona paveldi `stroke: currentColor`, todėl spalva pritaikoma iš konteksto.

**Naudojimas:** Dekoratyvinės ikonos – `aria-hidden="true"` (antroštės, info-box, tag’ai, toast). Mygtukuose prasmę nešia viena ikona – pakanka mygtuko `aria-label`. Dinamiškai įterpti elementai (pvz. showSuccess/showError) po innerHTML kviečia `lucide.createIcons({ root: element })`.

**Pavyzdžiai:** target (objectives), book-open (instructions), lightbulb / pencil (info-box), copy (mygtukai, code-block toolbar), check (toast, sėkmė), alert-triangle (klaida), rocket, users, book-marked, zap (footer).

---

## 3. Hero ir gradientai

- **Hero (header):** Premium depth – radial šviesa centre (`rgba(255,255,255,0.14)`), linear gradient 165deg, tamsesnis apatinis dešinys (radial overlay), 2–3% grain tekstūra. `--r-hero: 24px` border-radius.
  - `--hero-gradient-start: #1e6b42`, `--hero-gradient-mid: #2a7a52`, `--hero-gradient-end: #4a9572`.
- **Hero CTA:** Pagrindinis – **solid white** mygtukas, shadow + 1px inner border, hover scale(1.02). Antrinis – **glass** (border rgba white 0.4, background rgba white 0.08, backdrop-filter). Abu su micro-interaction.
- **CTA kitur puslapyje:** `--cta-bg: #0E7A33` (žalia), baltas tekstas; hover `--accent-primary-hover`. WCAG2AA 4.5:1.
- **Prompt kortelės header:** `linear-gradient(to right, var(--blue-light), var(--orange-light))`, apatinis border: `--accent-dark`.

---

## 4. Tipografija

- **Šeima:** `'Inter', -apple-system, sans-serif`
- **Kodas:** `'JetBrains Mono', monospace`
- **Pagrindinis teksto dydis:** 18px (body), 16–19px sekcijose
- **Antraštės:** 22–52px, svoris 700–800 (priklausomai nuo lygio)
- **Hierarchija:** h1 (hero) 52px/800, h2 (sekcijos) 22–32px/800, meta tekstas 13–15px/700
- **Letter-spacing:** hero h1 `-0.02em` (premium tankis), badge (caps) `0.1em` (daugiau oro)
- **Leading (line-height):** `--leading-tight` antraštėms, `--leading-relaxed` body/code-text. `.code-text` – `max-width: 72ch`, `line-height: 1.65` (skaitomumas)
- **En-dash:** skaičiuose be tarpų (pvz. 30–50%); subtekste su tarpais („…šablonais – rezultatai…“)

---

## 5. Komponentai

### 5.1 Mygtukai

- **Hero pagrindinis CTA („Pradėti“):** `background: var(--cta-hero-bg)` (#FFFFFF), `color: var(--cta-hero-text)` (#0B6B2D); **min-height: 54px**, **padding: 26px 36px**, font-size 18px – konversijai veikia „storumas“. Hover – šviesus žalias fonas. Vienintelis aiškiai dominuojantis veiksmas.
- **Hero antrinis CTA („Prisijunk prie bendruomenės“):** tas pats aukštis (54px), bet mažesnis šriftas (15px, 600), plonesnis rėmelis (1px), opacity 0.9 – vizualiai silpnesnis.
- **Pagrindinis (CTA) kitur:** `background: var(--cta-bg)` (žalia), `color: white`, `border-radius: 12px`, hover – `--cta-hover`, focus-visible – `outline 3px var(--accent-gold)`, `outline-offset: 2px`.
- **Sėkmės būsena:** `background: var(--green)` (pvz. „Nukopijuota“).
- **Antrinis (nuorodos „Kas toliau?“):** `background: var(--tertiary)`, hover `var(--tertiary-hover)`, focus-visible – žalio ringas.

### 5.2 Badge ir žymos

- **Hero badge:** pusiau skaidrus baltas fonas, baltas tekstas.
- **Kategorija (prompt kortelėje):** `background: var(--tertiary-light)`, `color/border: var(--tertiary)`.
- **Numeris (prompt kortelėje):** `background: var(--accent-gold)`, `color: var(--white)` (baltas tekstas ant žalios – WCAG AA).

### 5.3 Progreso juosta

- **Track:** `background: var(--border)`.
- **Užpildas:** `background: var(--accent-gold)`.
- **Wrap:** `background: var(--orange-light)`, `border: 2px solid var(--accent-gold)`.

### 5.4 Code block (PromptCard)

- **Border:** `var(--accent-dark)`.
- **Hover:** `background: var(--orange-light)`, `border-color: var(--accent-gold)`.
- **Focus-visible:** `outline 3px var(--accent-gold)`.
- **„Spausk čia ir nukopijuok“ etiketė:** `background: var(--accent-dark)`, baltas tekstas.

### 5.5 Info box

- **Fonas:** `var(--tertiary-light)`, **border ir antraštė:** `var(--tertiary)`.

### 5.6 Instrukcijų blokas

- **Fonas:** `var(--orange-light)`, **border:** `var(--accent-gold)`, numeracija ir code – žalios atspalviai, antraštė – `var(--accent-dark)`.

### 5.7 Bendruomenė (community) CTA

- **Hierarchija:** vienas pagrindinis CTA (WhatsApp), antrinis – outline („Promptų anatomija“). Jokio glow – tik subtilus šešėlis.
- **Pagrindinis CTA (`.community-cta-primary`):** žalia – `--community-cta-green: #0E7A33`, hover `--community-cta-green-hover: #0B6B2D`. Šešėlis: `0 6px 16px rgba(0,0,0,0.12)` (be glow). `border-radius: 12px`, font 18px / 600. Hover: `translateY(-1px)`. Focus-visible – `outline 3px var(--accent-gold)`, `outline-offset: 2px`.
- **Antrinis CTA (`.community-cta-secondary`):** outline stilius – `border: 2px solid var(--accent-dark)`, permatomas fonas, `margin-top: 16px`. Hover – šviesus fonas (`--blue-light`).
- **Kortelė:** `border: 1px solid var(--border)`, `border-radius: 16px`, šviesus šešėlis. Vertikalūs tarpai: h2 → 16px → subtext → 24px → primary CTA → 16px → secondary link.
- **Antraštė:** dvi eilutės („Nori daugiau?“ / „Prisijunk prie WhatsApp grupės.“) – mažesnis skaitymo tankis.

### 5.8 Border-radius ir tarpai (tokenai)

- **`--r-card` (18px):** hero, objectives, instructions, prompt, next-steps, community, modal, footer.
- **`--r-btn` (12px):** mygtukai (CTA, .btn), code-block, info-box, progress-wrap, toast, next-steps nuorodos, community CTA.
- **`--r-badge` (10px):** badge, .number, .category, .prompt-time, .tag.
- **Tarpai:** `--space-8` … `--space-32`. Sekcijų tarpas 24–32px, viduje 16–24px.
- **50%:** apvalūs elementai (modal-close, toast icon).

---

## 6. Prieinamumas (a11y)

- Visi interaktyvūs elementai turi **focus-visible** būseną (3px outline, dažniausiai `--accent-gold` arba `--accent-dark`).
- **Kontrastas:** Tekstas ant fonų atitinka WCAG AA (normalus tekstas ≥ 4.5:1).
- **Redukuotas judesys:** `@media (prefers-reduced-motion: reduce)` – animacijos ir perėjimai sumažinami iki 0.01ms.
- Skip link, ARIA atributai ir semantinė struktūra išlaikomi pagal projekto taisykles.

---

## 7. Failų nuorodos

- Spalvos ir komponentai implementuoti: [index.html](index.html) (CSS bloke, `:root` ir atitinkamos klasės).
- Planas: žr. planą „Promptų Anatomija spin-off UI/UX“ (spalvų gama, vizualika, prioritetai).

---

**Paskutinis atnaujinimas:** 2026-02-26 (Design tokenai, 1px border, badge sistema, CTA hierarchija; žr. [docs/UI_AUDIT.md](docs/UI_AUDIT.md))
