# Storefront Design System (DS 1.1)

**Status:** Hardened · **Version:** 1.1 (2026-05-22)  
**Entry CSS:** [`style.css`](../style.css) → imports [`styles/`](../styles/)  
**Tokens SOT:** [`styles/tokens.css`](../styles/tokens.css) — **only file where `#hex` literals are allowed**  
**Copy SOT:** [`config/sot.json`](../config/sot.json) → `copy.*`

## Token tables

| Token | Value | Use |
|-------|-------|-----|
| `--primary` | `#4A148C` | Brand violet, primary CTAs |
| `--primary-dark` | `#2E0A52` | Hover links, cover dark |
| `--accent-gold` | `#FFB300` | Focus rings, premium chips |
| `--text-muted` | `#5F6B7C` | Secondary copy, trust row |
| `--shadow-cta` | rgba violet | Unified buy buttons |
| `--shadow-soft` / `--medium` / `--elevated` | layered | Cards, panels |
| `--shadow-tab-*` / `--shadow-modal` / etc. | see `tokens.css` | Tabs, dialogs, focus |
| `--space-4` … `--space-48` | 4px grid | Layout gaps |
| `--space-10` | `10px` | Legacy micro gap |
| `--text-micro` … `--text-hero` | 9–38px | Type scale (no raw `px` in `styles/*`) |

## Components

### Buttons (`.btn`)

| Class | Role |
|-------|------|
| `.btn.btn--primary` | Buy / get — aliases: `.cta-button`, `.pdf-guide-cta`, `.community-cta-primary` |
| `.btn.btn--secondary` | Outline — `.cta-button-outline`, `.pdf-guide-preview-btn` |
| `.btn.btn--ghost` | Nav utility |
| `.btn.btn--pill` | Mode / depth tabs |
| `.btn.btn--icon` | Icon-only 44×44 |

### Cards (`.card`)

| Class | Surface |
|-------|---------|
| `.card` | Default soft card |
| `.card.card--product` | PDF guide cards |
| `.card.card--surface-dark` | Ops output panel |

### Trust (`.trust-row`)

Hydrated from `copy.trust.row` / `copy.trust.sectionFooter` via `commerce.js` → `initTrustRow`. Markup:

```html
<ul class="trust-row" data-trust-row="row" aria-label="Purchase trust signals"></ul>
```

### Chips (`.chip`)

Aliases: `.badge`, `.pill`, `.tag`.

## HTML examples

**Primary CTA:**

```html
<a href="#pdf-guides" class="btn btn--primary pdf-guide-cta">Get Operations Playbook — $9.99</a>
```

**Product card:**

```html
<article class="card card--product pdf-guide-card" data-product="operating-pdf">…</article>
```

## File map

| File | Contents |
|------|----------|
| `styles/tokens.css` | `:root` tokens |
| `styles/base.css` | Reset, body, top nav |
| `styles/components.css` | btn, card, chip, trust, icons |
| `styles/sections.css` | Hero, ops, PDF, footer |
| `styles/responsive.css` | Breakpoints |

See [`docs/COMPONENT-RULES.md`](COMPONENT-RULES.md) for contribution rules.

## Visual regression

- Spec: [`tests/e2e/visual-storefront.spec.js`](../tests/e2e/visual-storefront.spec.js)
- Baselines: [`tests/e2e/__screenshots__/`](../tests/e2e/__screenshots__/)
- Run: `npm run test:visual`
- Update baselines after intentional UI change: `npm run test:visual:update`
- Included in release gate: `npm run test:mixed`
