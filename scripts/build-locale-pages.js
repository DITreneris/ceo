/**
 * Phase 2 build: generate lt/index.html and en/index.html from root index.html.
 * SOT (2026-05): product development is EN-only (USA). Root index.html = EN template.
 * lt/ is generated for hreflang + regression tests only — do not extend LT copy here.
 * en/ is the canonical locale for all content changes.
 * Usage: node scripts/build-locale-pages.js
 * Optional: BASE_PATH=/repo-name node scripts/build-locale-pages.js for GitHub Pages project site.
 */
/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOT_PATH = path.join(ROOT, 'config', 'sot.json');
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');
const SITE_URL = (process.env.SITE_URL || 'https://www.promptanatomy.ceo').replace(/\/$/, '');

function loadSot() {
  return JSON.parse(fs.readFileSync(SOT_PATH, 'utf8'));
}

function parseUsdPrice(priceStr) {
  var m = String(priceStr).match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

function jsonLdScript(obj) {
  return '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + '\n    </script>\n    ';
}

function escapeHtmlText(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** EN-only: SSR purchase FAQ so AI crawlers see Q&A without running commerce.js. */
function injectBuyerFaqSsr(html, sot) {
  var items = Array.isArray(sot.buyerFaq) ? sot.buyerFaq : [];
  if (!items.length) {
    return html;
  }
  if (!/<div\s+data-buyer-faq-list\s*>\s*<\/div>/i.test(html)) {
    return html;
  }
  var inner = items
    .map(function (item) {
      if (!item || !item.q || !item.a) return '';
      var idAttr = item.id ? ' id="' + escapeHtmlText(item.id) + '"' : '';
      return (
        '<details class="buyer-faq-item"' +
        idAttr +
        '>' +
        '<summary class="buyer-faq-q">' +
        escapeHtmlText(item.q) +
        '</summary>' +
        '<div class="buyer-faq-a">' +
        escapeHtmlText(item.a) +
        '</div></details>'
      );
    })
    .join('');
  return html.replace(
    /<div\s+data-buyer-faq-list\s*>\s*<\/div>/i,
    '<div data-buyer-faq-list>' + inner + '</div>'
  );
}

/** EN-only: enrich Organization + Person (founder) + WebSite + Product + HowTo from sot.geo. Root index.html unchanged. */
function injectGeoSchema(html, sot) {
  var geo = sot.geo;
  if (!geo || !geo.entity) {
    return html;
  }
  var siteUrl = (geo.siteUrl || SITE_URL).replace(/\/$/, '');
  var orgId = geo.entity.organizationId;
  var founderId = geo.entity.founderId;
  var enUrl = siteUrl + geo.canonicalPath;

  var organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'Prompt Anatomy',
    url: siteUrl + '/',
    logo: geo.entity.logo,
    founder: { '@id': founderId },
    sameAs: geo.entity.sameAs,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1311 Park St, Unit #654',
      addressLocality: 'Alameda',
      addressRegion: 'CA',
      postalCode: '94501',
      addressCountry: 'US'
    }
  };

  var person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': founderId,
    name: geo.entity.founder.name,
    jobTitle: geo.entity.founder.jobTitle,
    worksFor: { '@id': orgId },
    sameAs: geo.entity.founder.sameAs
  };

  var website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl + '/#website',
    url: enUrl,
    name: sot.brand && sot.brand.productName ? sot.brand.productName : 'AI Operations Center',
    inLanguage: 'en-US',
    publisher: { '@id': orgId }
  };

  var refundDays =
    sot.commerce && typeof sot.commerce.refundWindowDays === 'number'
      ? sot.commerce.refundWindowDays
      : 14;

  function digitalOfferExtras() {
    return {
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'USD'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY'
          }
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: refundDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
    };
  }

  function resolveCoverImage(guide) {
    var cover = guide && guide.coverImage;
    if (!cover) {
      return geo.entity.logo;
    }
    if (/^https?:\/\//i.test(cover)) {
      return cover;
    }
    return siteUrl + (cover.startsWith('/') ? cover : '/' + cover);
  }

  function productForGuide(key) {
    var guide = sot.pdfGuides[key];
    var price = sot.commerce && sot.commerce.pricing ? sot.commerce.pricing[key] : null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: guide.label,
      description: guide.buyerPromise,
      image: resolveCoverImage(guide),
      brand: {
        '@type': 'Brand',
        name: 'Prompt Anatomy'
      },
      offers: Object.assign(
        {
          '@type': 'Offer',
          price: parseUsdPrice(price && price.now),
          priceCurrency: 'USD',
          url: enUrl + '#pdf-guides',
          availability: 'https://schema.org/InStock'
        },
        digitalOfferExtras()
      )
    };
  }

  function buyerFaqPage() {
    var items = Array.isArray(sot.buyerFaq) ? sot.buyerFaq : [];
    if (!items.length) {
      return null;
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': enUrl + '#buyer-faq',
      mainEntity: items.map(function (item) {
        return {
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        };
      })
    };
  }

  var howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Turn scattered KPIs into a clear weekly CEO brief with the AI Operations Center',
    description:
      'Use the free CEO/COO operating brief builder: pick a mode, set depth, fill KPIs, copy the structured prompt into ChatGPT, Claude, or Gemini.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose mode and depth',
        text: 'Pick Strategic, Daily, or Weekly mode and Fast, Deep, or Board depth.'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Add business context',
        text: 'Enter revenue, expenses, cash, runway, and context. The brief updates live.'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Copy and run in your AI tool',
        text: 'Copy the CEO-ready operating brief and paste the structured prompt into ChatGPT, Claude, or Gemini.'
      }
    ]
  };

  // Match only the Organization block (not WebApplication/FAQPage scripts that precede it).
  html = html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "Organization"[\s\S]*?<\/script>\s*/,
    jsonLdScript(organization)
  );

  var buyerFaqLd = buyerFaqPage();
  var extra =
    jsonLdScript(person) +
    jsonLdScript(website) +
    jsonLdScript(productForGuide('operating')) +
    jsonLdScript(productForGuide('strategic')) +
    jsonLdScript(howTo) +
    (buyerFaqLd ? jsonLdScript(buyerFaqLd) : '');

  return html.replace('</head>', extra + '</head>');
}

