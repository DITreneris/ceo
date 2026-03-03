# Gyvo testavimo dokumentacija – DI Operacinis Centras

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)  
**Deploy:** `DEPLOYMENT.md`

Terminų taisyklė: pirmas paminėjimas `užklausa (promptas)`, toliau `promptas`.

## 1. Testavimo aplinka

| Laukas | Reikšmė |
|--------|--------|
| Production URL | `https://<org-or-username>.github.io/<repo-name>/` |
| Naršyklė(ės) | Chrome, Firefox, Edge (pasirinktinai: Safari) |
| Mobilus | Chrome Mobile / iOS Safari (pasirinktinai) |

Prieš gyvą testavimą turi būti praėję automatiniai vartai: `npm test`, `npm run test:smoke`, `npm run test:e2e` ir `npm run test:a11y`.

## 2. Scenarijai (checklist)

### Funkcionalumas

- [ ] **Operacinis centras:** režimai veikia, `opsOutput` atsinaujina, „KOPIJUOTI PROMPTĄ IR ANALIZUOTI“ kopijuoja promptą.
- [ ] **Šablonai:** kiekvieno šablono „Kopijuoti“ mygtukas kopijuoja teisingą `<pre>` tekstą.
- [ ] **Viršutinis mygtukas:** „Kopijuoti promptą“ (sticky) veikia.
- [ ] **Dark mode:** perjungimas veikia, kontrastas OK, focus-visible matomas.
- [ ] **Privatumas:** nuoroda į `privatumas.html` veikia; turinys atsidaro.

### Prieinamumas (a11y)

- [ ] Tab navigacija per pagrindinius elementus (CTA, generatorius, kopijavimas) be įstrigimo.
- [ ] Klaviatūra: Enter/Space ant interaktyvių elementų veikia.

### Responsive

- [ ] 320–375px: nėra horizontal scroll (išskyrus code-block, jei ilga eilutė).
- [ ] 768px: layout stabilus (header, output, sessions, accordion) be susispaudimo.
- [ ] Touch target’ai: pagrindiniai mygtukai bent 44px aukščio ir patogūs spausti.
- [ ] Top nav telpa 320px pločiuje (brand + theme + sticky copy) be persidengimo.
- [ ] Accordion antraštės skaitomos ir valdomos viena ranka.

### Kiti

- [ ] Nėra console klaidų po kelių kopijavimų.
- [ ] Hero žingsniai ir accordion navigacija veikia tiek touch, tiek klaviatūra.

## 3. Testavimo žurnalas

```markdown
## YYYY-MM-DD – po deploy

- **URL:** https://...
- **Naršyklė:** ...
- **Rezultatas:** ✅ OK | ⚠️ problema: ...
```
