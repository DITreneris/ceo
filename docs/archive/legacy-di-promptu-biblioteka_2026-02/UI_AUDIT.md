# UI auditas – Premium SaaS jausmas (Spin-off Nr. 3)

**Data:** 2026-02-26  
**Tikslas:** Įvertinti, kas „laužia“ premium SaaS įvaizdį; sutvirtinti design system discipliną be perpiešimo.  
**Kontekstas:** Turinys ir struktūra OK. Reikia nuoseklumo – borderiai, šešėliai, badge sistema, CTA hierarchija, tipografikos ritmas.

---

## 1. Kas pirmiausia „laužia“ premium SaaS jausmą

| Problema | Kodo būsena (patvirtinta) | Jūsų vertinimas |
|----------|---------------------------|------------------|
| **Per sunkūs rėmeliai** | `.objectives` 3px, `.instructions` 3px, `.prompt` 3px, `.code-block` 3px, `.footer` 3px, `.form-input` 3px | ✓ Teisinga – atrodo „web form / intranetas“ |
| **Nenuosekli komponentų sistema** | Radius: 6–20px (badge 8, cta 12, modal 20, prompt 20, category 8, tag 10). Border: 1–3px. Shadow – skirtingi kiekvienam blokui | ✓ Teisinga – krenta „brand maturity“ |
| **Tipografikos ritmas** | line-height 1.1–2; body 1.6, h1 1.1, objectives li 1.6, code-text 2; tarpai 10–24px | ✓ Mažiau „polished“ – reikia vienodo ritmo |

**Žinia:** Turinys ir struktūra geri. Reikia **design system disciplinos**, ne perpiešimo.

---

## 2. Tiesi kritika (pagal ekranus)

### 2.1 Hero blokas (žalias viršus)

| Pastaba | Kodo būsena | Veiksmas |
|---------|-------------|----------|
| CTA pora atrodo kaip du vienodo svorio pasirinkimai | Primary (baltas) ir outline (1px border, opacity 0.9) – abu 54px aukščio | Primary ryškiai dominuoti; secondary – ghost/outline su mažesniu kontrastu |
| Trūksta premium detalių: hover/focus, „press“ | Hover yra (translateY -1px, shadow); active/press nėra | Pridėti `:active` scale arba translateY(0) |
| Chip'ai per plokšti | `.badge` 8px radius, skirtingi padding (9/18 vs 6/14), vienas su border, kitas be | Vienas chip komponentas: vienodas padding/height, border opacity, font-size |

### 2.2 „Ką ši sistema padeda išspręsti“ (objectives)

| Pastaba | Kodo būsena | Veiksmas |
|---------|-------------|----------|
| Border per storas ir tamsus | `border: 3px solid var(--accent-dark)` | 1px hairline + tas pats shadow token kaip kortelėms |
| Suspausti tarpai tarp eilučių | `margin-bottom: 10px`, `line-height: 1.6` | Padidinti margin tarp li (pvz. 12–14px), line-height 1.55–1.6 |

### 2.3 „Kaip naudoti šią biblioteką“ (instructions)

| Pastaba | Kodo būsena | Veiksmas |
|---------|-------------|----------|
| Border + fonas konkuruoja | `border: 3px solid var(--accent-gold)` | 1px + shadow token; fonas palikti, sumažinti border kontrastą |
| Inline `kbd` (Ctrl+C) skirtingi | `code` – 2px border, 4px 10px padding, 6px radius, 16px font | Vienas `.kbd` / `code` stilius: aukštis, padding, border, font-size |

### 2.4 Modulio kortelė („Kur stringame?“ ir kitos)

| Pastaba | Kodo būsena | Veiksmas |
|---------|-------------|----------|
| Ženkliukų stiliai skirtingi | `.number` (48×48, žalias), `.category` (teal, 2px border), `.prompt-time` (pilkas bg, 6px radius) | Viena badge sistema: vienodi padding/height, border opacity, font 12–13px |
| Prompto blokas – per ryškus rėmas | `border: 3px solid var(--accent-dark)` | 1px + švelnesnė spalva (opacity) |
| Tekstas kaip „textarea screenshot“ | Visas pre – monospace, line-height 2 | Monospace tik laukams [ ]; comfort spacing; vizualinis „toolbar“ (Copy) |

---

## 3. Geresnis variantas (be turinio/struktūros keitimo)

### A. Design tokenai (8–10)

- **Radius:** `--r-card: 18px`, `--r-btn: 12px`, `--r-badge: 999px` (arba 10px pill)
- **Border:** visur kortelėms 1px, ta pati paletė su mažesniu opacity (pvz. `--border-subtle`)
- **Shadow:** vienas 2-lygių tokenas kortelėms (subtilus)
- **Spacing:** vienas ritmas `8 | 12 | 16 | 24 | 32` (px)

### B. Kortelės: mažiau „rėmo“, daugiau „plokštumos“

- 1px border (šviesesnis)
- Lengvas shadow (token)
- Daugiau padding (24–28px)

### C. CTA hierarchija

- „Pradėti“ = solid, aiškūs hover/focus/active
- „Prisijunk prie bendruomenės“ = ghost/outline, mažesnis kontrastas

### D. Badge/Chip – viena šeima

- „PROMPTŲ ANATOMIJA“, „SPIN-OFF“, „PRADŽIA“, „~5–10 min“, „1“ – vienodi padding/height, border opacity, font-size (12–13px), kapitalizacija (arba visur caps, arba niekur)

