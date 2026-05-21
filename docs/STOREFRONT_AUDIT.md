# Storefront audit vs locked SOT

**Status:** Resolved in Banga 1 (Phase 8) and Banga 4 (Phase 13 polish).  
**SOT:** [`config/sot.json`](../config/sot.json)

## Completed

| Item | Resolution |
|------|------------|
| Strategic product title | `CEO AI Strategy Playbook` in `index.html` + `commerce.js` hydration (renamed 2026-05; legacy: `CEO Executive Strategic AI Playbook`) |
| Compare strip | Strategic Playbook (SOT + static fallback) |
| buyerPromise on cards | `[data-pdf-promise]` + `initPdfPromises()` |
| CTA / preview dialog | Buy Strategic Playbook; preview title updated |
| TOC counts | 12 / 21 sections (SOT-driven) |
| Page depth in lead | 12-page / 28-page in `#pdf-guides` lead |

## Remaining (Phase 15+)

- Live Stripe URLs when `allowPlaceholderCheckout: false`
- Cover PNG alt text auto-sync if product renamed again (manual today)
