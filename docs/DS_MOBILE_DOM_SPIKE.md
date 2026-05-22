# DS Mobile DOM reorder spike (1.4b)

**Status:** Recommendation only — **do not implement** without product sign-off.  
**Related:** [`docs/ds_improvement_plan.md`](ds_improvement_plan.md) §12, [`docs/MOBILE_UX_IMPROVEMENT_PLAN.md`](MOBILE_UX_IMPROVEMENT_PLAN.md) #8.

## Problem

Mobile plan target order: **Mode → Depth → Form → CTA** (one clear path). Current DOM in `#operationsCenter` may differ; CSS `order` can reorder visually without moving nodes.

## Options

| Approach | Pros | Cons |
|----------|------|------|
| **A. CSS `flex-order`** on `.ops-form-section` children | No `generator.js` / anchor churn; reversible | Screen-reader order may not match visual unless `tabindex` / DOM sync |
| **B. HTML reorder** in [`index.html`](../index.html) | Accessible order matches visual | Breaks deep links (`#operationsCenter` focus), e2e keyboard tests, LT build parity |
| **C. Status quo** | Zero risk post DS 1.1 | Hierarchy item #8 stays open |

## Impact if implemented (B)

- [`generator.js`](../generator.js): tab/panel `aria-controls` ids unchanged if structure only reordered.
- [`tests/e2e/core-flow.spec.js`](../tests/e2e/core-flow.spec.js): re-verify mode/depth keyboard flow.
- [`tests/e2e/visual-storefront.spec.js`](../tests/e2e/visual-storefront.spec.js): update baselines after CSS/DOM change.
- [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js): run `npm run build` after `index.html` edit.

## Recommendation

**Defer implementation (C)** until post-launch buyer QA shows ops panel confusion on 375px. If needed later, prefer **A** with explicit `flex-direction: column` and documented `order` values in [`styles/responsive.css`](../styles/responsive.css), plus a single structure test asserting mobile order classes exist.

## Sign-off checklist (before any 1.4b work)

- [ ] Product owner approves visual order change on 320 / 375 / 768 px
- [ ] QA runs `npm run test:mixed` + manual ops flow
- [ ] Visual snapshots updated (`npm run test:visual:update`)