### E. Prompt turinio blokas → „PromptCard“

- Švelnesnis border, šiek tiek kitoks fonas (tos pačios šeimos)
- Monospace tik ten, kur reikia (laukai [ ])
- Mini „toolbar“ viršuje (Kopijuoti / Copy ikonėlė) – SaaS tool jausmas

### F. Tipografika

- H1 (hero): OK
- Sekcijų antraštės: didesnis line-height
- Body: line-height ~1.5–1.6
- Sąrašams: tarp eilučių +2–4px, aiškus list rhythm

---

## 4. Veiksmų planas (įgyvendinamas etapais)

1. **Suvienodinti border:** 1px visoms kortelėms + sumažinti border kontrastą (opacity).
2. **Vienas shadow token** visoms kortelėms (hero wrap, objectives, instructions, prompt, code-block, footer).
3. **Badge/Chip komponentas** – vienas CSS šablonas visiems „pillams“ (hero badge, spinoff, category, prompt-time, number gali naudoti tą pačią bazę + modifikatorius).
4. **CTA hierarchija:** „Pradėti“ primary; „bendruomenė“ secondary (outline/ghost).
5. **Prompt blokas → PromptCard:** daugiau padding, švelnesnis border, optional mini toolbar viršuje.
6. **Spacing audit:** 24px tarp sekcijų, 16px viduje, 8–12px tarp eilučių.

---

## 5. Top 3 spąstai

1. **Per stiprūs šešėliai / gradientai** bandant padaryti „premium“ → 2018 „material“ jausmas. Laimi **subtilumas ir nuoseklumas**.
2. **Skirtingi komponentų aukščiai** (mygtukai, badge'ai, kbd) → net su geromis spalvomis atrodo „nebaigta“. **Vienodi aukščiai/padding** pagal tokenus.
3. **Per daug font weights** → laikyk 2 (pvz. 600 antraštėms, 400 tekstui) + vienas monospace inline.

---

## 6. Gilus UI auditas – vartotojo įžvalgos (2026-02-26)

### 6.1 Hero blokas
- **Brand presence:** OK (7.5/10) – spalva, vizualinis svoris, headline stiprus.
- **Depth / premium feel:** FAIL – per flat, nėra layerių; badge'ai kaip utilitariniai tagai, ne brand komponentai.
- **CTA zona:** FAIL – „Pradėti“ neturi power; secondary per silpnas; mygtukai per arti teksto; nėra hover dinamikos.
- **Spacing:** FAIL – per mažai oro tarp H1 → sub → CTA.

### 6.2 „Ką ši sistema padeda išspręsti“ (objectives)
- **Card vizualas:** FAIL – kaip Notion block, per pilkas fonas, nėra elevation.
- **Icon sistema:** FAIL – checkmark'ai template lygio, nėra svorio, nėra micro-depth.
- **Hierarchija:** OK bet silpna – skaitomumas geras, bet nėra premium ritmo.

### 6.3 „Kaip naudoti šią biblioteką“ (instructions)
- **Vizualinis svoris:** FAIL – blokas per lengvas; „3–5 min“ badge atsitiktinis.
- **List layout:** OK (8/10).
- **UI detalės:** FAIL – Ctrl+C badge kaip raw tag; nėra sisteminio UI kalbos vientisumo.

### 6.4 „Koks žmogus mums iš tikrųjų tinka?“ (prompt kortelė)
- **Prompt box:** FAIL (didžiausias) – kaip textarea, nėra charakterio, per daug default grey.
- **Info box:** OK / borderline FAIL – tvarkingas, bet enterprise lygiu per plokščias.
- **CTA „Kopijuoti promptą“:** OK bet ne premium – veikia, bet neturi dominance.
- **Checkbox zona:** FAIL – kaip admin panel, vizualiai atskirta silpnai.

### 6.5 Global UI sistema
- **Border radius:** FAIL – nėra vieningos sistemos pojūčio.
- **Shadow:** FAIL – arba beveik nėra, arba default.
- **Typography:** OK bet ne premium – trūksta weight hierarchijos.
- **Micro-interactions:** FAIL – visiškai statinis.

### 6.6 Agentų planas (įgyvendinimas)

| Etapas | Agentas | Užduotis |
|--------|---------|----------|
| 1 | **Orchestrator** | Prioritizuoja: Hero depth + CTA + spacing; Objectives elevation + checkmarks; Instructions weight + kbd; Prompt box character; Global tokens + micro-interactions |
| 2 | **UI/UX** | Įgyvendina CSS: design tokenų nuoseklumas, hero spacing/oro, badge brand feel, CTA hierarchija, objectives elevation + checkmark svoris, instructions kbd/badge, code-block charakteris, info-box elevation, checkbox zona, micro-interactions |
| 3 | **QA** | Po pakeitimų: `npm test`, lint, golden standard (struktūra/ID nekeista), STYLEGUIDE atnaujinimas |

**Top stabdantys:** per flat; per mažai oro; per silpni CTA; check icon sistema silpna; prompt box be charakterio.

---

## 7. Susiję dokumentai

- [STYLEGUIDE.md](../STYLEGUIDE.md) – atnaujinti po tokenų įvedimo
- [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) – HTML/JS struktūra nekeičiama; CSS reikšmės gali keistis
- [AGENTS.md](../AGENTS.md) – UI/UX Agent atsakingas už dizainą; QA – už validaciją