/** LT-only strings for social previews (root index.html is EN-first). */
const LT_SOCIAL = {
  ogTitle: 'Per 5 min. paversk KPI į aiškius savaitės prioritetus.',
  ogDescription:
    'Sugeneruok kopijuojamą operacinės peržiūros promptą CEO ir COO. Įklijuok į ChatGPT, Claude arba Gemini.'
};

const LOCALE_META = {
  lt: {
    lang: 'lt',
    path: 'lt',
    title: 'DI Operacinis Centras – TOP vadovams CEO / COO',
    description: 'DI Operacinis Centras: legacy Lithuanian regression page for CEO/COO operations prompt testing.'
  },
  en: {
    lang: 'en-US',
    path: 'en',
    title: '',
    description: ''
  }
};

function getLocaleMeta(locale) {
  if (locale === 'en') {
    var sot = loadSot();
    return {
      lang: 'en-US',
      path: 'en',
      title: (sot.seo && sot.seo.title) || 'Turn Scattered KPIs into a Weekly CEO Brief | AI Operations Center',
      description: (sot.seo && sot.seo.description) || 'Turn KPIs, runway, and pipeline into a CEO-ready weekly operating brief in ~5 minutes.'
    };
  }
  return LOCALE_META.lt;
}

function buildLocaleHtml(locale) {
  const meta = getLocaleMeta(locale);
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
  const canonical = SITE_URL + BASE_PATH + '/' + meta.path + '/';
  if (/<link\s+rel="canonical"/.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>\s*/i, '');
  }
  html = html.replace(
    /(<meta\s+name="description"[^>]+>\s*)/,
    '$1\n    <link rel="canonical" href="' + canonical + '">\n    '
  );
  if (locale === 'lt') {
    html = html.replace(
      /(<link\s+rel="canonical"[^>]+>\s*)/,
      '$1\n    <meta name="robots" content="noindex,follow">\n    '
    );
  }

  // 5. hreflang – EN-US is the only public locale; /lt/ remains a noindex regression path.
  const hrefEn = SITE_URL + BASE_PATH + '/en/';
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en(?:-US)?"\s+href="[^"]*"\s*\/?>/,
    '<link rel="alternate" hreflang="en-US" href="' + hrefEn + '">'
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/,
    '<link rel="alternate" hreflang="x-default" href="' + hrefEn + '">'
  );

  // 5b. Open Graph: locale-aware og:url + og:locale swap. Image stays EN (single universal asset).
  var ogUrl = SITE_URL + BASE_PATH + '/' + meta.path + '/';
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
  html = html.replace(/\bhref="style\.css(\?[^"]*)?"/g, 'href="' + base + '/style.css?v=2.1.2"');
  html = html.replace(/\bsrc="vendor\/lucide\.min\.js(\?[^"]*)?"/, 'src="' + base + '/vendor/lucide.min.js?v=2.1.3"');
  html = html.replace(/\bsrc="generator\.js(\?[^"]*)?"/, 'src="' + base + '/generator.js?v=2.1.3"');
  html = html.replace(/\bsrc="copy\.js(\?[^"]*)?"/, 'src="' + base + '/copy.js?v=2.1.3"');
  html = html.replace(/\bsrc="commerce\.js(\?[^"]*)?"/, 'src="' + base + '/commerce.js?v=2.1.3"');
  html = html.replace(
    /\bsrc="(\/assets\/pdf-covers\/(?:operating|strategic)\.png)(\?[^"]*)?"/g,
    'src="$1?v=2.1.3"'
  );
  html = html.replace(/\bhref="privatumas\.html"/g, 'href="' + base + '/privatumas.html"');
  html = html.replace(/\bhref="terms\.html"/g, 'href="' + base + '/terms.html"');
  html = html.replace(/\bhref="privacy\.html"/g, 'href="' + base + '/privacy.html"');

  // 7. For lt: translate static HTML for crawlers/first paint (source is EN-first)
  if (locale === 'lt') {
    html = html.replace('>Skip to content</a>', '>Pereiti prie turinio</a>');
    html = html.replace('aria-label="Quick navigation"', 'aria-label="Greita navigacija"');
    html = html.replace('aria-label="AI Operations Center"', 'aria-label="DI Operacinis Centras"');
    html = html.replace('>AI Operations Center</span>', '>DI Operacinis Centras</span>');
    html = html.replace('>AI OC</span>', '>DI OC</span>');
    html = html.replace('aria-label="Language selection"', 'aria-label="Kalbos pasirinkimas"');
    html = html.replace('aria-label="Switch to Lithuanian"', 'aria-label="Perjungti į lietuvių kalbą"');
    html = html.replace('>Copy prompt</button>', '>Kopijuoti užklausą</button>');

    html = html.replace('>Turn scattered KPIs into a clear weekly CEO brief</h1>', '>DI Operacinis Centras</h1>');
    html = html.replace(
      '>Enter revenue, runway, pipeline, blockers, and team context. Get a structured weekly priority brief for leadership alignment in about 5 minutes.</p>',
      '>Įvesk pajamas, rezervą ir kontekstą. Gauk paruoštą CEO promptą maždaug per 5 min.</p>'
    );
    html = html.replace('>Not another AI chat. A structured operating layer for executive decision-making.</p>', '');
    html = html.replace('aria-label="Open generator in operations center">Open generator</a>', 'aria-label="Atidaryti generatorių operaciniame centre">Atidaryti generatorių</a>');
    html = html.replace(
      'aria-label="Build weekly brief in operations center">Build weekly brief</a>',
      'aria-label="Kurti savaitės brief operaciniame centre">Kurti savaitės brief</a>'
    );
    html = html.replace('aria-label="View PDF playbooks">View playbooks ↓</a>', 'aria-label="Peržiūrėti PDF playbooks">Playbooks ↓</a>');
    html = html.replace('>Free · No account · ~5 min</p>', '>Nemokama · Be paskyros · ~5 min</p>');
    html = html.replace(
      '>Add KPIs, blockers, and context.<br>Get structured priorities in 5 minutes.</p>',
      '>Įvesk KPI, blockerius ir kontekstą.<br>Gauk struktūruotus prioritetus per 5 min.</p>'
    );
    html = html.replace('>This week\'s priorities</p>', '>Šios savaitės prioritetai</p>');
    html = html.replace('>Add your context</h2>', '>Pridėk kontekstą</h2>');
    html = html.replace('>Build your weekly brief</h2>', '>Kurk savaitės brief</h2>');
    html = html.replace(
      'aria-label="Fill the weekly form with sample CEO data">Try sample data</button>',
      'aria-label="Užpildyti savaitės formą pavyzdiniais duomenimis">Išbandyti pavyzdį</button>'
    );
    html = html.replace('>Copy &amp; open ChatGPT</button>', '>Kopijuoti ir atidaryti ChatGPT</button>');
    html = html.replace('>Copy &amp; open Claude</button>', '>Kopijuoti ir atidaryti Claude</button>');
    html = html.replace('>Copy &amp; open Gemini</button>', '>Kopijuoti ir atidaryti Gemini</button>');
    html = html.replace(
      'Start typing or try sample data — your CEO brief builds here.',
      'Pradėk rašyti arba išbandyk pavyzdį — CEO brief atsiranda čia.'
    );
    html = html.replace('<span class="ops-journey-step-num">3</span> Generate prompt</a>', '<span class="ops-journey-step-num">3</span> Rezultatas</a>');
    html = html.replace('aria-label="View PDF playbooks from $9.99">Playbooks</a>', 'aria-label="Peržiūrėti PDF playbooks">Playbooks</a>');
    html = html.replace('aria-label="Build my weekly brief in operations center">Build my weekly brief</a>', 'aria-label="Gauti savaitės prioritetus operaciniame centre">Gauti savaitės prioritetus</a>');
    html = html.replace('aria-label="View CEO PDF playbooks">View CEO playbooks ↓</a>', 'aria-label="Peržiūrėti PDF playbooks">Playbooks ↓</a>');
    html = html.replace('>For CEOs, COOs &amp; founders · Free · No account · Works with ChatGPT, Claude &amp; Gemini</p>', '>TOP vadovams CEO / COO · Nemokama · Be paskyros · ~5 min</p>');
    html = html.replace(
      '>Choose a leadership scenario. Add business context. The system turns it into a structured executive brief and copy-ready prompt.</span>',
      '>Be paskyros. Pasirink režimą, užpildyk laukus — nukopijuok paruoštą CEO promptą į ChatGPT, Claude arba Gemini.</span>'
    );
    html = html.replace('>CEO Weekly Operating Brief</span>', '>Operacinis centras</span>');
    html = html.replace('aria-label="Work steps"', 'aria-label="Darbo žingsniai"');
    html = html.replace('<span class="ops-journey-step-num">1</span> Choose mode</a>', '<span class="ops-journey-step-num">1</span> Režimas</a>');
    html = html.replace('<span class="ops-journey-step-num">2</span> Add context</a>', '<span class="ops-journey-step-num">2</span> Forma</a>');
    html = html.replace('<span class="ops-journey-step-num">3</span> Generate brief</a>', '<span class="ops-journey-step-num">3</span> Rezultatas</a>');
    html = html.replace('<span class="ops-journey-step-num">4</span> Reuse templates</a>', '<span class="ops-journey-step-num">4</span> Biblioteka</a>');
    html = html.replace('aria-label="Browse ready-made templates">Browse templates</a>', 'aria-label="Peržiūrėti paruoštus šablonus">Rinktis šabloną</a>');
    html = html.replace('>Under 5 min · Result: clear weekly priorities.</p>', '>Užtruksi iki 5 min. • Rezultatas: aiškūs savaitės prioritetai.</p>');

    html = html.replace('Analysis depth', 'Analizės gylis');
    html = html.replace('aria-label="Prompt depth level" aria-describedby="depthTip"', 'aria-label="Promptų gylio lygis" aria-describedby="depthTip"');
    html = html.replace(
      '>Tip · Not sure? Start with <strong>Fast</strong>.</span>',
      '>Patarimas · Nežinai? Pradėk su <strong>Greita</strong>.</span>'
    );
    html = html.replace(
      '>Pick a mode, set depth, fill your numbers — your brief updates live.</p>',
      '>Pasirink režimą, nustatyk gylį, įrašyk skaičius — užklausa atnaujinama gyvai.</p>'
    );
    html = html.replace(
      '>Months you can run with current cash.</div>',
      '>Kiek mėnesių gali veikti su esamais pinigų likučiais.</div>'
    );
    html = html.replace(
      'placeholder="Your CEO-ready operating brief appears here as you fill the form."',
      'placeholder="Tavo CEO užklausa atsiras čia, kai pildysi formą."'
    );
    html = html.replace(
      'data-copy-ops-toast-default="Brief copied — paste the structured prompt into ChatGPT, Claude, or Gemini."',
      'data-copy-ops-toast-default="Užklausa nukopijuota — įklijuok į ChatGPT, Claude ar Gemini."'
    );
    html = html.replace(
      '<span id="toastMessage">Brief copied — paste the structured prompt into ChatGPT, Claude, or Gemini.</span>',
      '<span id="toastMessage">Užklausa nukopijuota — įklijuok į ChatGPT, Claude ar Gemini.</span>'
    );
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
    html = html.replace(
      'Part of Prompt Anatomy · Training & checkout → <a href="https://www.promptanatomy.app/?utm_source=ceo&utm_medium=entity_footer&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer">promptanatomy.app</a></p>',
      'Promptų Anatomijos ekosistema · Mokymai ir checkout → <a href="https://www.promptanatomy.app/?utm_source=ceo&utm_medium=entity_footer&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer">promptanatomy.app</a></p>'
    );
    html = html.replace(
      'You\'re in the <strong>Operations</strong> module',
      'Esate <strong>Operacijų</strong> modulyje'
    );
    html = html.replace(
      'aria-label="Return to Prompt Anatomy Hub (opens in new tab)"',
      'aria-label="Grįžti į Prompt Anatomy Hub (atidaroma naujame lange)"'
    );
    html = html.replace('aria-label="FAQ"', 'aria-label="DUK"');
    html = html.replace('>What is this?</summary>', '>Kas tai?</summary>');
    html = html.replace('>Who is it for?</summary>', '>Kam skirta?</summary>');
    html = html.replace('>How do I use it?</summary>', '>Kaip naudoti?</summary>');
    html = html.replace('>Want the full Prompt Anatomy training?</summary>', '>Nori pilnos DI operacinės sistemos?</summary>');
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
      'Explore the complete Prompt Anatomy training and all Hub modules at <a href="https://www.promptanatomy.app/?utm_source=ceo&utm_medium=faq&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.',
      'Pilną Promptų anatomijos mokymą ir visus Hub modulius rasite <a href="https://www.promptanatomy.app/?utm_source=ceo&utm_medium=faq&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.'
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
    html = html.replace('"name": "Want the full Prompt Anatomy training?"', '"name": "Nori pilnos DI operacinės sistemos?"');
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

  if (locale === 'en') {
    var sotEn = loadSot();
    html = injectGeoSchema(html, sotEn);
    html = injectBuyerFaqSsr(html, sotEn);
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
