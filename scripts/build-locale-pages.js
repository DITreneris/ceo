/**
 * Phase 2 build: generate lt/index.html and en/index.html from root index.html.
 * Outputs full app HTML (no redirect) with locale-specific lang, title, meta, canonical, hreflang.
 * Asset paths are adjusted for subfolder (../style.css, ../generator.js, etc.).
 * Usage: node scripts/build-locale-pages.js
 * Optional: BASE_PATH=/repo-name node scripts/build-locale-pages.js for GitHub Pages project site.
 */
/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');
const SITE_URL = (process.env.SITE_URL || 'https://www.promptanatomy.ceo').replace(/\/$/, '');

/** LT-only strings for social previews (root index.html is EN-first). */
const LT_SOCIAL = {
  ogTitle: 'Per 5 min. paversk KPI į aiškius savaitės prioritetus.',
  ogDescription:
    'Sugeneruok kopijuojamą operacinės peržiūros promptą CEO ir COO. Įklijuok į ChatGPT, Claude arba Gemini.'
};

const LOCALE_META = {
  lt: {
    lang: 'lt',
    title: 'DI Operacinis Centras – TOP vadovams CEO / COO',
    description: 'DI Operacinis Centras: LT ir EN versijos CEO/COO savaitės prioritetų analizei.'
  },
  en: {
    lang: 'en',
    title: 'Weekly Operations Priorities Generator for CEOs & COOs | AI Operations Center',
    description: 'Turn KPIs into weekly priorities in under 5 minutes. Generate a copy-ready operations review prompt for ChatGPT or Claude.'
  }
};

