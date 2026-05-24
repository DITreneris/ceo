# Hero refactor — operations spec

**Status:** Implemented (2026-05-22) · **De-clutter** (2026-05-22): journey-aligned hero density  
**Owner:** UI/UX (storefront) · QA (`npm test`, `npm run test:mixed`)  
**Reference:** [DITreneris/teacher](https://github.com/DITreneris/teacher) — hero layout + scroll spy (adapted, not copied)

## Goals

- **2 hero CTAs only:** primary → `#operationsCenter`, secondary → `#pdf-guides` (playbooks).
- **Glass preview card** on the right (desktop): static CEO weekly-priorities example (`aria-hidden="true"`).
- **Working 4-step journey bar** at top of `#operationsCenter` (`.ops-journey-steps`): same anchors + `IntersectionObserver` scroll spy (relocated from hero 2026-05-22).
- **Remove** duplicate stepper from ops center and tertiary `Browse templates` link in hero.
- **Sticky “Copy prompt”** visible only after the user fills at least one form field.

## Non-goals

- LT copy changes (`/lt/` regression DOM only).
- Dark full-bleed hero (teacher style) — keep light lavender hero.
- Live sync between hero card and `#opsOutput`.
- Stripe / commerce logic changes.
- Frozen H1 change: *Turn KPIs into weekly priorities* ([COMPONENT-RULES.md](COMPONENT-RULES.md)).

## Product decisions (locked)

| Decision | Choice |
|----------|--------|
| Hero surface | Light lavender + **dark glass** preview card |
| Secondary CTA | See CEO playbooks (no prices in hero) → `#pdf-guides` |
| Library entry | Step 4 + accordion only (no hero tertiary) |

## Before → After

| Aspect | Before | After |
|--------|--------|-------|
| Hero CTAs | 3 | 2 |
| Hero right | Empty | `.hero-prompt-card` |
| Stepper | Ops center, broken `#` on steps 1–3 | `.ops-journey-steps` under ops header, 4 anchors + spy |
| Sticky copy | Always visible | Hidden until form input |

## DOM contract

```html
<header class="header">
  <div class="hero-layout">
    <div class="hero-content">… h1, lead, .header-cta …</div>
    <aside class="hero-prompt-card" aria-hidden="true">… P1–P2 + more …</aside>
  </div>
</header>
<section class="ops-center" id="operationsCenter">
  … ops-center-header …
  <nav class="ops-journey-steps"><ol>… 4 anchors …</ol></nav>
  … mode tabs, form, output …
</section>
```

| ID / hook | Purpose |
|-----------|---------|
| `#operationsCenter` | Step 1 — mode tabs |
| `#opsForm` | Step 2 — form |
| `#opsOutputSection` | Step 3 — generated prompt sidebar |
| `#library` | Step 4 — templates accordion |
| `data-copy-hero-*` | SOT hydration via `commerce.js` |

**Removed:** `.ops-work-steps`, `.header-cta-link` in hero.

## Copy matrix (EN)

| Source | Field / element | Text |
|--------|-----------------|------|
| SOT | `copy.hero.headlineBenefit` | Turn KPIs into weekly priorities |
| SOT | `copy.hero.primaryCta` | Get weekly priorities |
| SOT | `copy.hero.secondaryCta` | See CEO playbooks |
| SOT | `copy.hero.ctaMeta` | For CEOs & COOs · Free · No account · ~5 min |
| Static HTML | Preview label | Example |
| Static HTML | Preview title | Weekly priorities (preview) |
| Static HTML | Preview rows | P1–P2 + “+3 priorities in your output” |

## CSS

- Tokens: `--hero-card-bg`, `--hero-card-border`, `--hero-card-text` in `styles/tokens.css`.
- Layout: `.hero-layout` grid ≥1025px; card hidden ≤1024px.
- Card: dark panel on light hero (`--output-bg` family), gold accent border.

## JavaScript

| File | Behavior |
|------|----------|
| `copy.js` | Scroll spy + step click → `scrollIntoView` + library `openOnly` |
| `generator.js` | `hasAnyFormInput()` + `updateStickyCopyVisibility()` on form/output updates |
| `commerce.js` | Hero SOT hooks (no tertiary) |

## QA gates

```bash
npm test
npm run build
npm run test:e2e
npm run test:visual:update   # intentional hero layout change
```

Manual: 375 / 768 / 1280px; keyboard step links; sticky copy after first field input; `prefers-reduced-motion` (no float animation).

## Rollout

1. Merge + `npm run build`
2. Deploy Vercel (canonical `/en/`)
3. Prod smoke: 2 CTAs, nav Playbooks styled, stepper active states on scroll
