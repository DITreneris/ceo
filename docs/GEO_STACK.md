# GEO stack (AI crawlers + structured discovery)

**Status:** Hardened 2026-08-09 · **Policy:** EN-only; no edits to root `index.html` frontpage template. Legitimate GEO only (no prompt-injection / jailbreak “LLM SEO”).

## What ships

| Asset | Source | URL |
|-------|--------|-----|
| `robots.txt` | `scripts/build-geo-assets.js` | `/robots.txt` |
| `sitemap.xml` | same | `/sitemap.xml` |
| `llms.txt` | same | `/llms.txt` |
| `llms-full.txt` | same | `/llms-full.txt` |
| JSON-LD (Person, WebSite, Product×2, HowTo, buyer FAQPage) | `scripts/build-locale-pages.js` → **en only** | `/en/` |
| SSR purchase FAQ HTML | same (from `buyerFaq`) | `/en/#pdf-guides-faq` |
| `/` → `/en/` | `vercel.json` | 308 permanent |

`llms.txt` / `llms-full.txt` / `robots.txt` served as `text/plain; charset=utf-8` via [`vercel.json`](../vercel.json).

SOT: [`config/sot.json`](../config/sot.json) → `geo` (+ `pdfGuides.*.coverImage`, `buyerFaq`).

## Crawler policy

**Allow both retrieval and training** (growth posture). Permissions live only in `robots.txt` (not in `llms.txt`).

| Role | User-agents (examples) |
|------|------------------------|
| Live retrieval / citations | `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Googlebot`, `Bingbot` |
| Training / model grounding | `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `meta-externalagent`, `Claude-Web`, `anthropic-ai` |

Disallow: `/api/`, `/lt/`. Sitemap includes `/en/`, `privacy.html`, `terms.html` — excludes `/lt/`, `/api/`, and `success.html` (already `noindex`).

## Entity

- **Organization:** Prompt Anatomy — hub [promptanatomy.app](https://www.promptanatomy.app/)
- **Founder:** Tomas Staniulis — [LinkedIn](https://www.linkedin.com/in/staniulis/), [X](https://x.com/TStaniulis_NFT)
- **Brand social:** [@promptanatomy](https://twitter.com/promptanatomy), [Telegram](https://t.me/prompt_anatomy)

Keep the same entity story on the hub (manual ops). Off-site edits to `promptanatomy.app` are outside this repo.

## Regenerate

```bash
npm run build   # build-geo-assets.js + build-locale-pages.js
npm test
```

Commit generated `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, and `en/index.html` after schema / GEO changes.

## Post-deploy checklist

1. `curl -sI https://www.promptanatomy.ceo/robots.txt` — 200, `Content-Type: text/plain`, contains `Sitemap:`, `OAI-SearchBot`, `Claude-SearchBot`
2. `curl -s https://www.promptanatomy.ceo/llms.txt` — H1 + `/en/` + promptanatomy.app; `## Optional` present; no “Do not crawl”
3. `curl -sI https://www.promptanatomy.ceo/llms-full.txt` — 200, `text/plain`; body mentions `$9.99` / `$19.99` and page counts
4. `curl -sI https://www.promptanatomy.ceo/` — **308** to `/en/`
5. Submit `https://www.promptanatomy.ceo/sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**
6. [Rich Results Test](https://search.google.com/test/rich-results) on live `/en/` (Product, FAQ, HowTo)
7. Vercel logs: confirm AI user-agents are not **403**’d at the edge despite open `robots.txt`
8. Monthly citation checks: [`GEO_CITATION_PROMPTS.md`](GEO_CITATION_PROMPTS.md)

## Measurement

- Citation pack: [`GEO_CITATION_PROMPTS.md`](GEO_CITATION_PROMPTS.md)
- Prefer server logs for `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` hit rates after deploy

## Out of scope

- Above-fold GEO copy block on homepage (root template)
- Wikidata / Knowledge Panel
- `ai.txt` (low adoption)
- Training-bot blocks, prompt injection, memory-poison “LLM SEO”
