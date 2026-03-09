# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Pridėta
- **EN statinis turinys (build)** – `scripts/build-locale-pages.js` generuojant `en/index.html` pakeičia visą matomą body į anglų kalbą: skip link, nav, hero, žingsniai, CTA, operacinis centras, režimai (STRATEGIC/DAILY/WEEKLY), gylis (Analysis depth, Fast/Deep/Board), output, sesijos, biblioteka, taisyklės, community, footer. Crawleriai ir pirmas paint mato EN be JS.
- **Kalbos auditas EN: DI→AI** – anglų versijoje visur naudojama „AI“ vietoj „DI“: produkto pavadinimas „AI Operations Center“, trumpas „AI OC“, „AI prompt“, „AI question“, „AI tool selection“, „Run your business with AI“. LT lieka „DI Operacinis Centras“ ir „DI“ terminija.

### Pakeista
- **generator.js** – EN locale: brand (nav pilnas ir trumpas), H1, title, badge spin-off aria-label, hero paragrafas – visi nustatomi į „AI Operations Center“ / „AI OC“ / atitinkamus AI tekstus. Spin-off badge tekstas EN: „Spin-off No. 5“ (Nr.→No.).
- **scripts/build-locale-pages.js** – EN locale: `LOCALE_META.en.title` = „AI Operations Center – for CEOs & COOs“; visi statiniai EN replace naudoja „AI Operations Center“, „AI OC“, „Spin-off No. 5“, pilną EN hero ir body tekstą.
- **ESLint** – `scripts/build-locale-pages.js` viršuje pridėta `/* eslint-env node */` ir `/* eslint-disable no-console */`, kad lint praeitų (require, __dirname, process, console.log).

### Pataisyta
- **Lint** – build skripte pašalintos klaidos: 'process' is not defined, '__dirname' is not defined, 'require' is not defined, Unexpected console statement.
