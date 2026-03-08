# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Nereleisuota]

### Prideta
- **Prompt Anatomy nuorodos centralizavimas** – `generator.js` įvesta konstanta `ANATOMY_URL = 'https://www.promptanatomy.app/'`; `applyUiStrings()` nustato `href` badge ir community secondary CTA iš šios konstantos (vienas šaltinis tiesos). Struktūros testas tikrina, kad puslapyje yra nuoroda į `promptanatomy.app`. Build skripte generuojant `en` statinėje HTML pakeičiami anatominės nuorodos tekstas ir aria-label į angliškus (geresnis a11y/crawleriams).
- **Phase 2: SEO locale puslapiai** – `/lt/` ir `/en/` tarnauja pilną app HTML be client-side redirect; locale sprendžiamas iš `pathname` (path-based), paskui query/localStorage/navigator. Build script `scripts/build-locale-pages.js` generuoja `lt/index.html` ir `en/index.html` iš root šablono su `lang`, title, meta, canonical, hreflang ir root-relative asset keliais. `npm run build` įtrauktas į package.json.
- **Kalbos perjungiklis** – iš `/lt/` ar `/en/` perjungus kalbą atidaromas atitinkamas path su išsaugotu `mode`, `depth` ir hash. Serve testams naudojamas be `-s` (SPA), kad locale puslapiai būtų teisingai tarnuojami.
- **Pilna EN lokalizacija** – `applyStaticLocaleText()` papildytas: formų sekcijų antraštės (Strategic context, Yesterday's operations, Weekly overview), visi formų label'ai ir placeholder'ai (pvz. → E.g., horizon select EN), runway field-help, output „Simbolių:“ → „Characters:“, tool launchers („Nori tęsti analizę?“ → „Want to continue?“, Atidaryti → Open), bibliotekos ir taisyklių collapsible tekstai, skip-link, aria-label'ai, footer, community, toast. Kalbos jungiklio aktyvi būsena sinchronizuojama su `locale`.
- Šablonų bibliotekoje pridėtas 6-as šablonas: `Vadovo savirefleksija` (CEO savaitinei sprendimų peržiūrai).
- Įvestas globalus šablonų ilgio limitas: iki `1100` simbolių visiems bibliotekos šablonams.
- Bibliotekos šablonų skaitiklis padarytas dinaminis (`libraryTemplateCount`) ir rodo realų šablonų kiekį.
- Dokumentacija: atnaujintas `README.md`, pridėti `todo.md` ir `roadmap.md`.
- `docs/FIRST_RUN_USER_JOURNEY_AUDIT.md` su pirmo paleidimo kelionės analize, mikrocopy paketu, UX backlogu ir QA checklist.
- `index.html` output zonoje pridėti diskretiški mygtukai: `Atidaryti ChatGPT`, `Atidaryti Claude`, `Atidaryti Gemini`.
- Pilnai perrašytas `README.md` pagal dabartinį produktą ir first-run vartotojo kelionę.
- Sukurtas `docs/INDEX.md` kaip centrinis dokumentacijos įėjimo taškas (Start Here, Run and Verify, Release and Deploy, Archive).
- Pridėtas `mixed` testų sluoksnis: Playwright smoke testai (`320/375/768`) ir kritinių first-run kelių E2E testai.
- Pridėtas `playwright.config.js` ir nauji test scriptai: `test:smoke`, `test:e2e`, `test:mixed`.

### Pakeista
- **EN copy pagal SaaS geriausias praktikas** – atnaujinti anglų teksti `generator.js` ir build meta: pavadinimas „DI Operations Center – for CEOs & COOs“, hero (generate, Under 5 min), operacinio centro aprašas (Choose a mode, fill in the fields), depth help (Not sure? Start with Fast.), MODES.DIENOS.desc (Daily operations review), runway help, output placeholder ir footer (Edit here if needed…), CTA (Copy prompt & analyze), tool launchers (Continue in:). US rašyba (prioritize). `scripts/build-locale-pages.js` LOCALE_META.en: title ir naudos orientuota meta description (Get clear weekly priorities… Available in LT & EN.).
- **Promptų anatomija** – nuoroda valdoma iš `generator.js` (`ANATOMY_URL`); root/lt/en HTML naudoja tą patį URL kaip fallback be JS.
- **README ir docs** – Kalbų architektūra atnaujinta į Phase 2 (path-based locale, build, perjungiklis į path). Pridėta `npm run build` ir serve be `-s` instrukcijos. `docs/INDEX.md` nuoroda į Phase 2.
- **Testai** – `tests/structure.test.js`: lt/en failai tikrinami dėl pilno app markup, `lang="lt"`/`lang="en"`, be redirect. E2E: path `/lt/` ir `/en/` pilnas app ir teisingas `lang`; perjungimas iš `/lt/` į `/en/` išlaiko mode/depth. `getLocaleFromPathname()` naudoja segmentą (`/\/lt(?:\/|$)/`, `/\/en(?:\/|$)/`).
- **ESLint** – `scripts/**/*.js` override su `node: true` ir `no-console: off` build skriptui.
- `README.md` papildytas aktyviu `Golden Standard (UI)` skyriumi (violetinė brand kryptis, hierarchija, CTA dominavimas, a11y).
- `style.css` perpoliruotas white/dark režimams: aiškesnė tonalinė hierarchija, layered shadows, stipresnis CTA, input ir sessions vizualinė tvarka.
- `index.html` ir `generator.js` mikrocopy/perrašai suvienodinti į aiškią CEO kalbą (`užklausa` vietoje perteklinių terminų).
- `index.html` bibliotekos tekstai ir sesijų empty state atnaujinti į aiškesnę verslo kalbą.
- `tests/structure.test.js` pritaikytas naujai terminijai (`Kopijuoti užklausą`) su backward-compatible tikrinimu.
- `README.md` sutvarkytas pagal dabartinį projektą (DI Operacinis Centras).
- `index.html` mikrocopy: naudos orientuotas hero tekstas, aiškesni CTA, gylio rekomendacija, "kas toliau" žinutė po kopijavimo, aiškesnis sesijų trynimo tekstas.
- `privatumas.html` terminija ir localStorage aprašas suderinti su `DI Operacinis Centras`.
- `generator.js` papildytas saugiu `open-only` AI įrankių atidarymu su host allowlist (`chatgpt.com`, `claude.ai`, `gemini.google.com`).
- `style.css` papildytas secondary launcher mygtukų stiliais su focus būsena ir mobile 44px ergonomika.
- Dokumentacija suvienodinta pagal produkto pavadinimą `DI Operacinis Centras` (`DEPLOYMENT.md`, `docs/QA_STANDARTAS.md`, `docs/TESTAVIMAS.md`).
- `docs/DOCUMENTATION.md` pridėta terminų taisyklė: pirmas paminėjimas `užklausa (promptas)`, toliau `promptas`.
- CI/deploy hardening: `.github/workflows/ci.yml` ir `.github/workflows/deploy.yml` perkelti į `npm ci`, deploy teste įtraukta pa11y patikra.
- Deploy artefaktas apribotas iki runtime failų, kad į GitHub Pages nepatektų pertekliniai dokumentai.
- `.gitignore` nebeignoruoja `package-lock.json`, o `.eslintrc.json` išvalytas nuo stale override ir sugriežtintas `no-console` produkciniam kodui.
- `generator.js` papildytas klaviatūrine rodyklių navigacija mode tabams ir gylio pasirinkimui (`Arrow`, `Home`, `End`).
- `style.css` atnaujintas mobile remediacijai (`320–768`): touch target’ai 44px, top-nav ir accordion sutalpinimas, output/sessions wrap, `session-item:focus-visible`.
- CI/deploy grandinėje įtraukti smoke testai; CI papildyta Playwright browser diegimo fazė.
- `docs/QA_STANDARTAS.md`, `docs/TESTAVIMAS.md`, `docs/FIRST_RUN_USER_JOURNEY_AUDIT.md`, `DEPLOYMENT.md` papildyti mobile/test gate kriterijais.

### Pataisyta
- **i18n** – su `lang=en` visi UI elementai dabar rodomi angliškai: nav pavadinimas, hero žingsniai, operacinio centro antraštė, režimų/gylio etiketės, formų sekcijos, label'ai, placeholder'ai, horizon select, output „Simbolių:“, tool launchers, biblioteka/taisyklių antraštės, footer, community, kalbos jungiklio aktyvi būsena.
- A11y kontrasto regresijos (`Pa11y`): `header-step-num`, `.field-help`, `#sessionsEmpty` elementams pakeltas kontrastas iki WCAG 2.1 AA.
- `npm run test:a11y` dabar praeina be klaidų (`/` ir `/privatumas.html`).

---

## [1.2.0] - 2026-02-27

### Prideta
- **Tools „select then CTA"** – įrankių kortelės dabar veikia dviem žingsniais: 1) pasirinkti kortelę, 2) spausti „Kopijuoti + atidaryti" CTA mygtuką. Pašalintas pavojingas 1-click auto-copy+auto-open.
- **Smart prompt kopijavimas** – CTA mygtukas automatiškai parenka Pro promptą (jei užpildytas objektas) arba Mini promptą.
- **Helper text** – po pagrindiniais laukais (Mini + Pro) pridėtas pastovus pavyzdžių tekstas (`field-help`), placeholderiai sutrumpinti.
- **Spalvos chips** – 7 spalvos chips (Auksinė, Mėlyna, Pastelinė, Koralinė, Žalia, Violetinė, Neutrali) su spalvos žymekliais ir dvikrypte sinchronizacija su teksto lauku.
- **Completion x/y** – step status pakeistas iš binarinio „Nepilna/Atlikta" į „0/2 užpildyta" / „1/2 užpildyta" / „2/2 Atlikta" su trimis vizualinėmis būsenomis (info, partial, complete).
- **Stiprumo paaiškinimas** – po „Stiprumas X/7" pill pridėtas dinaminis hint tekstas, keičiantis pagal tier (Silpnas → Premium).
- **Semantinė pill sistema** – bendra `.pill` bazė su `--info`, `--warning`, `--success`, `--premium` modifikatoriais, dark mode palaikymas. Pritaikyta step statusams ir „Rekomenduojama" badge.
- **Prompt highlight diferenciacija** – naujas `.gen-key` (geltona, bold) kritiniams tokenams (stilius, platforma, tonas) ir `.gen-value` (balta, pabraukta) normaliems tokenams.

### Pakeista
- **Hero suspaustas** – sumažinti padding, H1 (52→40px), subtitle, CTA mygtukų dydžiai; container top padding sumažintas. Darbinė zona (mini generatorius) matoma pirmame ekrane.
- **Tipografijos hierarchija sustiprinita** – suderinti H1/H2/section title/step header/label dydžiai vienodesnei skalei.
- Tools sekcijos aprašomasis tekstas atnaujintas pagal naują select-then-CTA elgseną.
- Responsive taisyklės atnaujintos spalvos chips, action bar ir sutraukto hero komponentams.

---

## [1.1.0] - 2026-02-27

### Prideta
- **4 žingsnių proceso navigacija** hero viršuje (Sukurk promptą / Šablonai / Generuok vaizdą / Pro režimas) su aktyvaus žingsnio paryškinimu.
- **Step-badge numeracija** – kiekvieno bloko header'yje apskritas numeris (premium SaaS stilius), vertės eilutė ir nuoseklus vizualinis pattern'as.
- **Accordion (single-open) elgsena** – vienu metu atverta tik viena iš 3 suskleidžiamų sekcijų (Šablonai / Įrankiai / Pro režimas); būsena įsimenama per `localStorage`.
- **Įrankių sekcija padaryta collapsible** (nauja toggle struktūra su `toolsToggle` / `toolsBody`).
- **Hero žingsnių sinchronizacija** su accordion – paspaudus hero žingsnį atidaroma atitinkama sekcija, o atidarius sekciją pažymimas teisingas hero žingsnis.
- Bendra `.collapsible-toggle` CSS sistema – vienodas grid layout visiems toggle header'iams (badge / title / count / chevron / value).
- `.section-header-row` – premium header'is ne-collapsible blokui (mini generatorius).

### Pakeista
- „Ekspertinis generatorius" pervadintas į **„Pro režimas"** (aiškesnis pavadinimas vartotojui).
- Šablonų sekcija default uždaryta (anksčiau buvo atverta).
- `privatumas.html` – atnaujintas `localStorage` aprašas (tema + accordion būsena).
- Pašalinta nenaudojama `applyPreset()` funkcija (`generator.js`).
- HTML semantika sutvarkyta pagal W3C validator'ių (`h2 > button` vietoj `button > h2`; `role="region"` kur reikia).
- Responsive taisyklės atnaujintos naujam `.collapsible-toggle` / `.step-badge` layout'ui.

---

## [1.0.0] - 2026-02-27

### Prideta
- Spin-off Nr. 4: **DI Vaizdo Generatorius** (statinė HTML aplikacija).
- Mini generatorius su šablonais (preset’ai) ir gyva prompto išvestimi.
- Šablonų biblioteka (paruošti promptai) + kopijavimo UX.
- `generator.js` (generatoriaus logika) ir `copy.js` (kopijavimas + toast).
- `style.css` (dizainas + tamsus režimas).
- `tests/structure.test.js` (projekto struktūros testai).

### Pakeista
- `index.html`, `privatumas.html`, `favicon.svg` pritaikyti šiam projektui.
