# QA standartas – DI Operacinis Centras

**Kanoninė repozitorija organizacijos QA procesui:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

Terminų taisyklė: pirmas paminėjimas `užklausa (promptas)`, toliau `promptas`.

---

## 1. Tikslas

- Vienoda QA praktika visuose susijusiuose projektuose.
- Aiškūs kriterijai prieš merge ir release.
- Dokumentuotas gyvas testavimas po deploy.

---

## 2. Nuoroda į spinoff01

- **Repozitorija:** https://github.com/DITreneris/spinoff01  
- **Paskirtis:** Organizacijos QA standarto ir šablonų repozitorija (checklistai, workflow šablonai, testavimo šablonai).  
- **Šiame projekte:** Laikomės šio dokumento ir [AGENTS.md](../AGENTS.md) QA Agent aprašymo; bendri standartai ir atnaujinimai – spinoff01.

---

## 3. QA kriterijai (šis projektas)

### Prieš kiekvieną merge / PR

- [ ] `npm ci` ir `npm test` praeina (struktūra + `lint:html` + `lint:js`).
- [ ] `npm run test:smoke` praeina (320/375/768 viewport smoke scenarijai).
- [ ] `npm run test:e2e` praeina (kritiniai first-run keliai: generate/copy/session/accordion).
- [ ] `lint:html` – W3C/Nu validatorius praeina; žinomas `env()` ribojimas valdomas pagal projekto taisykles.
- [ ] CI (`.github/workflows/ci.yml`) praeina – lint, testai, pa11y (WCAG2AA).
- [ ] Deploy workflow test dalis (`.github/workflows/deploy.yml`) praeina – `npm test` + `test:smoke` + pa11y.
- [ ] Pakeitimams atitinka dokumentacijos atnaujinimai ([docs/DOCUMENTATION.md](DOCUMENTATION.md)).

### Prieš release

- [ ] CHANGELOG.md atnaujintas (SemVer).
- [ ] Versija atitinka pakeitimus.
- [ ] Rankinis QA: naršyklė, mobilus, kopijavimas, a11y (pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md)).

### Po deploy (gyvas testavimas)

- [ ] Atliktas gyvas testavimas pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md).
- [ ] Rezultatai įrašyti į testavimo žurnalą.

---

## 4. Komandos

| Komanda | Paskirtis |
|---------|-----------|
| `npm ci` | Deterministinis priklausomybių diegimas CI/lokaliai |
| `npm test` | Struktūros testai + HTML/JS lint |
| `npm run test:smoke` | Greiti browser smoke testai mobile matricai (320/375/768) |
| `npm run test:e2e` | Kritinių vartotojo kelių E2E testai |
| `npm run test:mixed` | Pilnas mixed rinkinys: test + smoke + e2e + a11y |
| `npm run test:a11y` | A11y testas (`/` ir `/privatumas.html`) su `.pa11yrc.json` |
| `npm run lint:html` | HTML validacija (index.html) |
| `npm run lint:js` | ESLint |
| A11y lokaliai (alternatyva) | `npx serve -s . -l 3000` + `npx pa11y http://localhost:3000/ --config .pa11yrc.json`. CI naudoja `.pa11yrc.json` (Chrome `--no-sandbox` ir kt.). |

---

## 5. Susiję dokumentai

- [AGENTS.md](../AGENTS.md) – QA Agent rolė ir release seka  
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų valdymas ir QA checklist  
- [docs/TESTAVIMAS.md](TESTAVIMAS.md) – gyvo testavimo scenarijai ir žurnalas  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy ir testavimas po deploy  

**Paskutinis atnaujinimas:** 2026-02-26
