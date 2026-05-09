# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Pridėta
- **Premium OG social card sistema** – pridėta hand-crafted dark-mode „3-Layer Stack" social preview kortelė (1200×630): `assets/og/og-cover.svg` šaltinis su antrašte „Run AI like ops.", 3 stack'o kortelės (Strategy / Process auksu paryškintas / Execution), violet glow fonas (`#4A148C`), lineage chip „Prompt Anatomy · Operations module" ir bottom-center wordmark `promptanatomy.ceo`. Pridėtas `assets/og/README.md` su PNG eksporto instrukcija (pvz. `npx -y svgexport ... 1200:630`; alternatyva: `npx -y @resvg/resvg-js-cli ...`). Į repo įtrauktas `assets/og/og-cover.png`, į kurį rodo production `og:image`.
- **Open Graph + Twitter meta tag'ai (pilnas blokas)** – `index.html` pridėti trūkę meta tag'ai: `og:url`, `og:site_name`, `og:image` (+ `secure_url`, `type`, `width=1200`, `height=630`, `alt`), `og:locale:alternate=lt_LT`, `twitter:image` (+ `alt`), `twitter:site`. Anksčiau social share preview'us rodė be paveikslėlio.
- **Locale-aware OG `scripts/build-locale-pages.js`** – pridėtas 5b žingsnis: `og:url` perrašoma absoliučiu locale URL (`SITE_URL + /lt/` arba `/en/`), LT build'ui sukeičiami `og:locale=lt_LT` ir `og:locale:alternate=en_US`. Vienas universalus EN paveikslėlis abiem locale'ams.
- **`vercel.json` cache header'is** – `/assets/og/*` aplankas gauna `max-age=31536000, immutable` cache header'į (analogiškai CSS/JS/SVG).
- **Struktūriniai testai (OG)** – `tests/structure.test.js` papildyta 6 patikrinimais: og:image kelias, 1200×630 dydis, twitter:image + og:url buvimas, locale-correct og:url + og:locale `lt/index.html` ir `en/index.html`, SVG šaltinio egzistavimas. PNG nebuvimas — soft warning (eksportuojama prieš deploy).
- **Vercel deploy konfigūracija** – pridėtas `vercel.json` su `cleanUrls`, `trailingSlash: true`, `buildCommand: "npm run build"`, `outputDirectory: "."` ir cache headers: CSS/JS/SVG `max-age=31536000, immutable`, HTML ir root `max-age=0, must-revalidate`. Veikia dual mode lygiagrečiai su esamu GitHub Pages workflow.
- **`.vercelignore`** – sumažintas Vercel deploy svoris: išmesti `node_modules/`, `tests/`, `test-results/`, `playwright-report/`, `.github/`, `docs/`, `.cursor/`, ESLint/pa11y/playwright konfigūracijos, `*.test.js`, `*.local.md`, `AGENTS.md`, `todo.md`.
- **EN statinis turinys (build)** – `scripts/build-locale-pages.js` generuojant `en/index.html` pakeičia visą matomą body į anglų kalbą: skip link, nav, hero, žingsniai, CTA, operacinis centras, režimai (STRATEGIC/DAILY/WEEKLY), gylis (Analysis depth, Fast/Deep/Board), output, sesijos, biblioteka, taisyklės, community, footer. Crawleriai ir pirmas paint mato EN be JS.
- **SEO/GEO blokas (EN-first)** – į `index.html` įdėtas kompaktiškas „What it is / Who it’s for / What you get / How it works“ turinio blokas tarp Hero ir įrankio, kad crawleriai/AI sistemos lengvai suprastų ir cituotų puslapį.
- **Schema + social meta (EN-first)** – pridėti JSON‑LD: `WebApplication` + `FAQPage`, taip pat Open Graph/Twitter meta (title/description) patikimesniam share preview ir AI-readability.
- **robots.txt** – pridėtas maksimaliai leidžiantis `robots.txt` (`User-agent: *` + `Allow: /`) tradiciniams ir AI crawleriams.
- **Kalbos auditas EN: DI→AI** – anglų versijoje visur naudojama „AI“ vietoj „DI“: produkto pavadinimas „AI Operations Center“, trumpas „AI OC“, „AI prompt“, „AI question“, „AI tool selection“, „Run your business with AI“. LT lieka „DI Operacinis Centras“ ir „DI“ terminija.
- **Brand alignment (MUST/SHOULD)** – pridėtas lineage į Promptų anatomijos AI OS ekosistemą: Hub badge („Hub modulis: Operacijos“), AI OS framing footer'yje, patikslintas secondary CTA į Hub modulius, 6-block metodologijos užuomina taisyklėse, Hub mini-map footer'yje, mono „01–04“ hero žingsniai ir auksinis active mode-tab akcentas.
- **Vercel Web Analytics** – įdėtas tracking script statiniam HTML (`/_vercel/insights/script.js`).
- **Legal page stiliaus suvienodinimas** – `privatumas.html` perkelta ant bendro dizaino sistemos pagrindo: įtrauktas `style.css`, pridėta `body.legal-page` + `.legal-back` stiliai, pašalintas inline CSS.
- **`npm run trace:og`** – `scripts/trace-og.js`: prod HEAD (`/` ir OG PNG) su `Twitterbot/1.0` UA; env `SITE_URL` kitam domenui.

