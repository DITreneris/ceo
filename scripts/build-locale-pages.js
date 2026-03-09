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

const LOCALE_META = {
  lt: {
    lang: 'lt',
    title: 'DI Operacinis Centras – TOP vadovams CEO / COO',
    description: 'DI Operacinis Centras: LT ir EN versijos CEO/COO savaitės prioritetų analizei.'
  },
  en: {
    lang: 'en',
    title: 'DI Operations Center – for CEOs & COOs',
    description: 'Get clear weekly priorities in 5 minutes. CEO/COO-ready AI prompts. Available in LT & EN.'
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
  const canonical = BASE_PATH + '/' + meta.lang + '/';
  if (/<link\s+rel="canonical"/.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>\s*/i, '');
  }
  html = html.replace(
    /(<meta\s+name="description"[^>]+>\s*)/,
    '$1\n    <link rel="canonical" href="' + canonical + '">\n    '
  );

  // 5. hreflang – point to absolute path (with optional base)
  const hrefLt = BASE_PATH + '/lt/';
  const hrefEn = BASE_PATH + '/en/';
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
    '<link rel="alternate" hreflang="x-default" href="' + hrefLt + '">'
  );

  // 6. Asset paths: root-relative so they resolve from /lt/ or /en/ (and with BASE_PATH for GitHub Pages)
  var base = BASE_PATH || '';
  html = html.replace(/\bhref="favicon\.svg"/, 'href="' + base + '/favicon.svg"');
  html = html.replace(/\bhref="style\.css"/, 'href="' + base + '/style.css"');
  html = html.replace(/\bsrc="generator\.js"/, 'src="' + base + '/generator.js"');
  html = html.replace(/\bsrc="copy\.js"/, 'src="' + base + '/copy.js"');
  html = html.replace(/\bhref="privatumas\.html"/g, 'href="' + base + '/privatumas.html"');

  // 7. For en: anatomy link text and aria-labels in static HTML (a11y/crawlers)
  if (locale === 'en') {
    html = html.replace(
      'aria-label="Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"',
      'aria-label="Full Prompt anatomy – interactive training (opens in new tab)"'
    );
    html = html.replace(
      'aria-label="Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"',
      'aria-label="Prompt anatomy – interactive training (opens in new tab)"'
    );
    html = html.replace('>Promptų anatomija →</a>', '>Prompt anatomy →</a>');
    html = html.replace('>Promptų anatomija</a>', '>Prompt anatomy</a>');

    // 8. EN static body (language audit: EN page in English, DI→AI for prompts/tools)
    html = html.replace('>Pereiti prie turinio</a>', '>Skip to content</a>');
    html = html.replace('aria-label="Greita navigacija"', 'aria-label="Quick navigation"');
    html = html.replace('aria-label="DI Operacinis Centras"', 'aria-label="DI Operations Center"');
    html = html.replace('>DI Operacinis Centras</span>', '>DI Operations Center</span>');
    html = html.replace('aria-label="Kalbos pasirinkimas"', 'aria-label="Language selection"');
    html = html.replace('aria-label="Perjungti į lietuvių kalbą"', 'aria-label="Switch to Lithuanian"');
    html = html.replace('aria-label="Perjungti tamsų režimą"', 'aria-label="Toggle dark mode"');
    html = html.replace('>Kopijuoti užklausą</button>', '>Copy prompt</button>');
    html = html.replace('aria-label="DI Operacinis Centras, Spin-off Nr. 5"', 'aria-label="DI Operations Center, Spin-off No. 5"');
    html = html.replace('</div>\n            <h1>DI Operacinis Centras</h1>', '</div>\n            <h1>DI Operations Center</h1>');
    html = html.replace(
      '<p>Per 5 min. gauk aiškius savaitės prioritetus ir veiksmus.<br>Įvesk skaičius ir išsisaugok CEO lygio DI užklausą.</p>',
      '<p>Get clear weekly priorities and actions in 5 minutes.<br>Enter your numbers and generate an executive-grade AI prompt.</p>'
    );
    html = html.replace('aria-label="Darbo žingsniai"', 'aria-label="Work steps"');
    html = html.replace('<span class="header-step-num">1</span> Režimas</a>', '<span class="header-step-num">1</span> Mode</a>');
    html = html.replace('<span class="header-step-num">2</span> Forma</a>', '<span class="header-step-num">2</span> Form</a>');
    html = html.replace('<span class="header-step-num">3</span> Rezultatas</a>', '<span class="header-step-num">3</span> Result</a>');
    html = html.replace('<span class="header-step-num">4</span> Biblioteka</a>', '<span class="header-step-num">4</span> Library</a>');
    html = html.replace('aria-label="Gauti savaitės prioritetus operaciniame centre">Gauti savaitės prioritetus</a>', 'aria-label="Get weekly priorities in operations center">Get weekly priorities</a>');
    html = html.replace('aria-label="Peržiūrėti paruoštus šablonus">Rinktis šabloną ↓</a>', 'aria-label="Browse ready-made templates">Browse templates ↓</a>');
    html = html.replace('>Užtruksi iki 5 min. • Rezultatas: aiškūs savaitės prioritetai.</p>', '>Under 5 min · Result: clear weekly priorities.</p>');
    html = html.replace('</span>\n                    <span class="collapsible-value">Pasirink režimą, užpildyk laukus – DI užklausa sugeneruojama automatiškai</span>', '</span>\n                    <span class="collapsible-value">Choose a mode, fill in the fields — your AI prompt is generated automatically.</span>');
    html = html.replace('>Operacinis centras</span>', '>Operations center</span>');
    html = html.replace('aria-label="Režimo pasirinkimas"', 'aria-label="Mode selection"');
    html = html.replace('>STRATEGINIS</span>\n                    <span class="mode-tab-desc">Strateginis kontekstas</span>', '>STRATEGIC</span>\n                    <span class="mode-tab-desc">Strategic context</span>');
    html = html.replace('>DIENOS</span>\n                    <span class="mode-tab-desc">Vakarykštės operacijos</span>', '>DAILY</span>\n                    <span class="mode-tab-desc">Yesterday\'s operations</span>');
    html = html.replace('>SAVAITĖS</span>\n                    <span class="mode-tab-desc">Projektai ir runway</span>', '>WEEKLY</span>\n                    <span class="mode-tab-desc">Projects and runway</span>');
    html = html.replace('Analizės gylis', 'Analysis depth');
    html = html.replace('aria-label="Promptų gylio lygis"', 'aria-label="Prompt depth level"');
    html = html.replace('Nežinai? Rinkis Greita.', 'Not sure? Start with Fast.');
    html = html.replace(/\s+Greita\s*</g, ' Fast</');
    html = html.replace(/\s+Gilu\s*</g, ' Deep</');
    html = html.replace(/\s+Valdybai\s*</g, ' Board</');
    html = html.replace('>Greita</span>', '>Fast</span>'); // depth badge in output
    html = html.replace('aria-label="Kopijuoti sugeneruotą promptą"', 'aria-label="Copy generated prompt"');
    html = html.replace('>Strateginis kontekstas</div>', '>Strategic context</div>');
    html = html.replace('aria-label="Sugeneruota DI užklausa"', 'aria-label="Generated AI prompt"');
    html = html.replace('aria-label="Sugeneruota DI užklausa – galite redaguoti"', 'aria-label="Generated AI prompt – you can edit"');
    html = html.replace('aria-label="DI įrankių pasirinkimas"', 'aria-label="AI tool selection"');
    html = html.replace('aria-label="Atidaryti DI įrankį"', 'aria-label="Open AI tool"');
    html = html.replace('>Nori tęsti analizę? Pasirink įrankį:</p>', '>Continue in:</p>');
    html = html.replace('aria-label="Atidaryti ChatGPT naujame lange">\n                                        Atidaryti ChatGPT', 'aria-label="Open ChatGPT in new tab">\n                                        Open ChatGPT');
    html = html.replace('aria-label="Atidaryti Claude naujame lange">\n                                        Atidaryti Claude', 'aria-label="Open Claude in new tab">\n                                        Open Claude');
    html = html.replace('aria-label="Atidaryti Gemini naujame lange">\n                                        Atidaryti Gemini', 'aria-label="Open Gemini in new tab">\n                                        Open Gemini');
    html = html.replace('>KOPIJUOTI UŽKLAUSĄ IR ANALIZUOTI</span>', '>Copy prompt & analyze</span>');
    html = html.replace('aria-label="Kopijuoti užklausą"', 'aria-label="Copy prompt"');
    html = html.replace('>Sesijos</span>', '>Sessions</span>');
    html = html.replace('>Išsaugoti</button>', '>Save</button>');
    html = html.replace('>Ištrinti sesijas</button>', '>Clear sessions</button>');
    html = html.replace('aria-label="Išsaugotos sesijos"', 'aria-label="Saved sessions"');
    html = html.replace('Sesijų dar nėra. Sukurk pirmą analizę.', 'No sessions yet. Create your first analysis.');
    html = html.replace('>Šablonų biblioteka</span>', '>Template library</span>');
    html = html.replace('>Paruošti užklausų šablonai – taikyk formoje arba kopijuok</span>', '>Ready-made prompt templates – apply in form or copy</span>');
    html = html.replace('>Ekonominės drausmės taisyklės</span>', '>Economic discipline rules</span>');
    html = html.replace('>Vadovo sprendimų sistema – kiekvienas promptas laikosi šių principų</span>', '>Decision framework – every prompt follows these principles</span>');
    html = html.replace('aria-label="Atidaryti Promptų anatomija WhatsApp grupę naujame lange">Prisijungti prie WhatsApp grupės</a>', 'aria-label="Open Prompt Anatomy WhatsApp group in new tab">Join WhatsApp group</a>');
    html = html.replace('>Promptas sukurtas.<br>Nori daugiau?</h2>', '>Prompt created.<br>Want more?</h2>');
    html = html.replace('>Valdyk verslą su DI <span', '>Run your business with AI <span');
    html = html.replace('>Trys režimai. Trys gylio lygiai. Vienas tikslas – geresni sprendimai.</p>', '>Three modes. Three depth levels. One goal – better decisions.</p>');
    html = html.replace('>Tai Spin-off Nr. 5 iš „Promptų anatomijos".</p>', '>This is Spin-off No. 5 from "Prompt anatomy".</p>');
    html = html.replace(' Operacinis centras</span>', ' Operations center</span>');
    html = html.replace(' 3 režimai</span>', ' 3 modes</span>');
    html = html.replace(' 3 gylio lygiai</span>', ' 3 depth levels</span>');
    html = html.replace('Mokymų medžiaga. Visos teisės saugomos.', 'Training material. All rights reserved.');
    html = html.replace('>Privatumas</a>', '>Privacy</a>');
    html = html.replace('aria-label="Kopijuojamo teksto laukas"', 'aria-label="Text to copy field"');
    html = html.replace('aria-label="Pranešimas"', 'aria-label="Notification"');
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