function buildLocaleHtml(locale) {
  const meta = LOCALE_META[locale];
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  // 1. lang attribute
  html = html.replace(/<html\s+lang="[^"]*"/, '<html lang="' + meta.lang + '"');

  // 2. title
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + meta.title + '</title>');

  // 3. meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    '<meta name="description" content="' + meta.description + '">'
  );

  // 4. canonical (ensure one; replace or add)
  const canonical = SITE_URL + BASE_PATH + '/' + meta.lang + '/';
  if (/<link\s+rel="canonical"/.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>\s*/i, '');
  }
  html = html.replace(
    /(<meta\s+name="description"[^>]+>\s*)/,
    '$1\n    <link rel="canonical" href="' + canonical + '">\n    '
  );

  // 5. hreflang – point to absolute path (with optional base)
  const hrefLt = SITE_URL + BASE_PATH + '/lt/';
  const hrefEn = SITE_URL + BASE_PATH + '/en/';
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="lt"\s+href="[^"]*"\s*\/?>/,
    '<link rel="alternate" hreflang="lt" href="' + hrefLt + '">'
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/,
    '<link rel="alternate" hreflang="en" href="' + hrefEn + '">'
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/,
    '<link rel="alternate" hreflang="x-default" href="' + hrefEn + '">'
  );

  // 5b. Open Graph: locale-aware og:url + og:locale swap. Image stays EN (single universal asset).
  var ogUrl = SITE_URL + BASE_PATH + '/' + meta.lang + '/';
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    '<meta property="og:url" content="' + ogUrl + '">'
  );
  if (locale === 'lt') {
    html = html.replace(
      /<meta\s+property="og:locale"\s+content="en_US"\s*\/?>/,
      '<meta property="og:locale" content="lt_LT">'
    );
    html = html.replace(
      /<meta\s+property="og:locale:alternate"\s+content="lt_LT"\s*\/?>/,
      '<meta property="og:locale:alternate" content="en_US">'
    );
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      '<meta property="og:title" content="' + LT_SOCIAL.ogTitle + '">'
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      '<meta property="og:description" content="' + LT_SOCIAL.ogDescription + '">'
    );
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      '<meta name="twitter:title" content="' + LT_SOCIAL.ogTitle + '">'
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      '<meta name="twitter:description" content="' + LT_SOCIAL.ogDescription + '">'
    );
  }

  // 6. Asset paths: root-relative so they resolve from /lt/ or /en/ (and with BASE_PATH for GitHub Pages)
  var base = BASE_PATH || '';
  html = html.replace(/\bhref="favicon\.svg"/, 'href="' + base + '/favicon.svg"');
  html = html.replace(/\bhref="style\.css"/g, 'href="' + base + '/style.css"');
  html = html.replace(/\bsrc="vendor\/lucide\.min\.js"/, 'src="' + base + '/vendor/lucide.min.js"');
  html = html.replace(/\bsrc="generator\.js"/, 'src="' + base + '/generator.js"');
  html = html.replace(/\bsrc="copy\.js"/, 'src="' + base + '/copy.js"');
  html = html.replace(/\bhref="privatumas\.html"/g, 'href="' + base + '/privatumas.html"');

  // 7. For lt: translate static HTML for crawlers/first paint (source is EN-first)
  if (locale === 'lt') {
    html = html.replace('>Skip to content</a>', '>Pereiti prie turinio</a>');
    html = html.replace('aria-label="Quick navigation"', 'aria-label="Greita navigacija"');
    html = html.replace('aria-label="AI Operations Center"', 'aria-label="DI Operacinis Centras"');
    html = html.replace('>AI Operations Center</span>', '>DI Operacinis Centras</span>');
    html = html.replace('>AI OC</span>', '>DI OC</span>');
    html = html.replace('aria-label="Language selection"', 'aria-label="Kalbos pasirinkimas"');
    html = html.replace('aria-label="Switch to Lithuanian"', 'aria-label="Perjungti į lietuvių kalbą"');
    html = html.replace('aria-label="Toggle dark mode"', 'aria-label="Perjungti tamsų režimą"');
    html = html.replace('>Copy prompt</button>', '>Kopijuoti užklausą</button>');

    html = html.replace('aria-label="Prompt anatomy – interactive training (opens in new tab)"', 'aria-label="Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"');
    html = html.replace('>Prompt anatomy</a>', '>Promptų anatomija</a>');
    html = html.replace('aria-label="Prompt Anatomy Hub module: Operations (CEO/COO)"', 'aria-label="Promptų anatomija Hub modulis: Operacijos (CEO/COO)"');
    html = html.replace('>Hub module: Operations</span>', '>Hub modulis: Operacijos</span>');

    html = html.replace('</div>\n            <h1>AI Operations Center</h1>', '</div>\n            <h1>DI Operacinis Centras</h1>');
    html = html.replace(
      '<p>Get clear weekly priorities and actions in 5 minutes.<br>Enter your numbers and generate an executive-grade AI prompt.</p>',
      '<p>Per 5 min. gauk aiškius savaitės prioritetus ir veiksmus.<br>Įvesk skaičius ir išsisaugok CEO lygio DI užklausą.</p>'
    );
    html = html.replace('aria-label="Work steps"', 'aria-label="Darbo žingsniai"');
    html = html.replace('<span class="header-step-num">1</span> Mode</a>', '<span class="header-step-num">1</span> Režimas</a>');
    html = html.replace('<span class="header-step-num">2</span> Form</a>', '<span class="header-step-num">2</span> Forma</a>');
    html = html.replace('<span class="header-step-num">3</span> Result</a>', '<span class="header-step-num">3</span> Rezultatas</a>');
    html = html.replace('<span class="header-step-num">4</span> Library</a>', '<span class="header-step-num">4</span> Biblioteka</a>');
    html = html.replace('aria-label="Get weekly priorities in operations center">Get weekly priorities</a>', 'aria-label="Gauti savaitės prioritetus operaciniame centre">Gauti savaitės prioritetus</a>');
    html = html.replace('aria-label="Browse ready-made templates">Browse templates ↓</a>', 'aria-label="Peržiūrėti paruoštus šablonus">Rinktis šabloną ↓</a>');
    html = html.replace('>Under 5 min · Result: clear weekly priorities.</p>', '>Užtruksi iki 5 min. • Rezultatas: aiškūs savaitės prioritetai.</p>');

    html = html.replace('Analysis depth', 'Analizės gylis');
    html = html.replace('aria-label="Prompt depth level"', 'aria-label="Promptų gylio lygis"');
    html = html.replace('Not sure? Start with Fast.', 'Nežinai? Rinkis Greita.');
    // Match label + closing tag (regex literal cannot use unescaped `/` before `</button>`).
    html = html.replace(
      /(<i data-lucide="zap" class="icon icon--sm"><\/i>)\s*Fast\s*<\/button>/,
      '$1 Greita</button>'
    );
    html = html.replace(
      /(<i data-lucide="layers" class="icon icon--sm"><\/i>)\s*Deep\s*<\/button>/,
      '$1 Gilu</button>'
    );
    html = html.replace(
      /(<i data-lucide="briefcase" class="icon icon--sm"><\/i>)\s*Board\s*<\/button>/,
      '$1 Valdybai</button>'
    );

    html = html.replace('aria-label="Open Prompt Anatomy Telegram community in new tab"', 'aria-label="Atidaryti Promptų anatomija Telegram bendruomenę naujame lange"');
    html = html.replace('>Join Telegram community</a>', '>Prisijungti prie Telegram bendruomenės</a>');
    html = html.replace('aria-label="Explore the full Prompt Anatomy AI OS – all Hub modules (opens in new tab)"', 'aria-label="Atrask visą Promptų anatomijos AI OS – visus Hub modulius (atidaroma naujame lange)"');
    html = html.replace('>Explore all Hub modules →</a>', '>Atrask visus Hub modulius →</a>');
    html = html.replace('>Prompt created.<br>Want more?</h2>', '>Promptas sukurtas.<br>Nori daugiau?</h2>');

    // Footer
    html = html.replace('>Run your business with AI <span', '>Valdyk verslą su DI <span');
    html = html.replace('>A 5‑minute operations prompt generator for CEOs &amp; COOs.</p>', '>5 min. operacinių promptų generatorius CEO ir COO.</p>');
    html = html.replace('>Part of Prompt Anatomy (AI Operating System) — Operations module.</p>', '>Promptų anatomijos (DI operacinės sistemos) dalis — Operacijų modulis.</p>');
    html = html.replace('aria-label="FAQ"', 'aria-label="DUK"');
    html = html.replace('>What is this?</summary>', '>Kas tai?</summary>');
    html = html.replace('>Who is it for?</summary>', '>Kam skirta?</summary>');
    html = html.replace('>How do I use it?</summary>', '>Kaip naudoti?</summary>');
    html = html.replace('>Want the full AI Operating System?</summary>', '>Nori pilnos DI operacinės sistemos?</summary>');
    html = html.replace('>Do you store my data?</summary>', '>Ar jūs saugote mano duomenis?</summary>');
    html = html.replace(
      '>What is the difference between Fast, Deep, and Board?</summary>',
      '>Kuo skiriasi Greita, Gilu ir Valdybai?</summary>'
    );
    html = html.replace(
      'AI Operations Center is a prompt generator for CEOs and COOs. Enter revenue, expenses, cash, runway, and context—then copy a ready-to-run operations review prompt into ChatGPT, Claude, or Gemini.',
      'DI Operacinis Centras – promptų generatorius CEO ir COO. Įvesk pajamas, išlaidas, grynuosius, veikimo rezervą ir kontekstą – tuomet nukopijuok paruoštą operacinės peržiūros promptą į ChatGPT, Claude arba Gemini.'
    );
    html = html.replace(
      'Founders, CEOs, COOs, and operators who run a weekly operating cadence.',
      'Įkūrėjams, CEO, COO ir vadovams, kurie turi savaitinę operacinę peržiūrą.'
    );
    html = html.replace(
      'Explore the complete Prompt Anatomy training and all Hub modules at <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.',
      'Pilną Promptų anatomijos mokymą ir visus Hub modulius rasite <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.'
    );
    html = html.replace(
      'Saved sessions are stored locally in your browser (localStorage). This page does not upload your inputs to a server.',
      'Sesijos išsaugomos tik tavo naršyklėje (localStorage). Šis puslapis neįkelia tavo įvesties į serverį.'
    );
    html = html.replace('Pick a mode (Strategic/Daily/Weekly), choose depth (Fast/Deep/Board), fill the form, copy the prompt.', 'Pasirink režimą (Strateginis / Dienos / Savaitės), gylį (Greita / Gilu / Valdybai), užpildyk formą, nukopijuok promptą.');
    html = html.replace(
      'Fast gives a short prioritized answer, Deep adds analysis and rationale, and Board formats a concise executive summary with risks and actions.',
      'Greita pateikia trumpą prioritetų sąrašą. Gilu prideda analizę ir pagrindimą. Valdybai suformuoja trumpą formalią santrauką su rizikomis ir veiksmais.'
    );

    // FAQ JSON-LD (LT)
    html = html.replace('"name": "What is AI Operations Center?"', '"name": "Kas yra DI Operacinis Centras?"');
    html = html.replace('"name": "Who is it for?"', '"name": "Kam skirta?"');
    html = html.replace('"name": "How do I use it?"', '"name": "Kaip naudoti?"');
    html = html.replace('"name": "Want the full AI Operating System?"', '"name": "Nori pilnos DI operacinės sistemos?"');
    html = html.replace('"name": "Do you store my data?"', '"name": "Ar jūs saugote mano duomenis?"');
    html = html.replace('"name": "What is the difference between Fast, Deep, and Board?"', '"name": "Kuo skiriasi Greita, Gilu ir Valdybai?"');
    html = html.replace(
      '"text": "Explore the complete Prompt Anatomy training and Hub modules at https://www.promptanatomy.app/"',
      '"text": "Pilną Promptų anatomijos mokymą ir Hub modulius rasite https://www.promptanatomy.app/"'
    );
    html = html.replace(
      '"text": "Saved sessions are stored locally in your browser (localStorage). This page does not upload your inputs to a server."',
      '"text": "Sesijos saugomos tik tavo naršyklėje (localStorage). Šis puslapis neįkelia įvesties į serverį."'
    );

    html = html.replace('>3 modes · 3 depths</span>', '>3 režimai · 3 gylio lygiai</span>');
    html = html.replace('aria-label="Prompt Anatomy Hub modules"', 'aria-label="Promptų anatomijos Hub moduliai"');
    html = html.replace('>you are here</span>', '>jūs čia</span>');

    html = html.replace('Training material. All rights reserved.', 'Mokymų medžiaga. Visos teisės saugomos.');
    html = html.replace('>Privacy</a>', '>Privatumas</a>');
    html = html.replace('aria-label="Text to copy field"', 'aria-label="Kopijuojamo teksto laukas"');
    html = html.replace('aria-label="Notification"', 'aria-label="Pranešimas"');

    // 6-block hint
    html = html.replace('These rules follow <a', 'Šios taisyklės grindžiamos <a');
    html = html.replace('>Prompt Anatomy</a>\'s 6-block methodology:', '>Promptų anatomijos</a> 6-block metodologija:');
  }

  return html;
}

function main() {
  ['lt', 'en'].forEach(function (locale) {
    const outDir = path.join(ROOT, locale);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'index.html');
    const html = buildLocaleHtml(locale);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Wrote ' + outPath);
  });
}

main();
