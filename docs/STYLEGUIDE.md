# Prompt Anatomy CEO — Design System (DS 1.0)

**Status:** Active — kanoninis design system gidas šiam repo (CEO/COO produktui).
**SOT spalvų / temų šaltinis:** [`config/sot.json`](../config/sot.json) + [`style.css`](../style.css).
**Sister repo (Edu MVP):** [`DITreneris/teacher`](https://github.com/DITreneris/teacher) — atskira spalvų sistema (navy + gold). Šis repo naudoja **violet + amber** CEO temą.

## 1. Brand foundations

| Token | Hex | Naudojimas |
|-------|-----|------------|
| `--primary` | `#4A148C` | Pagrindinė violetinė: CEO brand, h1/h2/h3 headings, callout border, table th, prompt-block bg-dark variantas |
| `--primary-dark` | `#2E0A52` | Violet gradient apačia, prompt-block dark fone |
| `--primary-light` | `#5B1F9E` | Violet gradient viršus, hover state |
| `--accent` | `#FFB300` | Gold accent: cover eyebrow, page-eyebrow-tag, card-num, prompt-tag, cover-positioning strong |
| `--surface` | `#F6F7FB` | Soft surface: callout default, prompt-block-light, table tr:nth-child(even), workflow step bg |
| `--text` | `#1E1F25` | Body text |
| `--text-muted` | `#6B7280` | Muted text, footers, eyebrows |
| `--border` | `#E7EAF2` | Hr, table cell border, card border, soft dividers |
| `--danger` | `#D6422E` | Danger callout border |

## 2. Typography

- **Product font:** `Inter` (700/800 headings, 500/600 UI, 400 body).
- **Mono font:** `JetBrains Mono` (prompt-block code).
- **Scale (PDF print):** h1 30pt cover / 24pt interior · h2 15pt · h3 11pt · body 9.5pt · prompt 7.5pt.
- **Letter-spacing:** eyebrow `0.08em–0.18em` (uppercase only).

## 3. Cover anatomy (PDF + OG)

Premium cover = vienas pažadas per 2 sekundes. Visi cover'iai (PDF + OG) seka šią struktūrą:

| Slot | Content | Notes |
|------|---------|-------|
| Eyebrow | `PROMPT ANATOMY · CEO AI SYSTEM` (gold) | Vieningas naming visiems Prompt Anatomy CEO produktams |
| Title | `CEO AI Operations Playbook` / `CEO AI Strategy Playbook` | Trumpas, be redundancy ("Executive Strategic" = blogai) |
| Subtitle | Vienos eilutės value prop | Sharper, ne aprašomasis |
| Callout (positioning) | Max 2 eilutės, **balta tekste**, **gold strong** | NIEKADA muted dark text on violet bg (kontrasto bug) |
| Footer | `Prompt Anatomy` + `www.promptanatomy.ceo` | Be `Page 1/12` ant cover (paslėpti per `body.pdf-asset-export .page.cover .cover-page-number`) |

**Anti-patterns (uždrausti ant cover):**
- Audience / Length / Version / Format / Date metadata
- "Pair with..." žymos
- Daugiau nei 1 callout box
- Page numbers (cover = page 1, savaime aišku)
- Low-contrast muted dark text inside violet field

## 4. Page-level patterns (PDF interior)

| Pattern | CSS class | Naudojimas |
|---------|-----------|------------|
| Page eyebrow | `.page-eyebrow` + `.page-eyebrow-tag` | Viršuje kiekvieno interior puslapio: kategorijos label + gold tag |
| Lead paragraph | `.lead` | Pagrindinė puslapio promise eilutė, primary spalva |
| Key-value list | `dl.kv` | About metadata, struct details (Audience/Length/Format) |
| Callout | `.callout` / `.callout-warn` / `.callout-danger` | Inline accent block; `<strong>` viršuje |
| Prompt block | `.prompt-block` (dark) / `.prompt-block-light` | Copy-paste prompts; mono font |
| Tables | `<table>` su violet th | Comparison, fields, workflow maps |
| Workflow steps | `.workflow .step` | 4-step horizontalus flow (Numbers → Prompt → Review → Act) |
| Cards | `.cards .card` + `.card-num` | Numbered concept cards |
| Section badges | `.section-tag` (violet) / `.section-tag-gold` | Page-level chips |

## 5. Quality gates (CI = source of truth)

```bash
npm test                  # structure (103 tests) + html lint + js lint
npm run test:smoke        # Playwright smoke (start-server-and-test)
npm run test:e2e          # core-flow Playwright tests
npm run test:a11y         # pa11y on index, privacy, success, terms
npm run test:mixed        # all of the above (CI gate)
```

PDF asset regen:

```bash
npm run pdf:assets        # export PDFs → preview PNGs → OG cover
```

## 6. Files map

| File | Role |
|------|------|
| [`style.css`](../style.css) | Storefront stiliai |
| [`docs/pdf-source/pdf-print.css`](pdf-source/pdf-print.css) | PDF print stylesheet (Letter, gradients, callouts) + `body.pdf-asset-export` mode (734×950 storefront preview) |
| [`docs/pdf-source/operating-cadence.html`](pdf-source/operating-cadence.html) | 18-page operating PDF source (v2.0) |
| [`docs/pdf-source/strategic-os.html`](pdf-source/strategic-os.html) | 40-page strategic PDF source (v2.0) |
| [`assets/og/og-cover.svg`](../assets/og/og-cover.svg) | OG card source (1200×630) |
| [`scripts/render-pdf-preview-pages.js`](../scripts/render-pdf-preview-pages.js) | Playwright section-by-section PNG renderer (cover + p2/p3/p4) |
| [`scripts/export-pdfs.js`](../scripts/export-pdfs.js) | Playwright PDF export (Letter, page-count assertion) |

## 7. Drift checklist (kiekvienam UI / PDF / OG keitimui)

- [ ] Ar redagavau SOT, o ne hardcoded copy?
- [ ] Ar copy liko en-US (CEO/COO US auditorija)?
- [ ] Ar cover'is turi tik 5 elementus (eyebrow, title, subtitle, callout, footer)?
- [ ] Ar callout `strong` yra gold (ne primary violet — kontrasto bug)?
- [ ] Ar interior puslapis turi `.page-eyebrow` su gold tag?
- [ ] Ar footer page count `X/21` (operating) arba `X/43` (strategy) formatas konsistentinis?
- [ ] Ar po cover/copy keitimo paleidau `npm run pdf:assets`?
- [ ] Ar visų `*.png` storefront preview'ų sizes `>= 40 KB` (cover) / `>= 15 KB` (interior)?
- [ ] Ar `npm test` ir `npm run build` praėjo prieš commit?

## 8. Naming convention (CEO AI System)

Visi PDF + storefront + OG turi vieningą naming:

- **Eyebrow:** `PROMPT ANATOMY · CEO AI SYSTEM`
- **Operations product:** `CEO AI Operations Playbook` (21 pages, $9.99)
- **Strategic product:** `CEO AI Strategy Playbook` (43 pages, $19.99)
- **Legacy aliases** (do not use in new copy): `CEO Strategic AI Operating System`, `CEO Executive Strategic AI Playbook`, `Operations Hub`, `Hub module: Operations`, `Strategy Hub`, `OPERATIONS MODULE` — only `labelLegacy` SOT field for backward reference.

## 9. Seka su sister repo (DITreneris/teacher)

Sister repo yra Edu MVP brand (Beginners + Advanced PDF, navy + gold). Jis **atskira tema**, bet **dalinasi šia struktūra**:

- `config/sot.json` SOT pattern (commerce, copy, products, FAQ)
- `docs/pdf-source/*.html` + `pdf-print.css` PDF generavimas
- `scripts/export-pdfs.js` Playwright PDF export
- Same-domain checkout/webhook/Redis taisyklė ([`memo_pdf.md`](../memo_pdf.md))
- `npm test` + `test:mixed` quality gates

Šis repo **neturi** sister repo:
- Telegram outreach / Resend marketing — out of scope
- Programmatic OG via satori — naudojam SVG (paprastesnis pipeline)
- WebP siblings PDF cover'iams — žr. [`scripts/optimize-pdf-covers.js`](../scripts/optimize-pdf-covers.js) (optional follow-up)

---

## Storefront components (DS 0.8+)

Storefront UI (hero, ops center, PDF cards) naudoja atskirą failų medį — žr. [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md):

- `.btn` / `.card` / `.chip` / `.trust-row`
- CSS: `styles/tokens.css` (vienintelis `#hex` šaltinis naujiems tokenams)

---

*Last updated: 2026-05-22. Atitinka [`gold_legacy_standard.md`](../gold_legacy_standard.md) baseline.*
