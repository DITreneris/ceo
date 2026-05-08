# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Pridėta
- **Vercel deploy konfigūracija** – pridėtas `vercel.json` su `cleanUrls`, `trailingSlash: true`, `buildCommand: "npm run build"`, `outputDirectory: "."` ir cache headers: CSS/JS/SVG `max-age=31536000, immutable`, HTML ir root `max-age=0, must-revalidate`. Veikia dual mode lygiagrečiai su esamu GitHub Pages workflow.
- **`.vercelignore`** – sumažintas Vercel deploy svoris: išmesti `node_modules/`, `tests/`, `test-results/`, `playwright-report/`, `.github/`, `docs/`, `.cursor/`, ESLint/pa11y/playwright konfigūracijos, `*.test.js`, `*.local.md`, `AGENTS.md`, `todo.md`.
- **EN statinis turinys (build)** – `scripts/build-locale-pages.js` generuojant `en/index.html` pakeičia visą matomą body į anglų kalbą: skip link, nav, hero, žingsniai, CTA, operacinis centras, režimai (STRATEGIC/DAILY/WEEKLY), gylis (Analysis depth, Fast/Deep/Board), output, sesijos, biblioteka, taisyklės, community, footer. Crawleriai ir pirmas paint mato EN be JS.
- **Kalbos auditas EN: DI→AI** – anglų versijoje visur naudojama „AI“ vietoj „DI“: produkto pavadinimas „AI Operations Center“, trumpas „AI OC“, „AI prompt“, „AI question“, „AI tool selection“, „Run your business with AI“. LT lieka „DI Operacinis Centras“ ir „DI“ terminija.
- **Brand alignment (MUST/SHOULD)** – pridėtas lineage į Promptų anatomijos AI OS ekosistemą: Hub badge („Hub modulis: Operacijos“), AI OS framing footer'yje, patikslintas secondary CTA į Hub modulius, 6-block metodologijos užuomina taisyklėse, Hub mini-map footer'yje, mono „01–04“ hero žingsniai ir auksinis active mode-tab akcentas.

### Pakeista
- **Bendruomenės CTA: WhatsApp → Telegram** – `index.html`, `lt/index.html`, `en/index.html` `community-cta-primary` nuoroda pakeista iš `https://chat.whatsapp.com/...` į `https://t.me/prompt_anatomy`. Tekstai: LT „Prisijungti prie Telegram bendruomenės“ (aria-label „Atidaryti Promptų anatomija Telegram bendruomenę naujame lange“), EN „Join Telegram community“ (aria-label „Open Prompt Anatomy Telegram community in new tab“). `generator.js` runtime `uiText()` reikšmės atnaujintos, papildomai pridėtas `href` setAttribute, kad runtime locale switch'as išlaikytų Telegram URL. `scripts/build-locale-pages.js` EN replace pattern'as atnaujintas atitinkamai.
- **generator.js** – atnaujinti brand tekstai runtime locale switch'e: Hub badge, AI OS footer framing, secondary CTA value-prop, 6-block hint ir Hub map lokalizacija.
- **scripts/build-locale-pages.js** – EN build replace’ai pritaikyti naujiems LT brand tekstams (Hub badge, AI OS footer, Hub CTA, 6-block hint, Hub map aria-label, „you are here“).
- **ESLint** – `scripts/build-locale-pages.js` viršuje pridėta `/* eslint-env node */` ir `/* eslint-disable no-console */`, kad lint praeitų (require, __dirname, process, console.log).

### Pataisyta
- **Lint** – build skripte pašalintos klaidos: 'process' is not defined, '__dirname' is not defined, 'require' is not defined, Unexpected console statement.
