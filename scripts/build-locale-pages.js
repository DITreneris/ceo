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
