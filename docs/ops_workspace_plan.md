# Ops workspace clarity — DOM contract & journey

**Status:** Shipped 2026-05-22 · **Scope:** `#operationsCenter` only · **Policy:** EN-first ([`AGENTS.md`](../AGENTS.md))

Companion to [`docs/hero_refactor.md`](hero_refactor.md). Documents the SOT keys, DOM contract, and CEO journey assumptions that the ops workspace clarity pass introduced. The implementation plan lives in `.cursor/plans/ops_workspace_premium_*.plan.md`.

## CEO first-run journey

```mermaid
flowchart TD
  hero[Hero · Get weekly priorities]
  steps[ops-journey-steps · Mode → Form → Result → Library]
  intro[ops-center-intro · one-line guidance]
  mode[mode-tabs · STRATEGIC / DAILY / WEEKLY]
  depth[depth-bar + chip--tip · Fast/Deep/Board]
  form[ops-form-grid · 2 cols, align-items: start]
  output[ops-output · live prompt + copy + tool launchers]
  sessions[sessionsPanel · full-width tile grid]
  hero --> steps --> intro --> mode --> depth --> form --> output --> sessions
```

| Time | What the user understands |
|------|---------------------------|
| 30s  | "Pick a mode, set depth, fill numbers — prompt updates live." |
| ~5min | Prompt is copied; optional save session or open ChatGPT/Claude/Gemini. |

## DOM contract

| Element | Selector / id | Purpose |
|---------|---------------|---------|
| Section | `#operationsCenter` | Anchor target from hero + step 1 |
| Stepper | `.ops-journey-steps` | 4 anchors with scroll spy ([`copy.js`](../copy.js)) |
| Intro line | `[data-copy-ops-intro]` | Hydrated from `copy.opsCenter.intro` |
| Mode tabs | `.mode-tabs > .mode-tab[data-mode]` | `MASTER` / `DIENOS` / `SAVAITES` panels |
| Depth bar | `.depth-bar` (flex-wrap) | Pills + tip chip stack |
| Depth tip | `.depth-tip.chip.chip--tip[id="depthTip"]` | `aria-describedby` target on depth `radiogroup`; `[data-copy-ops-depth-tip]` for hydration |
| Form grid | `.ops-form-grid` | `align-items: start`; full-width help via `.field-help--row` |
| Output | `#opsOutput` (textarea) | SOT placeholder; min-height 140px; themed scrollbar |
| Tool launchers | `.ops-tool-btn[data-ai-tool]` | Ghost on dark surface; gold accent on hover/focus |
| Sessions | `#sessionsPanel` | **Sibling of `.ops-layout`** (not inside `.ops-sidebar`); full-width tile grid |
| Toast | `#toast[data-copy-ops-toast-default]` | `showToastIfAvailable` reads attribute as default |

**Anchors that must not break:** `#operationsCenter`, `#opsForm`, `#opsOutputSection`, `#library` (covered by [`tests/e2e/core-flow.spec.js`](../tests/e2e/core-flow.spec.js)).

## SOT keys

```json
"copy": {
  "opsCenter": {
    "intro": "Pick a mode, set depth, fill your numbers — your prompt updates live.",
    "value": "…existing collapsible value line…"
  },
  "opsDepth": {
    "tip": "Tip · Not sure? Start with Fast."
  },
  "opsOutput": {
    "emptyPlaceholder": "Your CEO-ready prompt appears here as you fill the form.",
    "copiedToast": "Prompt copied — paste into ChatGPT, Claude, or Gemini."
  }
}
```

Hydration lives in [`commerce.js`](../commerce.js) → `initHeroCopy` (extended). The build replaces the EN strings for the LT regression page in [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js); LT marketing copy is not vested with new content per [`AGENTS.md`](../AGENTS.md).

## Quality gates

```bash
npm test                 # structure tests (134 currently)
npm run build            # regenerate /en/ + /lt/ after HTML touches
npm run test:e2e         # core flow incl. sessions + step links
npm run test:a11y        # depth tip contrast, chip aria
npm run test:visual:update   # after intentional ops-center DOM/CSS change
```

Visual baselines in [`tests/e2e/__screenshots__/`](../tests/e2e/__screenshots__/):

- `ops-center-desktop.png` (1280px viewport)
- `ops-center-mobile.png` (375px viewport)

## What is explicitly out of scope

- Stripe / fulfillment / PDF source HTML.
- LT marketing copy (LT regression only — strings replaced at build).
- New modes, API calls, wizard / multi-page flow.
- Hero or PDF storefront layout (already polished).

## Follow-ups (not in this PR)

- **Phase C** — migrate ops surfaces to `.btn` / `.card` aliases per [`docs/ds_improvement_plan.md`](ds_improvement_plan.md) §2.3.
- **Phase D** — first-run polish (ready-to-copy badge, soft quality hint, mobile DOM order spike) gated on Phase 17 QA.
