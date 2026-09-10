# Roadmap — Manage spoke GTM (90 days)

**Role:** [promptanatomy.ceo](https://www.promptanatomy.ceo/en/) sells the free weekly brief, sells Operations ($9.99) / Strategy ($19.99), and harvests CEO/COO attention to [promptanatomy.app](https://www.promptanatomy.app/) (Starter 39 / Core 99 EUR). Training checkout stays on `.app`.

**Engineering checklist:** [`todo.md`](../todo.md). **Product truth:** [`CURRENT_TRUTH.md`](CURRENT_TRUTH.md).

**Not this file:** archived LT-generator MVP under [`archive/pre-github-cleanup_2026-03/roadmap.md`](archive/pre-github-cleanup_2026-03/roadmap.md).

## Content pillars (LinkedIn / outbound)

Map to `config/sot.json` `buyerProblems` / `buyerPromise`:

1. Unclear ROI from AI experiments
2. Random prompting with no ownership
3. Weak weekly operating cadence

Share URL only: `https://www.promptanatomy.ceo/en/` (not `/lt/`, not `ceo-teal.vercel.app`).

## 90-day horizons

| Horizon | Outcome | Activities |
|---------|---------|------------|
| **Days 1–14** | Demand exists | 6 LinkedIn posts from the Monday brief; Production UTM verify (`community` / `faq` / `entity_footer`); 2× Phase 18 weekly log in `todo.md` |
| **Days 15–45** | Spoke cash or clear miss | ~~EN Hub-primary community CTA~~ / ~~Operations-first post-copy upsell~~ (shipped 2026-09-10); ~~Phase 17b~~ closed; optional Strategy live test buy; continue 2–3 posts/week |
| **Days 46–90** | Harvest visible | Named testimonial before any paid ads; success/email nudge to `.app` with `utm_source=ceo`; weekly hub PostHog check for `utm_source=ceo` |

## Self-sustain ledgers

| Ledger | Unit | Healthy signal |
|--------|------|----------------|
| Spoke | Operations / Strategy Stripe sales | A few sales/month cover hosting + Redis + Resend |
| Ecosystem | Hub Core (99 EUR) attributed via `utm_source=ceo` | ≥1 attributed Core outweighs spoke hosting |

Baseline (2026-09-10): hub `utm_source=ceo` = **0** (PostHog EU 155249, last 30d). Last `.ceo` Vercel paste (2026-08-31): 16 visitors.

## Stop rule

After ~12 LinkedIn posts and ~45 days: if still **0 PDF sales** and **0 hub `utm_source=ceo`** → reassess pillars and distribution. Do **not** add bounce experiments, custom events, LT copy, a third PDF, or ads to $9.99.

## WON'T (standing)

- Bounce fix (structural one-pager + copy-out)
- Custom funnel events until >100 visitors
- LT product expansion / third PDF SKU
- Paid traffic to $9.99 before named proof
- Redis reopen as first ticket; mint `ceo` wing
