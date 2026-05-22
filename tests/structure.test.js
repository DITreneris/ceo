/**
 * Struktūriniai testai – DI Operacinis Centras (index.html)
 * Tikrina, kad puslapyje yra visi būtini elementai:
 * režimų perjungiklis, formos, output, sesijos, biblioteka, taisyklės, a11y.
 * Paleisti: node tests/structure.test.js (arba npm test)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const PRIVATUMAS_PATH = path.join(__dirname, '..', 'privatumas.html');
const STYLE_PATH = path.join(__dirname, '..', 'style.css');
const TOKENS_CSS_PATH = path.join(__dirname, '..', 'styles', 'tokens.css');
const BASE_CSS_PATH = path.join(__dirname, '..', 'styles', 'base.css');
const SECTIONS_CSS_PATH = path.join(__dirname, '..', 'styles', 'sections.css');
const COMPONENTS_CSS_PATH = path.join(__dirname, '..', 'styles', 'components.css');
const RESPONSIVE_CSS_PATH = path.join(__dirname, '..', 'styles', 'responsive.css');
const GENERATOR_PATH = path.join(__dirname, '..', 'generator.js');
const COPY_PATH = path.join(__dirname, '..', 'copy.js');
const LUCIDE_VENDOR_PATH = path.join(__dirname, '..', 'vendor', 'lucide.min.js');
const LT_ENTRY_PATH = path.join(__dirname, '..', 'lt', 'index.html');
const EN_ENTRY_PATH = path.join(__dirname, '..', 'en', 'index.html');
const OG_SVG_PATH = path.join(__dirname, '..', 'assets', 'og', 'og-cover.svg');
const OG_PNG_PATH = path.join(__dirname, '..', 'assets', 'og', 'og-cover.png');
const SOT_PATH = path.join(__dirname, '..', 'config', 'sot.json');
const COMMERCE_PATH = path.join(__dirname, '..', 'commerce.js');
const SUCCESS_PATH = path.join(__dirname, '..', 'success.html');
const TERMS_PATH = path.join(__dirname, '..', 'terms.html');
const PRIVACY_PATH = path.join(__dirname, '..', 'privacy.html');
const FULFILLMENT_LIB = path.join(__dirname, '..', 'api', '_lib', 'fulfillment.js');
const OPERATING_COVER = path.join(__dirname, '..', 'assets', 'pdf-covers', 'operating.png');
const STRATEGIC_COVER = path.join(__dirname, '..', 'assets', 'pdf-covers', 'strategic.png');
const PDF_COVERS_DIR = path.join(__dirname, '..', 'assets', 'pdf-covers');
const MIN_PDF_COVER_BYTES = 40000;
const MIN_PDF_PREVIEW_PAGE_BYTES = 15000;
const MIN_OG_PNG_BYTES = 20000;

function pngFileOk(filePath, minBytes) {
  if (!fs.existsSync(filePath)) return false;
  try {
    return fs.statSync(filePath).size >= minBytes;
  } catch (e) {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function assert(condition, message) {
  if (!condition) {
    console.error(`\u274C ${message}`);
    return false;
  }
  console.log(`\u2705 ${message}`);
  return true;
}

function run() {
  let passed = 0;
  let failed = 0;

  const html = readFile(INDEX_PATH);
  if (!html) {
    console.error('\u274C index.html nerastas:', INDEX_PATH);
    process.exit(1);
  }

  // --- Operacinis centras ---
  if (assert(html.includes('id="operationsCenter"'), 'Operacinis centras sekcija egzistuoja')) passed++;
  else failed++;

  // --- Režimų perjungiklis (3 režimai) ---
  if (assert(html.includes('data-mode="MASTER"'), 'MASTER režimo tab egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('data-mode="DIENOS"'), 'DIENOS režimo tab egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('data-mode="SAVAITES"'), 'SAVAITĖS režimo tab egzistuoja')) passed++;
  else failed++;

  // --- Režimų formos ---
  if (assert(html.includes('id="form-master"'), 'MASTER forma egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="form-dienos"'), 'DIENOS forma egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="form-savaites"'), 'SAVAITĖS forma egzistuoja')) passed++;
  else failed++;

  // --- Gylio pasirinkimas (3 lygiai) ---
  if (assert(html.includes('data-depth="GREITA"'), 'Gylis: GREITA egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('data-depth="GILU"'), 'Gylis: GILU egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('data-depth="BOARD"'), 'Gylis: BOARD egzistuoja')) passed++;
  else failed++;

  // --- Output ---
  if (assert(html.includes('id="opsOutput"'), 'Output sekcija (opsOutput) egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="outputCharCount"'), 'Simbolių skaičiuoklė (outputCharCount) egzistuoja')) passed++;
  else failed++;

  // --- Sesijų panelė ---
  if (assert(html.includes('id="sessionsPanel"'), 'Sesijų panelė egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="sessionSaveBtn"'), 'Sesijos išsaugojimo mygtukas')) passed++;
  else failed++;
  if (assert(html.includes('id="sessionList"'), 'Sesijų sąrašas egzistuoja')) passed++;
  else failed++;

  // --- Biblioteka ---
  if (assert(html.includes('id="library"'), 'Bibliotekos sekcija egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="libraryGrid"'), 'Bibliotekos grid egzistuoja')) passed++;
  else failed++;

  // --- Taisyklės ---
  if (assert(html.includes('id="rules"'), 'Taisyklių sekcija egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('id="rulesList"'), 'Taisyklių sąrašas egzistuoja')) passed++;
  else failed++;

  // --- Kopijavimo mygtukas ---
  if (assert(html.includes('Kopijuoti užklaus') || html.includes('Kopijuoti prompt') || html.includes('Copy prompt'), 'Kopijavimo mygtukas egzistuoja')) passed++;
  else failed++;

  // --- EN-US public product policy ---
  if (assert(!html.includes('id="langLtBtn"') && !html.includes('id="langEnBtn"'), 'Viešame UI nėra LT/EN kalbos jungiklio')) passed++;
  else failed++;

  // --- Prieinamumas / semantika ---
  if (assert(html.includes('href="#main-content"') && html.includes('skip-link'), 'Skip link į main-content')) passed++;
  else failed++;
  if (assert(html.includes('id="main-content"') && html.includes('<main'), 'Main region (main-content)')) passed++;
  else failed++;
  if (assert(html.includes('id="toast"') && html.includes('role="status"'), 'Toast pranešimas')) passed++;
  else failed++;
  if (assert(html.includes('privacy.html') && html.includes('terms.html') && !html.includes('Privatumas (LT)'), 'Footer rodo tik EN legal nuorodas')) passed++;
  else failed++;
  if (assert(html.includes('promptanatomy.app') || html.includes('promptanatomy.info') || html.includes('promptanatomy.space') || html.includes('promptanatomy.cloud'), 'Nuoroda į Prompt Anatomy (hub)')) passed++;
  else failed++;
  if (assert(html.includes('lang="en-US"'), 'HTML lang="en-US"')) passed++;
  else failed++;
  if (assert(html.includes('<link rel="canonical" href="https://www.promptanatomy.ceo/en/">') && html.includes('hreflang="en-US"'), 'Root canonical/hreflang orientuoti į EN-US')) passed++;
  else failed++;
  if (assert(!html.includes('Available in LT & EN') && !html.includes('hreflang="lt"'), 'Root nebereklamuoja LT kaip aktyvios lokalizacijos')) passed++;
  else failed++;

  // --- ARIA ---
  if (assert(html.includes('role="tablist"'), 'Mode tabs turi role="tablist"')) passed++;
  else failed++;
  if (assert(html.includes('role="tabpanel"'), 'Form panels turi role="tabpanel"')) passed++;
  else failed++;
  if (assert(html.includes('role="radiogroup"'), 'Depth selector turi role="radiogroup"')) passed++;
  else failed++;
  if (assert(html.includes('aria-live="polite"'), 'Live region output')) passed++;
  else failed++;

  // --- Moduliniai failai ---
  if (assert(html.includes('href="style.css"'), 'Link į style.css')) passed++;
  else failed++;
  if (assert(html.includes('src="generator.js"'), 'Script src generator.js')) passed++;
  else failed++;
  if (assert(html.includes('src="copy.js"'), 'Script src copy.js')) passed++;
  else failed++;
  if (
    assert(
      html.includes('src="vendor/lucide.min.js"') && !html.includes('unpkg.com/lucide'),
      'Lucide UMD lokaliai (vendor/lucide.min.js), ne unpkg CDN'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(html.includes('hiddenTextarea'), 'Fallback textarea kopijavimui')) passed++;
  else failed++;

  // --- Failų egzistavimas ---
  const styleFile = readFile(STYLE_PATH);
  if (assert(styleFile !== null && styleFile.length > 0, 'style.css failas egzistuoja')) passed++;
  else failed++;
  const generatorFile = readFile(GENERATOR_PATH);
  if (assert(generatorFile !== null && generatorFile.length > 0, 'generator.js failas egzistuoja')) passed++;
  else failed++;
  const copyFile = readFile(COPY_PATH);
  if (assert(copyFile !== null && copyFile.length > 0, 'copy.js failas egzistuoja')) passed++;
  else failed++;
  const lucideVendorFile = readFile(LUCIDE_VENDOR_PATH);
  if (
    assert(
      lucideVendorFile !== null &&
        lucideVendorFile.length > 5000 &&
        lucideVendorFile.includes('createIcons'),
      'vendor/lucide.min.js egzistuoja ir turi createIcons'
    )
  ) {
    passed++;
  } else failed++;
  const ltEntryFile = readFile(LT_ENTRY_PATH);
  if (assert(ltEntryFile !== null && ltEntryFile.length > 0, 'lt/index.html egzistuoja')) passed++;
  else failed++;
  const enEntryFile = readFile(EN_ENTRY_PATH);
  if (assert(enEntryFile !== null && enEntryFile.length > 0, 'en/index.html egzistuoja')) passed++;
  else failed++;

  // --- Phase 2: lt/en pilnas app markup (ne redirect), lang ir canonical ---
  if (assert(ltEntryFile && ltEntryFile.includes('id="operationsCenter"') && ltEntryFile.includes('id="main-content"'), 'lt/index.html turi pilną app markup')) passed++;
  else failed++;
  if (assert(enEntryFile && enEntryFile.includes('id="operationsCenter"') && enEntryFile.includes('id="main-content"'), 'en/index.html turi pilną app markup')) passed++;
  else failed++;
  if (assert(ltEntryFile && /<html\s+lang="lt"/.test(ltEntryFile), 'lt/index.html lang="lt"')) passed++;
  else failed++;
  if (assert(enEntryFile && /<html\s+lang="en-US"/.test(enEntryFile), 'en/index.html lang="en-US"')) passed++;
  else failed++;
  if (assert(ltEntryFile && !ltEntryFile.includes('window.location.replace'), 'lt/index.html be client-side redirect')) passed++;
  else failed++;
  if (
    assert(
      ltEntryFile &&
        ltEntryFile.includes('src="/vendor/lucide.min.js"') &&
        !ltEntryFile.includes('unpkg.com/lucide'),
      'lt/index.html Lucide iš /vendor/lucide.min.js'
    )
  ) {
    passed++;
  } else failed++;
  if (
    assert(
      enEntryFile &&
        enEntryFile.includes('src="/vendor/lucide.min.js"') &&
        !enEntryFile.includes('unpkg.com/lucide'),
      'en/index.html Lucide iš /vendor/lucide.min.js'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(enEntryFile && !enEntryFile.includes('window.location.replace'), 'en/index.html be client-side redirect')) passed++;
  else failed++;

  // --- LT build: valid depth buttons (no broken </button> from regex) ---
  if (assert(ltEntryFile && !ltEntryFile.includes('<//button>'), 'lt/index.html be sugadintų &lt;//button&gt; žymių')) passed++;
  else failed++;
  if (assert(ltEntryFile && ltEntryFile.includes('Greita</button>'), 'lt/index.html depth: Greita su galiojančiu </button>')) passed++;
  else failed++;
  if (assert(ltEntryFile && ltEntryFile.includes('Gilu</button>'), 'lt/index.html depth: Gilu su galiojančiu </button>')) passed++;
  else failed++;
  if (assert(ltEntryFile && ltEntryFile.includes('Valdybai</button>'), 'lt/index.html depth: Valdybai su galiojančiu </button>')) passed++;
  else failed++;
  if (assert(ltEntryFile && ltEntryFile.includes('Per 5 min. paversk KPI į aiškius savaitės prioritetus.') && ltEntryFile.includes('property="og:title"'), 'lt/index.html LT social og:title')) passed++;
  else failed++;

  // --- Privatumas.html egzistuoja ---
  const privatumas = readFile(PRIVATUMAS_PATH);
  if (assert(privatumas !== null && privatumas.length > 0, 'privatumas.html egzistuoja')) passed++;
  else failed++;
  if (assert(privatumas && privatumas.includes('class="legal-page"') && privatumas.includes('href="style.css"'), 'privatumas.html naudoja style.css ir legal-page')) passed++;
  else failed++;

  // --- generator.js tikrinimas ---
  if (assert(generatorFile && generatorFile.includes('localStorage'), 'localStorage naudojamas (generator.js)')) passed++;
  else failed++;
  if (assert(generatorFile && generatorFile.includes('LIBRARY_PROMPTS'), 'LIBRARY_PROMPTS apibrėžti (generator.js)')) passed++;
  else failed++;
  if (assert(generatorFile && generatorFile.includes('DEPTH_LEVELS'), 'DEPTH_LEVELS apibrėžti (generator.js)')) passed++;
  else failed++;
  if (assert(generatorFile && generatorFile.includes('MODES'), 'MODES apibrėžti (generator.js)')) passed++;
  else failed++;
  if (assert(generatorFile && generatorFile.includes('LANG_KEY'), 'LANG_KEY naudojamas kalbos sticky logikai')) passed++;
  else failed++;

  // --- CSS kintamieji (DS 0.8 partitioned) ---
  const tokensCss = readFile(TOKENS_CSS_PATH);
  const baseCss = readFile(BASE_CSS_PATH);
  const sectionsCss = readFile(SECTIONS_CSS_PATH);
  const componentsCss = readFile(COMPONENTS_CSS_PATH);
  const responsiveCss = readFile(RESPONSIVE_CSS_PATH);
  if (assert(tokensCss && tokensCss.includes('--primary: #4A148C'), 'CSS kintamasis --primary: #4A148C')) passed++;
  else failed++;
  if (assert(tokensCss && tokensCss.includes('--radius-md:'), 'CSS kintamasis --radius-md')) passed++;
  else failed++;
  if (assert(styleFile && styleFile.includes("@import url('styles/tokens.css')"), 'style.css imports tokens.css')) passed++;
  else failed++;
  if (assert(componentsCss && componentsCss.includes('.trust-row'), 'components.css trust-row')) passed++;
  else failed++;
  if (assert(componentsCss && componentsCss.includes('.btn--primary'), 'components.css btn system')) passed++;
  else failed++;

  function hexOutsideTokens(cssText) {
    if (!cssText) return true;
    const hexRe = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
    return (cssText.match(hexRe) || []).length === 0;
  }
  if (assert(hexOutsideTokens(componentsCss), 'components.css be hex (naudoja tokenus)')) passed++;
  else failed++;
  if (assert(hexOutsideTokens(sectionsCss), 'sections.css be hex (naudoja tokenus)')) passed++;
  else failed++;
  if (assert(hexOutsideTokens(baseCss), 'base.css be hex (naudoja tokenus)')) passed++;
  else failed++;
  if (assert(hexOutsideTokens(responsiveCss), 'responsive.css be hex (naudoja tokenus)')) passed++;
  else failed++;

  const visualSpecPath = path.join(__dirname, 'e2e', 'visual-storefront.spec.js');
  if (assert(fs.existsSync(visualSpecPath), 'visual-storefront.spec.js egzistuoja (DS 3.7)')) passed++;
  else failed++;

  function shadowsUseTokens(cssText) {
    if (!cssText) return true;
    return cssText.split('\n').every((line) => {
      if (!line.includes('box-shadow:')) return true;
      if (line.includes('shadow-allow-raw')) return true;
      if (/box-shadow:\s*none/.test(line)) return true;
      return line.includes('var(--shadow');
    });
  }
  if (assert(shadowsUseTokens(sectionsCss), 'sections.css box-shadow naudoja tokenus')) passed++;
  else failed++;
  if (assert(shadowsUseTokens(componentsCss), 'components.css box-shadow naudoja tokenus')) passed++;
  else failed++;
  if (assert(shadowsUseTokens(responsiveCss), 'responsive.css box-shadow naudoja tokenus')) passed++;
  else failed++;

  function countFontSizePx(cssText) {
    if (!cssText) return 0;
    return (cssText.match(/font-size:\s*\d+px/g) || []).length;
  }
  const fontPxTotal =
    countFontSizePx(baseCss) +
    countFontSizePx(sectionsCss) +
    countFontSizePx(componentsCss) +
    countFontSizePx(responsiveCss);
  if (assert(fontPxTotal === 0, `styles/ be raw font-size px (liko ${fontPxTotal})`)) passed++;
  else failed++;

  if (assert(html.includes('btn--secondary'), 'index.html turi .btn--secondary (DS 1.1 markup)')) passed++;
  else failed++;
  if (assert(html.includes('btn btn--primary'), 'index.html turi .btn.btn--primary')) passed++;
  else failed++;

  // --- Open Graph kortelė (social preview) ---
  if (assert(html.includes('<meta property="og:image"') && html.includes('/assets/og/og-cover.png'), 'index.html turi og:image -> /assets/og/og-cover.png')) passed++;
  else failed++;
  if (assert(html.includes('<meta property="og:image:width" content="1200"') && html.includes('<meta property="og:image:height" content="630"'), 'index.html og:image dydis 1200x630')) passed++;
  else failed++;
  if (assert(html.includes('<meta name="twitter:image"') && html.includes('<meta property="og:url"'), 'index.html turi twitter:image ir og:url')) passed++;
  else failed++;
  if (assert(ltEntryFile && /<meta\s+property="og:url"\s+content="[^"]*\/lt\/"/.test(ltEntryFile) && ltEntryFile.includes('content="lt_LT"'), 'lt/index.html og:url baigiasi /lt/ ir og:locale=lt_LT')) passed++;
  else failed++;
  if (assert(ltEntryFile && ltEntryFile.includes('name="robots" content="noindex,follow"'), 'lt/index.html noindex legacy/regression keliui')) passed++;
  else failed++;
  if (assert(enEntryFile && /<meta\s+property="og:url"\s+content="[^"]*\/en\/"/.test(enEntryFile) && enEntryFile.includes('content="en_US"') && enEntryFile.includes('hreflang="en-US"'), 'en/index.html og:url baigiasi /en/, og:locale=en_US ir hreflang=en-US')) passed++;
  else failed++;
  if (assert(fs.existsSync(OG_SVG_PATH), 'assets/og/og-cover.svg šaltinis egzistuoja')) passed++;
  else failed++;

  if (
    assert(
      pngFileOk(OG_PNG_PATH, MIN_OG_PNG_BYTES),
      'assets/og/og-cover.png egzistuoja ir >= ' + MIN_OG_PNG_BYTES + ' bytes (npm run pdf:og)'
    )
  ) {
    passed++;
  } else failed++;

  // --- Paid PDF storefront + fulfillment ---
  const sotRaw = readFile(SOT_PATH);
  let sot = null;
  if (sotRaw) {
    try {
      sot = JSON.parse(sotRaw);
    } catch (e) {
      sot = null;
    }
  }
  if (assert(html.includes('id="pdf-guides"') && html.includes('pdf-guides-section'), 'PDF guides storefront sekcija (#pdf-guides)')) passed++;
  else failed++;
  if (
    assert(
      html.indexOf('id="pdf-guides"') !== -1 &&
        html.indexOf('id="library"') !== -1 &&
        html.indexOf('id="pdf-guides"') < html.indexOf('id="library"'),
      'PDF guides sekcija DOM eilėje prieš library (#pdf-guides < #library)'
    )
  ) {
    passed++;
  } else failed++;
  if (
    assert(
      html.indexOf('id="pdf-guides"') < html.indexOf('id="rules"'),
      'PDF guides sekcija DOM eilėje prieš rules'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(html.includes('data-commerce-pdf-eyebrow') && html.includes('pdf-publisher-strip'), 'PDF storefront copy hooks + publisher strip')) passed++;
  else failed++;
  if (assert(html.includes('top-nav-playbooks-link') && !html.includes('header-cta-link'), 'Sticky Playbooks link; hero has no tertiary CTA link')) passed++;
  else failed++;
  if (
    assert(
      html.includes('hero-layout') &&
        html.includes('hero-prompt-card') &&
        html.includes('id="opsOutputSection"') &&
        !html.includes('ops-work-steps'),
      'Hero refactor: layout, glass card, output anchor, no ops stepper'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(html.includes('$9.99') && html.includes('$19.99'), 'PDF kainos $9.99 ir $19.99 index.html')) passed++;
  else failed++;
  if (
    assert(
      html.includes('CEO AI Strategy Playbook') && html.includes('data-pdf-promise="strategic"'),
      'index.html strategic playbook pavadinimas ir buyerPromise hook'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(html.includes('data-stripe-cta="operating"') && html.includes('data-stripe-cta="strategic"'), 'Stripe CTA data atributai')) passed++;
  else failed++;
  if (assert(html.includes('src="commerce.js"'), 'commerce.js prijungtas index.html')) passed++;
  else failed++;
  if (
    assert(
      pngFileOk(OPERATING_COVER, MIN_PDF_COVER_BYTES) && pngFileOk(STRATEGIC_COVER, MIN_PDF_COVER_BYTES),
      'PDF viršelių PNG (operating, strategic) >= ' + MIN_PDF_COVER_BYTES + ' bytes'
    )
  ) {
    passed++;
  } else failed++;
  ['operating', 'strategic'].forEach(function (key) {
    [2, 3, 4].forEach(function (num) {
      const previewPath = path.join(PDF_COVERS_DIR, key + '-p' + num + '.png');
      if (
        assert(
          pngFileOk(previewPath, MIN_PDF_PREVIEW_PAGE_BYTES),
          'PDF preview ' + key + '-p' + num + '.png >= ' + MIN_PDF_PREVIEW_PAGE_BYTES + ' bytes'
        )
      ) {
        passed++;
      } else failed++;
    });
  });
  if (assert(sot && sot.pdfGuides && sot.pdfGuides.operating && sot.pdfGuides.strategic, 'config/sot.json pdfGuides')) passed++;
  else failed++;
  if (
    assert(
      sot &&
        sot.productDecision &&
        sot.productDecision.strategicPositioning === 'playbook' &&
        sot.pdfGuides.operating.buyerPromise &&
        sot.pdfGuides.strategic.buyerPromise,
      'config/sot.json productDecision + buyerPromise (Phases 1–3)'
    )
  ) {
    passed++;
  } else failed++;
  if (
    assert(
      sot &&
        Array.isArray(sot.buyerProblems) &&
        sot.buyerProblems.length >= 8 &&
        sot.productBlueprint &&
        sot.productBlueprint.flagship &&
        Array.isArray(sot.productBlueprint.deferredModules),
      'config/sot.json buyerProblems + productBlueprint (Phases 2–3)'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(sot && sot.brand && sot.brand.language === 'en-US' && sot.copy && sot.seo && Array.isArray(sot.rules), 'config/sot.json EN-US brand/copy/seo/rules SOT')) passed++;
  else failed++;
  if (
    assert(
      sot && sot.copy && sot.copy.pdfStorefront && sot.copy.pdfStorefront.publisher && sot.copy.pdfStorefront.cardKickers,
      'config/sot.json copy.pdfStorefront (journey wave2)'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(sot && Array.isArray(sot.buyerFaq) && sot.buyerFaq.length >= 3, 'config/sot.json buyerFaq')) passed++;
  else failed++;
  const commerceJs = readFile(COMMERCE_PATH);
  if (assert(commerceJs && commerceJs.includes('initPdfStorefrontCopy'), 'commerce.js initPdfStorefrontCopy')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes('initHeroCopy'), 'commerce.js initHeroCopy')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes('initPdfCardBullets'), 'commerce.js initPdfCardBullets')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes('initOpsUpsell'), 'commerce.js initOpsUpsell')) passed++;
  else failed++;
  if (assert(html.includes('Turn KPIs into weekly priorities') && html.includes('data-copy-hero-headline'), 'Hero benefit-first headline (variant B)')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes('initCommerce') && !commerceJs.includes('<motion>'), 'commerce.js be motion artefaktų')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes("fetch('/config/sot.json'"), 'commerce.js krauna SOT iš root kelio locale puslapiams')) passed++;
  else failed++;
  const fulfillmentLib = readFile(FULFILLMENT_LIB);
  if (assert(fulfillmentLib && fulfillmentLib.includes("id: 'operating'") && fulfillmentLib.includes('999'), 'fulfillment.js operating + 999 cent fallback')) passed++;
  else failed++;
  if (assert(fulfillmentLib && fulfillmentLib.includes("id: 'strategic'") && fulfillmentLib.includes('1999'), 'fulfillment.js strategic + 1999 cent fallback')) passed++;
  else failed++;
  if (assert(fs.existsSync(path.join(__dirname, '..', 'api', 'stripe-webhook.js')), 'api/stripe-webhook.js')) passed++;
  else failed++;
  if (assert(fs.existsSync(path.join(__dirname, '..', 'api', 'download.js')), 'api/download.js')) passed++;
  else failed++;
  if (assert(fs.existsSync(path.join(__dirname, '..', 'api', 'download-link.js')), 'api/download-link.js')) passed++;
  else failed++;
  if (assert(fs.existsSync(path.join(__dirname, '..', 'api', 'fulfillment-health.js')), 'api/fulfillment-health.js')) passed++;
  else failed++;
  const successHtml = readFile(SUCCESS_PATH);
  if (assert(successHtml && successHtml.includes('success-page'), 'success.html egzistuoja')) passed++;
  else failed++;
  const termsHtml = readFile(TERMS_PATH);
  if (assert(termsHtml && termsHtml.includes('paid-pdf-license'), 'terms.html su paid-pdf-license')) passed++;
  else failed++;
  const privacyHtml = readFile(PRIVACY_PATH);
  if (assert(privacyHtml && privacyHtml.includes('legal-page'), 'privacy.html legal-page')) passed++;
  else failed++;
  if (
    assert(
      (sectionsCss && sectionsCss.includes('.pdf-guides-section')) ||
        (styleFile && styleFile.includes('.pdf-guides-section')),
      'sections.css PDF storefront stiliai'
    )
  ) {
    passed++;
  } else failed++;
  if (assert(html.includes('data-trust-row') && html.includes('trust-row'), 'index.html trust-row hooks')) passed++;
  else failed++;
  if (assert(commerceJs && commerceJs.includes('initTrustRow'), 'commerce.js initTrustRow')) passed++;
  else failed++;
  if (assert(sot && sot.copy && sot.copy.trust && Array.isArray(sot.copy.trust.row), 'config/sot.json copy.trust.row')) passed++;
  else failed++;
  if (
    sot &&
    sot.commerce &&
    sot.commerce.allowPlaceholderCheckout === false &&
    assert(
      !html.includes('YOUR_OPERATING_PDF_LINK') && !html.includes('YOUR_STRATEGIC_PDF_LINK'),
      'Publish gate: placeholder Stripe nuorodos pašalintos kai allowPlaceholderCheckout=false'
    )
  ) {
    passed++;
  } else if (sot && sot.commerce && sot.commerce.allowPlaceholderCheckout !== false) {
    console.log('\u2139\uFE0F  Publish gate: allowPlaceholderCheckout=true — placeholder Stripe URL leidžiamos');
  }

  console.log('\n---');
  console.log(`Rezultatas: ${passed} praeina, ${failed} nepraeina.`);
  if (failed > 0) {
    process.exit(1);
  }
  console.log('Visi strukt\u016Briniai testai praeina.\n');
}

run();
