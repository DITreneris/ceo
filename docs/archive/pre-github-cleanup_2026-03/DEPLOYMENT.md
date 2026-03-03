# Deployment – DI Operacinis Centras

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

## Production URL

- GitHub Pages URL priklauso nuo repo pavadinimo: `https://<org-or-username>.github.io/<repo-name>/`

## GitHub Pages (GitHub Actions)

1. Repo Settings → Pages → **Build and deployment** → Source: **GitHub Actions**
2. Push į `main` automatiškai paleidžia:
   - testus (`npm test`)
   - smoke testus (`npm run test:smoke`)
   - a11y patikrą (`pa11y` abiem puslapiams)
   - deploy į GitHub Pages (žr. `.github/workflows/deploy.yml`)
3. Deploy artefaktas ribojamas iki runtime failų: `index.html`, `privatumas.html`, `style.css`, `generator.js`, `copy.js`, `favicon.svg`.

## Prieš deploy (lokaliai)

```bash
npm ci
npm test
npm run test:smoke
npm run test:e2e
npm run test:a11y
```

Pasirinktinai a11y:

```bash
npx serve -s . -l 3000
# Kitoje terminale:
npx pa11y http://localhost:3000/ --config .pa11yrc.json
npx pa11y http://localhost:3000/privatumas.html --config .pa11yrc.json
```

## Po deploy

- Gyvas testavimas: `docs/TESTAVIMAS.md`

## Deploy-ready kontrolinis sąrašas (go/no-go)

- [ ] `npm ci` ir `npm test` praeina lokaliai.
- [ ] `npm run test:smoke` praeina lokaliai.
- [ ] `npm run test:e2e` praeina lokaliai.
- [ ] `npm run test:a11y` praeina lokaliai.
- [ ] CI workflow (`.github/workflows/ci.yml`) praeina su pa11y.
- [ ] Deploy workflow (`.github/workflows/deploy.yml`) test job praeina su pa11y.
- [ ] `CHANGELOG.md` atnaujintas pagal realų release scope.
- [ ] Po deploy užpildytas testavimo žurnalas `docs/TESTAVIMAS.md`.

## Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| Pages rodo 404 | Patikrinti, ar Pages šaltinis = **GitHub Actions**. |
| Nepraeina deploy | Actions → atidaryti run → pirmiausia sutaisyti `npm test` ir pa11y žingsnį. |
