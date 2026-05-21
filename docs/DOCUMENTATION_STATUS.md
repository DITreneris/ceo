# Documentation status (repo sync)

**Date:** 2026-05-21  
**Plan:** Repo Sync And Governance  
**Release-ready for docs/governance:** Yes (commerce live still gated in Phase 15)

## Summary

| Phase | Status | Deliverable |
|-------|--------|-------------|
| 1 SOT lock | Done | [`CURRENT_TRUTH.md`](CURRENT_TRUTH.md) |
| 2 P0 docs sync | Done | README, LAUNCH_CHECKLIST, STYLEGUIDE, gold_legacy → 21/43 |
| 3 Cursor/governance | Done | `.cursorrules`, `AGENTS.md`, `docs/INDEX.md` |
| 4 Link hygiene | Done | `memo_pdf.md` (DEPLOY.md removed), PR template, pre_deploy_plan |
| 5 Test backlog | Done | [`PAID_FLOW_TEST_BACKLOG.md`](PAID_FLOW_TEST_BACKLOG.md); `privacy.html` in `test:a11y` |
| 6 Deploy path | Done | Vercel canonical; GHP workflow deprecated in comments |
| 7 Consistency audit | Done | Active docs aligned; historical CHANGELOG entries unchanged |

## Canonical facts (unchanged in code)

- PDFs: **21** + **43** pages (`config/sot.json`, `export-pdfs.js`, storefront).
- Locale: **EN-first**; `/lt/` regression only.
- Production: **Vercel** at `https://www.promptanatomy.ceo`.

## Remaining launch blockers (not documentation)

- Live Stripe URLs + `allowPlaceholderCheckout: false`
- Vercel Production env + fulfillment health + test purchase
- Manual buyer-journey QA (320 / 375 / 768 px)

## PR checklist snippet

- [ ] Changes match [`CURRENT_TRUTH.md`](CURRENT_TRUTH.md)
- [ ] `npm test` (merge) or `npm run test:mixed` (release/UX)
- [ ] No new references to 12/28 or 18/40 as current page counts

## Intentionally unchanged

- `CHANGELOG.md` historical entries (18/40, 12/28 OG) — audit trail only.
- `docs/archive/**` — frozen legacy.
- `pdf_content_v02.md` (root duplicate) — prefer `docs/pdf-content-v02.md`.
