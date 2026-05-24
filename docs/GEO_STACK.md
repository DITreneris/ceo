# GEO stack (AI crawlers + structured discovery)

**Status:** Shipped 2026-05-24 · **Policy:** EN-only; no edits to root `index.html` frontpage template.

## What ships

| Asset | Source | URL |
|-------|--------|-----|
| `robots.txt` | `scripts/build-geo-assets.js` | `/robots.txt` |
| `sitemap.xml` | same | `/sitemap.xml` |
| `llms.txt` | same | `/llms.txt` |
| JSON-LD (Person, WebSite, Product, HowTo) | `scripts/build-locale-pages.js` → **en only** | `/en/` |
| `/` → `/en/` | `vercel.json` | 308 permanent |

SOT: [`config/sot.json`](../config/sot.json) → `geo`.

## Entity

- **Organization:** Prompt Anatomy — hub [promptanatomy.app](https://www.promptanatomy.app/)
- **Founder:** Tomas Staniulis — [LinkedIn](https://www.linkedin.com/in/staniulis/), [X](https://x.com/TStaniulis_NFT)
- **Brand social:** [@promptanatomy](https://twitter.com/promptanatomy), [Telegram](https://t.me/prompt_anatomy)

## Regenerate

```bash
npm run build   # build-geo-assets.js + build-locale-pages.js
npm test
```

Commit generated `robots.txt`, `sitemap.xml`, `llms.txt`, and `en/index.html` after schema changes.

## Post-deploy checklist

1. `curl -sI https://www.promptanatomy.ceo/robots.txt` — 200, contains `Sitemap:` and `GPTBot`
2. `curl -s https://www.promptanatomy.ceo/llms.txt` — lists `/en/` and promptanatomy.app
3. `curl -sI https://www.promptanatomy.ceo/` — **308** to `/en/`
4. Submit `https://www.promptanatomy.ceo/sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**
5. [Rich Results Test](https://search.google.com/test/rich-results) on live `/en/`
6. Vercel: confirm no edge bot blocking (AI crawlers can 403 despite open `robots.txt`)

## Out of scope (needs frontpage or marketing)

- Above-fold GEO copy block on homepage
- Wikidata / Knowledge Panel
- `ai.txt` (low adoption)
