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
const GENERATOR_PATH = path.join(__dirname, '..', 'generator.js');
const COPY_PATH = path.join(__dirname, '..', 'copy.js');
const LUCIDE_VENDOR_PATH = path.join(__dirname, '..', 'vendor', 'lucide.min.js');
const LT_ENTRY_PATH = path.join(__dirname, '..', 'lt', 'index.html');
const EN_ENTRY_PATH = path.join(__dirname, '..', 'en', 'index.html');
const OG_SVG_PATH = path.join(__dirname, '..', 'assets', 'og', 'og-cover.svg');
const OG_PNG_PATH = path.join(__dirname, '..', 'assets', 'og', 'og-cover.png');

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

  // --- Kalbos jungiklis ---
  if (assert(html.includes('id="langLtBtn"') && html.includes('id="langEnBtn"'), 'Kalbos jungiklis LT/EN egzistuoja')) passed++;
  else failed++;

  // --- Prieinamumas / semantika ---
  if (assert(html.includes('href="#main-content"') && html.includes('skip-link'), 'Skip link į main-content')) passed++;
  else failed++;
  if (assert(html.includes('id="main-content"') && html.includes('<main'), 'Main region (main-content)')) passed++;
  else failed++;
  if (assert(html.includes('id="toast"') && html.includes('role="status"'), 'Toast pranešimas')) passed++;
  else failed++;
  if (assert(html.includes('privatumas.html'), 'Nuoroda į privatumas.html')) passed++;
  else failed++;
  if (assert(html.includes('promptanatomy.app') || html.includes('promptanatomy.info') || html.includes('promptanatomy.space') || html.includes('promptanatomy.cloud'), 'Nuoroda į Prompt Anatomy (hub)')) passed++;
  else failed++;
  if (assert(html.includes('lang="en"'), 'HTML lang="en"')) passed++;
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
  if (assert(enEntryFile && /<html\s+lang="en"/.test(enEntryFile), 'en/index.html lang="en"')) passed++;
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

  // --- CSS kintamieji ---
  if (assert(styleFile && styleFile.includes('--primary: #4A148C'), 'CSS kintamasis --primary: #4A148C')) passed++;
  else failed++;
  if (assert(styleFile && styleFile.includes('--radius-md:'), 'CSS kintamasis --radius-md')) passed++;
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
  if (assert(enEntryFile && /<meta\s+property="og:url"\s+content="[^"]*\/en\/"/.test(enEntryFile) && enEntryFile.includes('content="en_US"'), 'en/index.html og:url baigiasi /en/ ir og:locale=en_US')) passed++;
  else failed++;
  if (assert(fs.existsSync(OG_SVG_PATH), 'assets/og/og-cover.svg šaltinis egzistuoja')) passed++;
  else failed++;

  // Soft warning: PNG turi būti eksportuotas prieš deploy (žr. assets/og/README.md).
  if (!fs.existsSync(OG_PNG_PATH)) {
    console.warn('\u26A0\uFE0F  WARN: assets/og/og-cover.png nerastas. Eksportuok prieš deploy: npx -y svgexport assets/og/og-cover.svg assets/og/og-cover.png 1200:630');
  }

  console.log('\n---');
  console.log(`Rezultatas: ${passed} praeina, ${failed} nepraeina.`);
  if (failed > 0) {
    process.exit(1);
  }
  console.log('Visi strukt\u016Briniai testai praeina.\n');
}

run();