### Pakeista
- **Bendruomenės CTA: WhatsApp → Telegram** – `index.html`, `lt/index.html`, `en/index.html` `community-cta-primary` nuoroda pakeista iš `https://chat.whatsapp.com/...` į `https://t.me/prompt_anatomy`. Tekstai: LT „Prisijungti prie Telegram bendruomenės“ (aria-label „Atidaryti Promptų anatomija Telegram bendruomenę naujame lange“), EN „Join Telegram community“ (aria-label „Open Prompt Anatomy Telegram community in new tab“). `generator.js` runtime `uiText()` reikšmės atnaujintos, papildomai pridėtas `href` setAttribute, kad runtime locale switch'as išlaikytų Telegram URL. `scripts/build-locale-pages.js` EN replace pattern'as atnaujintas atitinkamai.
- **generator.js** – atnaujinti brand tekstai runtime locale switch'e: Hub badge, AI OS footer framing, secondary CTA value-prop, 6-block hint ir Hub map lokalizacija.
- **EN lokalizacija** – atnaujinti EN placeholderiai į USD formatą (pvz. `$45,000` vietoj `€`) ir sesijų data formatuojama su `en-US` vietoj `en-GB`.
- **Footer FAQ (runtime)** – praplėstas FAQ su U.S. trust klausimais: „Do you store my data?“ ir „Fast vs Deep vs Board“ (LT/EN), išlaikant esamą `<details>` struktūrą.
- **scripts/build-locale-pages.js** – EN build replace’ai pritaikyti naujiems LT brand tekstams (Hub badge, AI OS footer, Hub CTA, 6-block hint, Hub map aria-label, „you are here“).
- **scripts/build-locale-pages.js** – atnaujintas `LOCALE_META.en` (Title/Description) ir pridėtos LT replės naujam SEO/GEO blokui, kad `/lt/` pirmas paint nebūtų maišytos kalbos.
- **ESLint** – `scripts/build-locale-pages.js` viršuje pridėta `/* eslint-env node */` ir `/* eslint-disable no-console */`, kad lint praeitų (require, __dirname, process, console.log).
- **Canonical/hreflang** – build metu generuojami absoliutūs URL pagal `SITE_URL` (default `https://www.promptanatomy.ceo`).
- **EN first paint (community)** – root `index.html` community blokas suvienodintas su EN (kad crawleriai/slow-load nematytų LT teksto EN šablone).
- **LT social meta** – `scripts/build-locale-pages.js` LT build'ui lokalizuoja `og:title`, `og:description`, `twitter:title`, `twitter:description` (ne tik `og:url` ir `og:locale`).
- **Border token konsistencija** – formos field'ams `border` perjungtas į `var(--border)` vietoj hardcoded `#E2E5EF`.

### Pataisyta
- **X (Twitter) OG / root canonical** – Prod trace: OG PNG su crawler UA grąžina `200` ir `image/png` — serveris neblokuoja. Šakninis `index.html`: `og:url` = `https://www.promptanatomy.ceo/` (sutampa su dažnai dalijamu root URL, anksčiau buvo `/en/`). `og:image` / `secure_url` / `twitter:image` su `.../og-cover.png?v=2` — cache-bust po deploy, kad X perkrautų seną „be paveikslo“ cache.
- **Lint** – build skripte pašalintos klaidos: 'process' is not defined, '__dirname' is not defined, 'require' is not defined, Unexpected console statement.
- **LT locale build** – sutvarkytas gylio mygtukų tekstų replace, kuris sugadindavo `</button>` ir generuodavo `<//button>` `lt/index.html` (pridėti regresiniai testai).
- **CSS tokenai** – pridėtas `--radius-md` ir suvienodintas `:root` shadow set'as (pašalintas dublis).
