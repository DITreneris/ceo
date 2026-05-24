/**
 * SOT (2026-05): develop copy and UX in EN only (USA: USD, en-US, US English).
 * locale === 'lt' branches remain for the /lt/ legacy path + tests — do not add new LT product strings.
 */
(function () {
    'use strict';

    var APP_ID = 'di_ops_center';
    var MAX_SESSIONS = 5;
    var TEMPLATE_CHAR_LIMIT = 1100;
    var LANG_KEY = APP_ID + '_lang';
    var LEGACY_THEME_KEY = APP_ID + '_theme';
    var DEPTH_KEY = APP_ID + '_depth';
    var SESSIONS_KEY = APP_ID + '_sessions';
    var AI_TOOL_URLS = {
        chatgpt: 'https://chatgpt.com/',
        claude: 'https://claude.ai/',
        gemini: 'https://gemini.google.com/'
    };
    var AI_TOOL_ALLOWED_HOSTS = {
        'chatgpt.com': true,
        'claude.ai': true,
        'gemini.google.com': true
    };
    var ANATOMY_URL = 'https://www.promptanatomy.app/';

    /* ===== CONSTANTS ===== */

    function getLocaleFromPathname() {
        try {
            var path = (window.location.pathname || '').toLowerCase();
            if (/\/lt(?:\/|$)/.test(path)) return 'lt';
            if (/\/en(?:\/|$)/.test(path)) return 'en';
            return '';
        } catch (_) {
            return '';
        }
    }

    function getLangFromQuery() {
        try {
            var p = new URLSearchParams(window.location.search);
            var qLang = String(p.get('lang') || '').toLowerCase();
            if (qLang === 'lt' || qLang === 'en') return qLang;
            return '';
        } catch (_) {
            return '';
        }
    }

    function resolveLocale() {
        var fromPath = getLocaleFromPathname();
        if (fromPath) return fromPath;
        var fromQuery = getLangFromQuery();
        if (fromQuery) return fromQuery;
        try {
            var stored = String(localStorage.getItem(LANG_KEY) || '').toLowerCase();
            if (stored === 'lt' || stored === 'en') return stored;
        } catch (_) { /* ignore */ }
        // Default language across the whole website is EN.
        return 'en';
    }

    var locale = resolveLocale();
    try { localStorage.setItem(LANG_KEY, locale); } catch (_) { /* ignore */ }

    var MODES = {
        MASTER: {
            label: locale === 'lt' ? 'STRATEGINIS' : 'STRATEGIC',
            desc: locale === 'lt' ? 'Strateginis kontekstas' : 'Strategic context',
            formId: 'form-master',
            fields: ['goal', 'horizon', 'income', 'expenses', 'profit', 'cash', 'runway', 'facts', 'question']
        },
        DIENOS: {
            label: locale === 'lt' ? 'DIENOS' : 'DAILY',
            desc: locale === 'lt' ? 'Vakarykštės operacijos' : "Yesterday's operations",
            formId: 'form-dienos',
            fields: ['v_pajamos', 'v_klientai', 'v_islaidos', 'v_ivykiai', 'question']
        },
        SAVAITES: {
            label: locale === 'lt' ? 'SAVAITĖS' : 'WEEKLY',
            desc: locale === 'lt' ? 'Projektai ir veikimo rezervas' : 'Projects and runway',
            formId: 'form-savaites',
            fields: ['s_pajamos', 's_sanaudos', 's_likutis', 'projektai', 's_pipeline', 'question']
        }
    };

    var DEPTH_LEVELS = {
        GREITA: {
            label: locale === 'lt' ? 'Greita' : 'Fast',
            instruction: locale === 'lt'
                ? 'Atsakyk trumpai ir aiškiai: daugiausia 3 punktai, kiekvienas po 1-2 sakinius, be įžangos.'
                : 'Answer briefly and clearly: max 3 points, each 1-2 sentences, no intro.',
            format: locale === 'lt'
                ? '3 prioritetai + 3 veiksmai + 1 rizika'
                : '3 priorities + 3 actions + 1 risk'
        },
        GILU: {
            label: locale === 'lt' ? 'Gilu' : 'Deep',
            instruction: locale === 'lt'
                ? 'Pateik išsamią analizę su kontekstu ir pagrindimu. Kiekvienam punktui nurodyk, kodėl svarbu ir koks poveikis. Remkis skaičiais.'
                : 'Provide deep analysis with context and reasoning. For each point explain why it matters and impact. Use numbers.',
            format: locale === 'lt'
                ? '3 prioritetai (su naudos pagrindimu) + 5 veiksmai (su terminais) + 2 rizikos (su mažinimo planais) + 1 ilgalaikė rekomendacija'
                : '3 priorities (with rationale) + 5 actions (with timelines) + 2 risks (with mitigation) + 1 long-term recommendation'
        },
        BOARD: {
            label: locale === 'lt' ? 'Valdybai' : 'Board',
            instruction: locale === 'lt'
                ? 'Parenk valdybos lygio santrauką. Tik faktai ir skaičiai, be nuomonių. Struktūra: Santrauka -> Finansai -> Veiksmai -> Rizikos. Kalba formali.'
                : 'Prepare a board-level summary. Facts and numbers only. Structure: Summary -> Finance -> Actions -> Risks. Formal tone.',
            format: locale === 'lt'
                ? 'Santrauka (3 sakiniai) + Finansinė padėtis (lentelė) + TOP 3 prioritetai + 5 veiksmai su rodikliais + Rizikų matrica + Rekomendacija valdybai'
                : 'Summary (3 sentences) + Financial status (table) + TOP 3 priorities + 5 KPI actions + Risk matrix + Board recommendation'
        }
    };

    var LIBRARY_PROMPTS = locale === 'lt' ? [
        {
            id: 'unit_economics',
            title: 'Vieneto ekonomika',
            desc: 'Vieneto ekonomikos analizė',
            icon: 'calculator',
            prompt: 'Esi finansų analitikas. Mano verslo duomenys:\n- Vidutinės pajamos iš kliento (ARPU): [suma]\n- Kliento pritraukimo kaina (CAC): [suma]\n- Kliento gyvavimo vertė (LTV): [suma]\n- Bendroji marža: [%]\n\nAtlik vieneto ekonomikos analizę:\n1. Įvertink LTV/CAC santykį\n2. Nustatyk atsipirkimo laikotarpį\n3. Įvardyk didžiausius svertus (ARPU didinimas, CAC mažinimas, išlaikymo gerinimas)\n4. Pasiūlyk 3 konkrečius veiksmus'
        },
        {
            id: 'augimo_svertai',
            title: 'Augimo svertai',
            desc: 'Augimo galimybių identifikavimas',
            icon: 'trending-up',
            prompt: 'Esi augimo strategas. Mano verslo situacija:\n- Dabartinės mėnesio pajamos: [suma]\n- Tikslas per [laikotarpis]: [suma]\n- Dabartiniai kanalai: [kanalai]\n- Konversijos rodiklis: [%]\n\nNustatyk augimo svertus:\n1. TOP 3 svertai su didžiausiu naudos potencialu\n2. Kiekvienam svertui nurodyk: ką darome, kokį poveikį tikimės gauti ir per kiek laiko\n3. Greitos pergalės (iki 2 savaičių)\n4. Pagrindinės rizikos ir priklausomybės'
        },
        {
            id: 'cash_runway',
            title: 'Pinigų rezervas',
            desc: 'Pinigų srauto analizė ir planavimas',
            icon: 'wallet',
            prompt: 'Esi finansų konsultantas. Mano situacija:\n- Grynųjų likutis: [suma]\n- Mėnesio pajamos: [suma]\n- Mėnesio išlaidos: [suma]\n- Išlaidų tempo tendencija: [didėja/mažėja/stabili]\n\nAtlik pinigų rezervo analizę:\n1. Įvertink dabartinį veikimo rezervą mėnesiais\n2. Pateik scenarijus: optimistinis / bazinis / pesimistinis\n3. Pasiūlyk pinigų srauto gerinimo veiksmus (30/60/90 dienų)\n4. Įvardyk raudonos zonos rodiklius - kada reikia veikti'
        },
        {
            id: 'kainodara',
            title: 'Kainodara',
            desc: 'Kainodaros strategijos optimizavimas',
            icon: 'tag',
            prompt: 'Esi kainodaros ekspertas. Mano produktas/paslauga:\n- Dabartinė kaina: [kaina]\n- Konkurentų kainų diapazonas: [nuo-iki]\n- Bendroji marža: [%]\n- Klientų tipai: [segmentai]\n\nPateik kainodaros rekomendacijas:\n1. Įvertink dabartinę kainą rinkos kontekste\n2. Pagrįsk vertę per kliento gaunamą naudą\n3. Pasiūlyk kelių planų kainodaros variantus\n4. Parenk kainos testavimo planą'
        },
        {
            id: 'riziku_valdymas',
            title: 'Rizikų valdymas',
            desc: 'Pagrindinių rizikų identifikavimas',
            icon: 'shield-alert',
            prompt: 'Esi rizikų valdymo specialistas. Mano verslo kontekstas:\n- Sritis: [sritis]\n- Komandos dydis: [žmonės]\n- Pagrindiniai klientai: [kiek, koncentracija]\n- Pajamų šaltiniai: [šaltiniai]\n\nAtlik rizikų auditą:\n1. Išskirk TOP 5 rizikas (tikimybė x poveikis)\n2. Kiekvienai rizikai pateik prevencijos ir mažinimo planą\n3. Įvardyk ankstyvuosius įspėjamuosius rodiklius\n4. Parenk veiksmų planą, jei rizika realizuojasi'
        },
        {
            id: 'vadovo_savirefleksija',
            title: 'Vadovo savirefleksija',
            desc: 'Sprendimų kokybės peržiūra',
            icon: 'brain',
            prompt: 'Esi mano strateginis koučeris. Padėk man, kaip CEO, atlikti savaitės savirefleksiją remiantis faktais.\n\nKontekstas:\n- Šios savaitės tikslas: [tikslas]\n- Svarbiausi sprendimai: [sprendimai]\n- Ką padariau gerai: [stiprybės]\n- Kur strigau: [silpnos vietos]\n- Komandos signalai: [faktai]\n- Finansinis rezultatas: [pajamos / išlaidos / marža]\n\nPateik atsakymą 4 dalimis:\n1. 5 tikslūs klausimai man, kurių vengiu, bet turiu sau atsakyti\n2. 3 pagrindinės vadovo klaidos rizikos šioje situacijoje\n3. 3 sprendimai kitai savaitei su aiškiu prioritetu (A/B/C)\n4. Viena asmeninė disciplina 7 dienoms, kuri turės didžiausią poveikį'
        }
    ] : [
        {
            id: 'unit_economics',
            title: 'Unit economics',
            desc: 'Unit economics analysis',
            icon: 'calculator',
            prompt: 'You are a finance analyst. My business metrics:\n- Average revenue per customer (ARPU): [amount]\n- Customer acquisition cost (CAC): [amount]\n- Lifetime value (LTV): [amount]\n- Gross margin: [%]\n\nDo a unit economics analysis:\n1. Evaluate the LTV/CAC ratio\n2. Estimate payback period\n3. Name highest-leverage drivers (ARPU up, CAC down, retention up)\n4. Suggest 3 specific actions'
        },
        {
            id: 'augimo_svertai',
            title: 'Growth levers',
            desc: 'Identify growth opportunities',
            icon: 'trending-up',
            prompt: 'You are a growth strategist. My business context:\n- Current monthly revenue: [amount]\n- Target in [period]: [amount]\n- Current channels: [channels]\n- Conversion rate: [%]\n\nDefine top growth levers:\n1. Top 3 levers with highest impact potential\n2. For each: what to do, expected impact, and timing\n3. Quick wins (up to 2 weeks)\n4. Key risks and dependencies'
        },
        {
            id: 'cash_runway',
            title: 'Cash runway',
            desc: 'Cash flow analysis and planning',
            icon: 'wallet',
            prompt: 'You are a finance consultant. My current situation:\n- Cash balance: [amount]\n- Monthly revenue: [amount]\n- Monthly expenses: [amount]\n- Expense trend: [up/down/stable]\n\nRun a cash runway analysis:\n1. Estimate current runway in months\n2. Provide optimistic / base / pessimistic scenarios\n3. Suggest 30/60/90 day cash improvement actions\n4. Define red-zone indicators and trigger points'
        },
        {
            id: 'kainodara',
            title: 'Pricing',
            desc: 'Pricing strategy optimization',
            icon: 'tag',
            prompt: 'You are a pricing expert. My product/service:\n- Current price: [price]\n- Competitor range: [from-to]\n- Gross margin: [%]\n- Customer segments: [segments]\n\nProvide pricing recommendations:\n1. Evaluate current pricing in market context\n2. Justify value via customer outcomes\n3. Suggest multi-plan pricing options\n4. Propose a pricing test plan'
        },
        {
            id: 'riziku_valdymas',
            title: 'Risk management',
            desc: 'Identify critical business risks',
            icon: 'shield-alert',
            prompt: 'You are a risk management specialist. My business context:\n- Industry: [industry]\n- Team size: [people]\n- Key customers: [count, concentration]\n- Revenue sources: [sources]\n\nPerform a risk audit:\n1. Top 5 risks (probability x impact)\n2. Prevention and mitigation plan per risk\n3. Early warning indicators\n4. Action plan if each risk materializes'
        },
        {
            id: 'vadovo_savirefleksija',
            title: 'CEO reflection',
            desc: 'Review decision quality',
            icon: 'brain',
            prompt: 'You are my strategic coach. Help me run a fact-based weekly CEO reflection.\n\nContext:\n- Weekly goal: [goal]\n- Key decisions: [decisions]\n- What went well: [strengths]\n- Where I got stuck: [weaknesses]\n- Team signals: [facts]\n- Financial outcome: [revenue / expenses / margin]\n\nAnswer in 4 parts:\n1. 5 precise questions I avoid but must answer\n2. 3 main CEO decision risks in this situation\n3. 3 decisions for next week with clear priority (A/B/C)\n4. One personal 7-day discipline with biggest impact'
        }
    ];

    function applyLibraryPromptLimit() {
        LIBRARY_PROMPTS.forEach(function (item) {
            if (!item || typeof item.prompt !== 'string') return;

            var text = item.prompt.replace(/\r\n/g, '\n').trim();
            if (text.length > TEMPLATE_CHAR_LIMIT) {
                var truncated = text.slice(0, TEMPLATE_CHAR_LIMIT).trim();
                var breakAt = Math.max(truncated.lastIndexOf('\n'), truncated.lastIndexOf('. '));
                if (breakAt > Math.floor(TEMPLATE_CHAR_LIMIT * 0.7)) {
                    truncated = truncated.slice(0, breakAt).trim();
                }
                text = truncated;
            }

            item.prompt = text;
        });
    }

    applyLibraryPromptLimit();

    var RULES = locale === 'lt' ? [
        { text: 'Kiekvienas sprendimas turi aiškų verslo naudos pagrindimą', icon: 'check-circle' },
        { text: 'Pinigų srautas > pelnas > pajamos: tokia prioritetų seka', icon: 'check-circle' },
        { text: 'Veikimo rezervas < 6 mėn. = raudona zona, reikia veiksmų plano', icon: 'alert-triangle' },
        { text: 'Kiekviena savaitė turi 3 prioritetus, ne daugiau', icon: 'check-circle' },
        { text: 'Problemas spręsk „5 Kodėl" metodu', icon: 'check-circle' },
        { text: 'Valdybos ataskaitoje – tik faktai ir skaičiai, be nuomonių', icon: 'check-circle' },
        { text: 'Kiekvienas veiksmas turi terminą ir atsakingą asmenį', icon: 'check-circle' },
        { text: 'Savaitės peržiūra: kas pavyko, kas nepavyko, ką keičiame', icon: 'check-circle' }
    ] : [
        { text: 'Every decision must include a clear business value case', icon: 'check-circle' },
        { text: 'Cash flow > profit > revenue: this is the decision sequence', icon: 'check-circle' },
        { text: 'Runway < 6 months = red zone, require action plan', icon: 'alert-triangle' },
        { text: 'Every week must have only 3 priorities', icon: 'check-circle' },
        { text: 'Use 5 Whys to diagnose root causes', icon: 'check-circle' },
        { text: 'Board report: facts and numbers only', icon: 'check-circle' },
        { text: 'Each action needs an owner and deadline', icon: 'check-circle' },
        { text: 'Weekly review: what worked, failed, and changes next', icon: 'check-circle' }
    ];

    /* ===== STATE ===== */

    var activeMode = 'MASTER';
    var activeDepth = 'GREITA';
    var formData = {};

    function initFormData() {
        formData = {};
        Object.keys(MODES).forEach(function (mode) {
            formData[mode] = {};
            MODES[mode].fields.forEach(function (field) {
                formData[mode][field] = '';
            });
        });
    }

    initFormData();

    /* ===== HELPERS ===== */

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isFilled(value) {
        return String(value || '').trim().length > 0;
    }

    function hasAnyFormInput() {
        return Object.keys(MODES).some(function (mode) {
            if (!formData[mode]) return false;
            return MODES[mode].fields.some(function (field) {
                return isFilled(formData[mode][field]);
            });
        });
    }

    function updateStickyCopyVisibility() {
        var stickyCopy = document.getElementById('stickyCopyBtn');
        if (!stickyCopy) return;
        var shouldShow = hasAnyFormInput();
        stickyCopy.classList.toggle('is-hidden', !shouldShow);
        stickyCopy.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        stickyCopy.disabled = !shouldShow;
    }

    function uiText(lt, en) {
        return locale === 'lt' ? lt : en;
    }

    function applyStaticLocaleText() {
        document.documentElement.lang = locale === 'lt' ? 'lt' : 'en-US';

        if (locale !== 'lt') {
            return;
        }

        var title = document.querySelector('title');
        if (title) {
            title.textContent = 'DI Operacinis Centras – TOP vadovams CEO / COO';
        }

        var skipLink = document.querySelector('a.skip-link');
        if (skipLink) skipLink.textContent = 'Pereiti prie turinio';

        var topNav = document.querySelector('.top-nav[aria-label]');
        if (topNav) topNav.setAttribute('aria-label', uiText('Greita navigacija', 'Quick navigation'));

        var stickyCopy = document.getElementById('stickyCopyBtn');
        if (stickyCopy) stickyCopy.textContent = uiText('Kopijuoti užklausą', 'Copy prompt');

        var brandLink = document.querySelector('.top-nav-brand');
        if (brandLink) brandLink.setAttribute('aria-label', uiText('DI Operacinis Centras', 'AI Operations Center'));
        var brandTextFull = document.querySelector('.top-nav-brand-text-full');
        if (brandTextFull) brandTextFull.textContent = uiText('DI Operacinis Centras', 'AI Operations Center');
        var brandTextShort = document.querySelector('.top-nav-brand-text-short');
        if (brandTextShort) brandTextShort.textContent = uiText('DI OC', 'AI OC');

        var h1 = document.querySelector('[data-copy-hero-headline]');
        if (h1) h1.textContent = uiText('DI Operacinis Centras', 'Turn KPIs into weekly priorities');
        var hLead = document.querySelector('[data-copy-hero-lead]');
        if (hLead) {
            hLead.textContent = uiText(
                'Įvesk pajamas, rezervą ir kontekstą. Gauk paruoštą CEO promptą maždaug per 5 min.',
                'Enter revenue, runway, and context. Get a CEO-ready prompt in about 5 minutes.'
            );
        }

        var journeySteps = document.querySelectorAll('.ops-journey-step');
        var stepLabels = [
            uiText('Režimas', 'Mode'),
            uiText('Forma', 'Form'),
            uiText('Rezultatas', 'Result'),
            uiText('Biblioteka', 'Library')
        ];
        journeySteps.forEach(function (el, i) {
            if (stepLabels[i]) {
                var num = el.querySelector('.ops-journey-step-num');
                el.innerHTML = num ? ('<span class="ops-journey-step-num">' + num.textContent + '</span> ' + stepLabels[i]) : stepLabels[i];
            }
        });

        var stepsNav = document.querySelector('.ops-journey-steps');
        if (stepsNav) stepsNav.setAttribute('aria-label', uiText('Darbo žingsniai', 'Work steps'));

        var heroMeta = document.querySelector('[data-copy-hero-meta]');
        if (heroMeta) heroMeta.textContent = uiText(
            'TOP vadovams CEO / COO · Nemokama · Be paskyros · ~5 min',
            'For CEOs & COOs · Free · No account · ~5 min'
        );

        var ctaPrimary = document.querySelector('.header-cta .cta-button');
        if (ctaPrimary) {
            ctaPrimary.textContent = uiText('Gauti savaitės prioritetus', 'Get weekly priorities');
            ctaPrimary.setAttribute('aria-label', uiText('Gauti savaitės prioritetus operaciniame centre', 'Get weekly priorities in operations center'));
        }
        var ctaSecondary = document.querySelector('.header-cta .cta-button-outline');
        if (ctaSecondary) {
            ctaSecondary.textContent = uiText('CEO playbooks ↓', 'See CEO playbooks ↓');
            ctaSecondary.setAttribute('href', '#pdf-guides');
            ctaSecondary.setAttribute('aria-label', uiText('Peržiūrėti CEO PDF playbooks', 'See CEO PDF playbooks'));
        }
        var opsTitle = document.querySelector('[data-copy-ops-title]');
        if (opsTitle) opsTitle.textContent = 'Operacinis centras';

        var modeTablist = document.querySelector('.mode-tabs[role="tablist"]');
        if (modeTablist) modeTablist.setAttribute('aria-label', uiText('Režimo pasirinkimas', 'Mode selection'));

        var depthLabel = document.querySelector('.depth-bar .depth-label');
        if (depthLabel) depthLabel.innerHTML = '<i data-lucide="sliders-horizontal" class="icon icon--sm"></i> ' + uiText('Analizės gylis', 'Analysis depth');
        var depthRadiogroup = document.querySelector('.depth-options[role="radiogroup"]');
        if (depthRadiogroup) depthRadiogroup.setAttribute('aria-label', uiText('Promptų gylio lygis', 'Prompt depth level'));
        var depthTipEl = document.querySelector('[data-copy-ops-depth-tip] span');
        if (depthTipEl) {
            var fastWord = uiText('Greita', 'Fast');
            var prefix = uiText('Nežinai? Pradėk su ', 'Not sure? Start with ');
            depthTipEl.innerHTML = prefix + '<strong>' + fastWord + '</strong>.';
        }

        var tabMaster = document.getElementById('tab-master');
        var tabDienos = document.getElementById('tab-dienos');
        var tabSavaites = document.getElementById('tab-savaites');
        if (tabMaster) {
            var masterLbl = tabMaster.querySelector('.mode-tab-label'); if (masterLbl) masterLbl.textContent = MODES.MASTER.label;
            var masterDesc = tabMaster.querySelector('.mode-tab-desc'); if (masterDesc) masterDesc.textContent = MODES.MASTER.desc;
        }
        if (tabDienos) {
            var dienosLbl = tabDienos.querySelector('.mode-tab-label'); if (dienosLbl) dienosLbl.textContent = MODES.DIENOS.label;
            var dienosDesc = tabDienos.querySelector('.mode-tab-desc'); if (dienosDesc) dienosDesc.textContent = MODES.DIENOS.desc;
        }
        if (tabSavaites) {
            var savaitesLbl = tabSavaites.querySelector('.mode-tab-label'); if (savaitesLbl) savaitesLbl.textContent = MODES.SAVAITES.label;
            var savaitesDesc = tabSavaites.querySelector('.mode-tab-desc'); if (savaitesDesc) savaitesDesc.textContent = MODES.SAVAITES.desc;
        }
        var depthBtns = document.querySelectorAll('.depth-btn');
        depthBtns.forEach(function (btn) {
            var d = btn.getAttribute('data-depth');
            if (d && DEPTH_LEVELS[d]) {
                var icon = btn.querySelector('i');
                btn.innerHTML = icon ? ('<i data-lucide="' + icon.getAttribute('data-lucide') + '" class="icon icon--sm"></i> ' + DEPTH_LEVELS[d].label) : DEPTH_LEVELS[d].label;
            }
        });

        var formSectionTitles = document.querySelectorAll('.ops-form-section-title');
        var sectionTitleTexts = [
            uiText('Strateginis kontekstas', 'Strategic context'),
            uiText('Vakarykštės operacijos', 'Yesterday\'s operations'),
            uiText('Savaitės apžvalga', 'Weekly overview')
        ];
        var sectionIcons = ['target', 'calendar', 'bar-chart-3'];
        formSectionTitles.forEach(function (el, i) {
            if (sectionTitleTexts[i]) el.innerHTML = '<i data-lucide="' + sectionIcons[i] + '" class="icon icon--sm"></i> ' + sectionTitleTexts[i];
        });

        setLabel('m-goal', uiText('Strateginis tikslas', 'Strategic goal'));
        setLabel('m-horizon', uiText('Laiko horizontas', 'Time horizon'));
        setLabel('m-income', uiText('Pajamos (mėn.)', 'Revenue (monthly)'));
        setLabel('m-expenses', uiText('Išlaidos (mėn.)', 'Expenses (monthly)'));
        setLabel('m-profit', uiText('Pelnas (mėn.)', 'Profit (monthly)'));
        setLabel('m-cash', uiText('Grynieji likučiai', 'Cash balance'));
        setLabel('m-runway', uiText('Veikimo rezervas (mėn.)', 'Runway (months)'));
        setLabel('m-facts', uiText('Svarbūs faktai / kontekstas', 'Key facts / context'));
        setLabel('m-question', uiText('Pagrindinis klausimas DI', 'Main AI question'));
        setLabel('d-pajamos', uiText('Vakarykštės pajamos', 'Yesterday\'s revenue'));
        setLabel('d-klientai', uiText('Nauji klientai / užklausos', 'New clients / leads'));
        setLabel('d-islaidos', uiText('Vakarykštės išlaidos', 'Yesterday\'s expenses'));
        setLabel('d-ivykiai', uiText('Svarbiausi įvykiai', 'Key events'));
        setLabel('d-question', uiText('Klausimas DI', 'AI question'));
        setLabel('s-pajamos', uiText('Savaitės pajamos', 'Weekly revenue'));
        setLabel('s-sanaudos', uiText('Savaitės sąnaudos', 'Weekly costs'));
        setLabel('s-likutis', uiText('Grynųjų likutis', 'Cash balance'));
        setLabel('s-projektai', uiText('Aktyvūs projektai', 'Active projects'));
        setLabel('s-pipeline', uiText('Pardavimų eilė', 'Sales pipeline'));
        setLabel('s-question', uiText('Klausimas DI', 'AI question'));
        function setLabel(forId, text) {
            var lab = document.querySelector('label[for="' + forId + '"]');
            if (lab) lab.textContent = text;
        }

        var horizonSelect = document.getElementById('m-horizon');
        if (horizonSelect && horizonSelect.options.length >= 4) {
            horizonSelect.options[0].text = uiText('Šis mėnuo', 'This month');
            horizonSelect.options[1].text = uiText('Šis ketvirtis', 'This quarter');
            horizonSelect.options[2].text = uiText('Šie metai', 'This year');
            horizonSelect.options[3].text = uiText('3 metai', '3 years');
        }
        setPlaceholder('m-goal', uiText('Pvz.: Pasiekti 100K MRR per Q2', 'E.g.: Reach $100K MRR by Q2'));
        setPlaceholder('m-income', uiText('Pvz.: 45 000 €', 'E.g.: $45,000'));
        setPlaceholder('m-expenses', uiText('Pvz.: 38 000 €', 'E.g.: $38,000'));
        setPlaceholder('m-profit', uiText('Pvz.: 7 000 €', 'E.g.: $7,000'));
        setPlaceholder('m-cash', uiText('Pvz.: 120 000 €', 'E.g.: $120,000'));
        setPlaceholder('m-runway', uiText('Pvz.: 16 mėn.', 'E.g.: 16 months'));
        setPlaceholder('m-facts', uiText('Pvz.: Praradome 2 klientus, bet pritraukėme 5 naujus. Naujas produktas paleidžiamas kitą mėnesį.', 'E.g.: Lost 2 clients but gained 5 new. New product launch next month.'));
        setPlaceholder('m-question', uiText('Pvz.: Kokius 3 veiksmus turėčiau atlikti šią savaitę?', 'E.g.: What 3 actions should I take this week?'));
        setPlaceholder('d-pajamos', uiText('Pvz.: 2 340 €', 'E.g.: $2,340'));
        setPlaceholder('d-klientai', uiText('Pvz.: 3 naujos užklausos', 'E.g.: 3 new leads'));
        setPlaceholder('d-islaidos', uiText('Pvz.: 1 200 €', 'E.g.: $1,200'));
        setPlaceholder('d-ivykiai', uiText('Pvz.: Pasirašyta sutartis su X, atšauktas susitikimas su Y, serverio incidentas 2h', 'E.g.: Contract signed with X, meeting cancelled with Y, server incident 2h'));
        setPlaceholder('d-question', uiText('Pvz.: Ką turėčiau daryti šiandien kitaip?', 'E.g.: What should I do differently today?'));
        setPlaceholder('s-pajamos', uiText('Pvz.: 12 500 €', 'E.g.: $12,500'));
        setPlaceholder('s-sanaudos', uiText('Pvz.: 9 800 €', 'E.g.: $9,800'));
        setPlaceholder('s-likutis', uiText('Pvz.: 115 000 €', 'E.g.: $115,000'));
        setPlaceholder('s-projektai', uiText('Pvz.: Naujo produkto paleidimas (70%), CRM migracija (45%), SEO optimizacija (20%)', 'E.g.: New product launch (70%), CRM migration (45%), SEO (20%)'));
        setPlaceholder('s-pipeline', uiText('Pvz.: 3 pasiūlymai laukia atsakymo, 2 demo suplanuoti', 'E.g.: 3 proposals pending, 2 demos scheduled'));
        setPlaceholder('s-question', uiText('Pvz.: Kuriuos projektus prioritetizuoti šią savaitę?', 'E.g.: Which projects to prioritize this week?'));
        function setPlaceholder(id, text) {
            var el = document.getElementById(id);
            if (el) el.placeholder = text;
        }
        var runwayHelp = document.querySelector('.field-help--row');
        if (runwayHelp) runwayHelp.textContent = uiText('Kiek mėnesių gali veikti su esamais pinigų likučiais.', 'Months you can run with current cash.');

        var opsOutputRegion = document.querySelector('.ops-output[role="region"]');
        if (opsOutputRegion) opsOutputRegion.setAttribute('aria-label', uiText('Sugeneruota DI užklausa', 'Generated AI prompt'));
        var outputCopyBtn = document.getElementById('outputCopyBtn');
        if (outputCopyBtn) outputCopyBtn.setAttribute('aria-label', uiText('Kopijuoti sugeneruotą promptą', 'Copy generated prompt'));
        var opsOutput = document.getElementById('opsOutput');
        if (opsOutput) {
            var emptyText = uiText(
                'Tavo CEO užklausa atsiras čia, kai pildysi formą.',
                'Your CEO-ready prompt appears here as you fill the form.'
            );
            if (opsOutput.tagName === 'TEXTAREA') {
                opsOutput.placeholder = emptyText;
                opsOutput.setAttribute('aria-label', uiText('Sugeneruota DI užklausa – galite redaguoti', 'Generated AI prompt – you can edit'));
            } else if (opsOutput.textContent.indexOf('Pasirink režimą') !== -1 || opsOutput.textContent.indexOf('Choose mode') !== -1 || opsOutput.textContent.indexOf('Choose a mode') !== -1) {
                opsOutput.textContent = emptyText;
            }
        }
        var opsOutputChars = document.querySelector('.ops-output-chars');
        if (opsOutputChars && opsOutputChars.firstChild) opsOutputChars.firstChild.textContent = uiText('Simbolių: ', 'Characters: ');
        var toolLaunchersLabel = document.querySelector('.ops-tool-launchers-label');
        if (toolLaunchersLabel) toolLaunchersLabel.textContent = uiText('Nori tęsti analizę? Pasirink įrankį:', 'Continue in:');
        var toolBtns = document.querySelectorAll('.ops-tool-btn');
        var toolNames = [uiText('Atidaryti ChatGPT', 'Open ChatGPT'), uiText('Atidaryti Claude', 'Open Claude'), uiText('Atidaryti Gemini', 'Open Gemini')];
        toolBtns.forEach(function (btn, i) {
            if (toolNames[i]) {
                btn.textContent = toolNames[i];
                btn.setAttribute('aria-label', toolNames[i] + ' ' + uiText('naujame lange', 'in new tab'));
            }
        });
        var toolLaunchersGroup = document.querySelector('.ops-tool-launchers[role="group"]');
        if (toolLaunchersGroup) toolLaunchersGroup.setAttribute('aria-label', uiText('DI įrankių pasirinkimas', 'AI tool selection'));
        var sessionList = document.getElementById('sessionList');
        if (sessionList) sessionList.setAttribute('aria-label', uiText('Išsaugotos sesijos', 'Saved sessions'));

        var libraryTitle = document.querySelector('#library .collapsible-title');
        if (libraryTitle) libraryTitle.textContent = uiText('Šablonų biblioteka', 'Template library');
        var libraryValue = document.querySelector('#library .collapsible-value');
        if (libraryValue) libraryValue.textContent = uiText('Paruošti užklausų šablonai – taikyk formoje arba kopijuok', 'Ready-made prompt templates – apply in form or copy');
        var rulesTitle = document.querySelector('#rules .collapsible-title');
        if (rulesTitle) rulesTitle.textContent = uiText('Ekonominės drausmės taisyklės', 'Executive decision rules');
        var rulesValue = document.querySelector('#rules .collapsible-value');
        if (rulesValue) rulesValue.textContent = uiText('Vadovo sprendimų sistema – kiekvienas promptas laikosi šių principų', 'Decision framework – every prompt follows these principles');

        var outBadge = document.querySelector('.ops-output-badge span:last-child');
        if (outBadge) outBadge.textContent = uiText('Sugeneruota užklausa', 'Generated prompt');

        var outFooter = document.querySelector('.ops-output-footer > p:not(.ops-output-chars)');
        if (outFooter) outFooter.textContent = uiText(
            'Galite redaguoti tekstą čia prieš kopijuojant. Nukopijuok ir įklijuok į ChatGPT, Claude arba Gemini.',
            'Edit here if needed, then copy and paste into ChatGPT, Claude, or Gemini.'
        );

        var outCta = document.querySelector('#outputCopyCta span');
        if (outCta) outCta.textContent = uiText('Kopijuoti promptą', 'Copy prompt');
        var outputCopyCtaBtn = document.getElementById('outputCopyCta');
        if (outputCopyCtaBtn) outputCopyCtaBtn.setAttribute('aria-label', uiText('Kopijuoti užklausą', 'Copy prompt'));

        var sessionsTitle = document.querySelector('.ops-sessions-title');
        if (sessionsTitle) sessionsTitle.innerHTML = '<i data-lucide="history" class="icon icon--sm"></i> ' + uiText('Sesijos', 'Sessions');

        var saveBtn = document.getElementById('sessionSaveBtn');
        if (saveBtn) saveBtn.innerHTML = '<i data-lucide="save" class="icon icon--sm"></i> ' + uiText('Išsaugoti', 'Save');

        var clearBtn = document.getElementById('sessionClearBtn');
        if (clearBtn) clearBtn.innerHTML = '<i data-lucide="trash-2" class="icon icon--sm"></i> ' + uiText('Ištrinti sesijas', 'Clear sessions');

        var communityTitle = document.getElementById('community-title');
        if (communityTitle) {
            communityTitle.innerHTML = uiText(
                'Valdai operacijas su DI?<br><span class="community-subtitle" data-copy-community-subtitle>Eik toliau su Promptų anatomija.</span>',
                'Running AI like operations?<br><span class="community-subtitle" data-copy-community-subtitle>Go further with Prompt Anatomy.</span>'
            );
        }
        var communityPrimary = document.querySelector('.community-cta-primary');
        if (communityPrimary) {
            communityPrimary.textContent = uiText('Prisijungti prie Telegram bendruomenės', 'Join Telegram community');
            communityPrimary.setAttribute('aria-label', uiText('Atidaryti Promptų anatomija Telegram bendruomenę naujame lange', 'Open Prompt Anatomy Telegram community in new tab'));
            communityPrimary.setAttribute('href', 'https://t.me/prompt_anatomy');
        }
        var communitySecondary = document.querySelector('.community-cta-secondary');
        if (communitySecondary) {
            communitySecondary.textContent = uiText('Atrask visus Hub modulius →', 'Explore all Hub modules →');
            communitySecondary.setAttribute('aria-label', uiText('Atrask visą Promptų anatomijos AI OS – visus Hub modulius (atidaroma naujame lange)', 'Explore the full Prompt Anatomy AI OS – all Hub modules (opens in new tab)'));
            communitySecondary.setAttribute('href', ANATOMY_URL);
        }
        var footerH3 = document.querySelector('[data-copy-footer-heading]');
        if (footerH3) {
            footerH3.innerHTML = uiText(
                'Savaitės operacinis ritmas su DI promptais ',
                'Weekly operating cadence, powered by AI prompts '
            ) + '<span class="icon-wrap" aria-hidden="true"><i data-lucide="sparkles" class="icon icon--md"></i></span>';
        }
        var footerSummary = document.querySelector('[data-copy-footer-summary]');
        if (footerSummary) footerSummary.textContent = uiText(
            'KPI į savaitės prioritetus—nemokamas generatorius ir optional CEO playbooks.',
            'Turn KPIs into weekly priorities—free generator plus optional CEO playbooks.'
        );
        var footerProductLink = document.querySelector('.footer-product-link');
        if (footerProductLink) footerProductLink.textContent = uiText(
            'Promptų anatomijos (DI operacinės sistemos) dalis — Operacijų modulis.',
            'Part of Prompt Anatomy (AI Operating System) — Operations module.'
        );
        var footerTags = document.querySelectorAll('.footer .tag');
        var tagTexts = [
            'CEO / COO',
            uiText('3 režimai · 3 gylio lygiai', '3 modes · 3 depths')
        ];
        footerTags.forEach(function (tag, i) {
            if (tagTexts[i] && tag.childNodes.length > 1) tag.childNodes[1].textContent = ' ' + tagTexts[i];
        });
        var copyrightText = document.querySelector('.copyright p');
        if (copyrightText) {
            copyrightText.innerHTML = '&copy; 2026 Tomas Staniulis. ' +
                uiText('Mokymų medžiaga. Visos teisės saugomos.', 'Training material. All rights reserved.') +
                ' <a href="privacy.html">' + uiText('Privatumas', 'Privacy') + '</a> · ' +
                '<a href="terms.html">' + uiText('Sąlygos', 'Terms') + '</a>';
        }
        var hiddenTextarea = document.getElementById('hiddenTextarea');
        if (hiddenTextarea) hiddenTextarea.setAttribute('aria-label', uiText('Kopijuojamo teksto laukas', 'Text to copy field'));
        var toastAria = document.getElementById('toast');
        if (toastAria) toastAria.setAttribute('aria-label', uiText('Pranešimas', 'Notification'));

        var rulesHint = document.querySelector('.rules-anatomy-hint');
        if (rulesHint) {
            rulesHint.innerHTML = uiText(
                'Šios taisyklės grindžiamos <a href="' + ANATOMY_URL + '" target="_blank" rel="noopener noreferrer">Promptų anatomijos</a> 6-block metodologija: <span class="rules-anatomy-blocks">Meta · Input · Output · Reasoning · Quality · Advanced</span>',
                'These rules follow <a href="' + ANATOMY_URL + '" target="_blank" rel="noopener noreferrer">Prompt Anatomy</a>\'s 6-block methodology: <span class="rules-anatomy-blocks">Meta · Input · Output · Reasoning · Quality · Advanced</span>'
            );
        }

        var hubHere = document.querySelector('.hub-map-here');
        if (hubHere) hubHere.textContent = uiText('jūs čia', 'you are here');

        var hubMap = document.querySelector('.hub-map');
        if (hubMap) hubMap.setAttribute('aria-label', uiText('Promptų anatomijos Hub moduliai', 'Prompt Anatomy Hub modules'));

        var footerAddress = document.getElementById('footerAddress');
        if (footerAddress) {
            footerAddress.setAttribute('aria-label', uiText('Įmonės adresas', 'Business address'));
        }

        var footerFaq = document.querySelector('.footer-faq');
        if (footerFaq) {
            footerFaq.setAttribute('aria-label', uiText('DUK', 'Product FAQ'));
            footerFaq.innerHTML = uiText(
                '<details class="footer-faq-item"><summary class="footer-faq-q">Ar jūs saugote mano duomenis?</summary><div class="footer-faq-a">Sesijos išsaugomos tik tavo naršyklėje (localStorage). Šis puslapis nieko neįkelia į serverį.</div></details>' +
                '<details class="footer-faq-item"><summary class="footer-faq-q">Kuo skiriasi Greita, Gilu ir Valdybai?</summary><div class="footer-faq-a">Greita pateikia trumpą prioritetų sąrašą. Gilu prideda analizę ir pagrindimą. Valdybai suformuoja trumpą formalią santrauką su rizikomis ir veiksmais.</div></details>' +
                '<details class="footer-faq-item"><summary class="footer-faq-q">Nori pilnos DI operacinės sistemos?</summary><div class="footer-faq-a">Pilną Promptų anatomijos mokymą ir visus Hub modulius rasite <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.</div></details>',
                '<details class="footer-faq-item"><summary class="footer-faq-q">Do you store my data?</summary><div class="footer-faq-a">Saved sessions are stored locally in your browser (localStorage). This page does not upload your inputs to a server.</div></details>' +
                '<details class="footer-faq-item"><summary class="footer-faq-q">What is the difference between Fast, Deep, and Board?</summary><div class="footer-faq-a">Fast gives a short prioritized answer, Deep adds analysis and rationale, and Board formats a concise executive summary with risks and actions.</div></details>' +
                '<details class="footer-faq-item"><summary class="footer-faq-q">Want the full AI Operating System?</summary><div class="footer-faq-a">Explore the complete Prompt Anatomy training and all Hub modules at <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>.</div></details>'
            );
        }

        // Hub map URLs (keep consistent across locales and runtime switches)
        document.querySelectorAll('.hub-map-item[data-module]').forEach(function (el) {
            var mod = el.getAttribute('data-module');
            if (mod === 'library') el.setAttribute('href', 'https://promptanatomy.info/');
            if (mod === 'content') el.setAttribute('href', 'https://www.promptanatomy.space/');
            if (mod === 'free-lesson') el.setAttribute('href', 'https://promptanatomy.cloud/');
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: document.body });
        }
    }

    /* ===== PROMPT GENERATION ===== */

    function buildMasterPrompt(data, depth) {
        var parts = [];

        parts.push(uiText(
            'ROLĖ: Esi strateginis verslo konsultantas, dirbantis su CEO/COO.',
            'ROLE: You are a strategic business consultant working with CEO/COO.'
        ));
        parts.push('');

        if (isFilled(data.goal)) {
            parts.push(uiText('KONTEKSTAS:', 'CONTEXT:'));
            parts.push(uiText('- Strateginis tikslas: ', '- Strategic objective: ') + data.goal);
            if (isFilled(data.horizon)) parts.push(uiText('- Laiko horizontas: ', '- Time horizon: ') + data.horizon);
            parts.push('');
        }

        var hasFinancials = isFilled(data.income) || isFilled(data.expenses) || isFilled(data.profit) || isFilled(data.cash) || isFilled(data.runway);
        if (hasFinancials) {
            parts.push(uiText('FINANSAI:', 'FINANCE:'));
            if (isFilled(data.income)) parts.push(uiText('- Pajamos (mėn.): ', '- Revenue (month): ') + data.income);
            if (isFilled(data.expenses)) parts.push(uiText('- Išlaidos (mėn.): ', '- Expenses (month): ') + data.expenses);
            if (isFilled(data.profit)) parts.push(uiText('- Pelnas (mėn.): ', '- Profit (month): ') + data.profit);
            if (isFilled(data.cash)) parts.push(uiText('- Grynieji likučiai: ', '- Cash balance: ') + data.cash);
            if (isFilled(data.runway)) parts.push(uiText('- Veikimo rezervas (mėn.): ', '- Runway (months): ') + data.runway);
            parts.push('');
        }

        if (isFilled(data.facts)) {
            parts.push(uiText('FAKTAI: ', 'FACTS: ') + data.facts);
            parts.push('');
        }

        if (isFilled(data.question)) {
            parts.push(uiText('KLAUSIMAS: ', 'QUESTION: ') + data.question);
        } else {
            parts.push(uiText(
                'KLAUSIMAS: Kokie yra 3 svarbiausi šios savaitės prioritetai ir veiksmai?',
                'QUESTION: What are the 3 most important priorities and actions this week?'
            ));
        }

        parts.push('');
        parts.push(uiText('GYLIS: ', 'DEPTH: ') + depth.instruction);
        parts.push('');
        parts.push(uiText('IŠVESTIES FORMATAS: ', 'OUTPUT FORMAT: ') + depth.format);

        return parts.join('\n');
    }

    function buildDienosPrompt(data, depth) {
        var parts = [];

        parts.push(uiText(
            'ROLĖ: Esi operacijų analitikas, padedantis CEO/COO įvertinti vakarykštę dieną.',
            'ROLE: You are an operations analyst helping CEO/COO evaluate yesterday.'
        ));
        parts.push('');

        parts.push(uiText('VAKARYKŠTĖS DUOMENYS:', 'YESTERDAY DATA:'));
        if (isFilled(data.v_pajamos)) parts.push(uiText('- Pajamos: ', '- Revenue: ') + data.v_pajamos);
        if (isFilled(data.v_klientai)) parts.push(uiText('- Nauji klientai / užklausos: ', '- New clients / leads: ') + data.v_klientai);
        if (isFilled(data.v_islaidos)) parts.push(uiText('- Išlaidos: ', '- Expenses: ') + data.v_islaidos);
        parts.push('');

        if (isFilled(data.v_ivykiai)) {
            parts.push(uiText('SVARBIAUSI ĮVYKIAI: ', 'KEY EVENTS: ') + data.v_ivykiai);
            parts.push('');
        }

        if (isFilled(data.question)) {
            parts.push(uiText('KLAUSIMAS: ', 'QUESTION: ') + data.question);
        } else {
            parts.push(uiText(
                'KLAUSIMAS: Ką šiandien turėčiau daryti kitaip, remiantis vakarykščiais duomenimis?',
                'QUESTION: What should I do differently today based on yesterday data?'
            ));
        }

        parts.push('');
        parts.push(uiText('GYLIS: ', 'DEPTH: ') + depth.instruction);
        parts.push('');
        parts.push(uiText('IŠVESTIES FORMATAS: ', 'OUTPUT FORMAT: ') + depth.format);

        return parts.join('\n');
    }

    function buildSavaitesPrompt(data, depth) {
        var parts = [];

        parts.push(uiText(
            'ROLĖ: Esi savaitės veiklos analitikas, rengiantis CEO/COO savaitės apžvalgą.',
            'ROLE: You are a weekly operations analyst preparing a CEO/COO summary.'
        ));
        parts.push('');

        parts.push(uiText('SAVAITĖS DUOMENYS:', 'WEEKLY DATA:'));
        if (isFilled(data.s_pajamos)) parts.push(uiText('- Pajamos: ', '- Revenue: ') + data.s_pajamos);
        if (isFilled(data.s_sanaudos)) parts.push(uiText('- Sąnaudos: ', '- Costs: ') + data.s_sanaudos);
        if (isFilled(data.s_likutis)) parts.push(uiText('- Grynųjų likutis: ', '- Cash balance: ') + data.s_likutis);
        parts.push('');

        if (isFilled(data.projektai)) {
            parts.push(uiText('AKTYVŪS PROJEKTAI: ', 'ACTIVE PROJECTS: ') + data.projektai);
            parts.push('');
        }

        if (isFilled(data.s_pipeline)) {
            parts.push(uiText('PARDAVIMŲ EILĖ: ', 'SALES PIPELINE: ') + data.s_pipeline);
            parts.push('');
        }

        if (isFilled(data.question)) {
            parts.push(uiText('KLAUSIMAS: ', 'QUESTION: ') + data.question);
        } else {
            parts.push(uiText(
                'KLAUSIMAS: Kuriuos projektus prioritetizuoti ir kokie 3 svarbiausi šios savaitės veiksmai?',
                'QUESTION: Which projects should be prioritized and what are the top 3 actions this week?'
            ));
        }

        parts.push('');
        parts.push(uiText('GYLIS: ', 'DEPTH: ') + depth.instruction);
        parts.push('');
        parts.push(uiText('IŠVESTIES FORMATAS: ', 'OUTPUT FORMAT: ') + depth.format);

        return parts.join('\n');
    }

    function getGeneratedPrompt() {
        var data = formData[activeMode] || {};
        var depth = DEPTH_LEVELS[activeDepth];

        if (activeMode === 'MASTER') return buildMasterPrompt(data, depth);
        if (activeMode === 'DIENOS') return buildDienosPrompt(data, depth);
        return buildSavaitesPrompt(data, depth);
    }

    /* ===== OUTPUT UPDATE ===== */

    function updateOutput() {
        var el = document.getElementById('opsOutput');
        if (!el) return;

        var prompt = getGeneratedPrompt();

        el.classList.remove('is-refreshing');
        void el.offsetWidth;
        el.classList.add('is-refreshing');

        if (el.tagName === 'TEXTAREA') {
            el.value = prompt;
        } else {
            el.textContent = prompt;
        }

        var countEl = document.getElementById('outputCharCount');
        if (countEl) countEl.textContent = String(prompt.length);

        var depthBadge = document.getElementById('depthBadge');
        if (depthBadge) depthBadge.textContent = DEPTH_LEVELS[activeDepth].label;

        updateStickyCopyVisibility();
    }

    /* ===== MODE SWITCHING ===== */

    function switchMode(newMode) {
        if (!MODES[newMode] || newMode === activeMode) return;

        activeMode = newMode;

        document.querySelectorAll('.mode-tab').forEach(function (tab) {
            var isTarget = tab.getAttribute('data-mode') === newMode;
            tab.classList.toggle('is-active', isTarget);
            tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        Object.keys(MODES).forEach(function (mode) {
            var panel = document.getElementById(MODES[mode].formId);
            if (panel) panel.hidden = mode !== newMode;
        });

        updateOutput();
    }

    function setupModeTabsKeyboard() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.mode-tab'));
        if (!tabs.length) return;

        tabs.forEach(function (tab, index) {
            tab.addEventListener('keydown', function (e) {
                var targetIndex = index;
                if (e.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
                else if (e.key === 'Home') targetIndex = 0;
                else if (e.key === 'End') targetIndex = tabs.length - 1;
                else return;

                e.preventDefault();
                var targetTab = tabs[targetIndex];
                if (!targetTab) return;
                switchMode(targetTab.getAttribute('data-mode'));
                targetTab.focus();
            });
        });
    }

    /* ===== DEPTH SWITCHING ===== */

    function switchDepth(newDepth) {
        if (!DEPTH_LEVELS[newDepth] || newDepth === activeDepth) return;

        activeDepth = newDepth;

        document.querySelectorAll('.depth-btn').forEach(function (btn) {
            var isTarget = btn.getAttribute('data-depth') === newDepth;
            btn.classList.toggle('is-active', isTarget);
            btn.setAttribute('aria-checked', isTarget ? 'true' : 'false');
        });

        try { localStorage.setItem(DEPTH_KEY, newDepth); } catch (_) { /* ignore */ }

        updateOutput();
    }

    function setupDepthKeyboard() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll('.depth-btn'));
        if (!buttons.length) return;

        buttons.forEach(function (btn, index) {
            btn.addEventListener('keydown', function (e) {
                var targetIndex = index;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') targetIndex = (index + 1) % buttons.length;
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') targetIndex = (index - 1 + buttons.length) % buttons.length;
                else if (e.key === 'Home') targetIndex = 0;
                else if (e.key === 'End') targetIndex = buttons.length - 1;
                else return;

                e.preventDefault();
                var targetBtn = buttons[targetIndex];
                if (!targetBtn) return;
                switchDepth(targetBtn.getAttribute('data-depth'));
                targetBtn.focus();
            });
        });
    }

    /* ===== FORM INPUT HANDLING ===== */

    function handleFormInput(e) {
        var field = e.target;
        var name = field.name;
        if (!name) return;

        if (formData[activeMode] && MODES[activeMode].fields.indexOf(name) !== -1) {
            formData[activeMode][name] = field.value;
            updateOutput();
        }
    }

    /* ===== SESSIONS ===== */

    function getSessions() {
        try {
            var raw = localStorage.getItem(SESSIONS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    }

    function saveSessions(sessions) {
        try {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
        } catch (_) { /* ignore */ }
    }

    function saveSession() {
        var sessions = getSessions();

        var session = {
            id: Date.now(),
            mode: activeMode,
            depth: activeDepth,
            data: JSON.parse(JSON.stringify(formData[activeMode])),
            date: new Date().toLocaleString(locale === 'lt' ? 'lt-LT' : 'en-US')
        };

        sessions.unshift(session);
        if (sessions.length > MAX_SESSIONS) sessions = sessions.slice(0, MAX_SESSIONS);

        saveSessions(sessions);
        renderSessions();
    }

    function loadSession(session) {
        if (!session || !session.mode || !MODES[session.mode]) return;

        switchMode(session.mode);

        if (session.depth && DEPTH_LEVELS[session.depth]) {
            switchDepth(session.depth);
        }

        if (session.data) {
            formData[session.mode] = JSON.parse(JSON.stringify(session.data));

            var formEl = document.getElementById(MODES[session.mode].formId);
            if (formEl) {
                MODES[session.mode].fields.forEach(function (fieldName) {
                    var input = formEl.querySelector('[name="' + fieldName + '"]');
                    if (input && session.data[fieldName] !== undefined) {
                        input.value = session.data[fieldName];
                    }
                });
            }
        }

        updateOutput();
    }

    function clearSessions() {
        try { localStorage.removeItem(SESSIONS_KEY); } catch (_) { /* ignore */ }
        renderSessions();
    }

    function renderSessions() {
        var list = document.getElementById('sessionList');
        if (!list) return;

        var sessions = getSessions();

        list.innerHTML = '';

        if (sessions.length === 0) {
            var li = document.createElement('li');
            li.className = 'sessions-empty';
            li.id = 'sessionsEmpty';
            li.innerHTML =
                '<span class="sessions-empty-icon" aria-hidden="true">' +
                    '<i data-lucide="sparkles" class="icon icon--sm"></i>' +
                '</span>' +
                uiText('Sesijų dar nėra. Sukurk pirmą analizę.', 'No sessions yet. Save your first analysis.');
            list.appendChild(li);
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons({ root: list });
            }
            return;
        }

        sessions.forEach(function (session) {
            var li = document.createElement('li');
            li.className = 'session-item';
            li.setAttribute('role', 'button');
            li.setAttribute('tabindex', '0');
            li.setAttribute('aria-label', uiText('Įkelti ', 'Load ') + (MODES[session.mode] ? MODES[session.mode].label : session.mode) + uiText(' sesiją nuo ', ' session from ') + session.date);

            li.innerHTML =
                '<div class="session-item-info">' +
                    '<span class="session-item-mode">' + escapeHtml(MODES[session.mode] ? MODES[session.mode].label : session.mode) + '</span>' +
                    '<span class="session-item-date">' + escapeHtml(session.date) + '</span>' +
                '</div>' +
                '<span class="session-item-load">' + uiText('Įkelti →', 'Load →') + '</span>';

            li.addEventListener('click', function () { loadSession(session); });
            li.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    loadSession(session);
                }
            });

            list.appendChild(li);
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: list });
        }
    }

    /* ===== LIBRARY ===== */

    function renderLibrary() {
        var grid = document.getElementById('libraryGrid');
        if (!grid) return;

        var countEl = document.getElementById('libraryTemplateCount');
        if (countEl) {
            countEl.textContent = LIBRARY_PROMPTS.length + ' ' + uiText('šablonai', 'templates');
        }

        grid.innerHTML = '';

        LIBRARY_PROMPTS.forEach(function (item) {
            var card = document.createElement('div');
            card.className = 'library-card';

            card.innerHTML =
                '<div class="library-card-header">' +
                    '<div class="library-card-icon"><i data-lucide="' + escapeHtml(item.icon) + '" class="icon icon--md"></i></div>' +
                    '<div>' +
                        '<div class="library-card-title">' + escapeHtml(item.title) + '</div>' +
                        '<div class="library-card-desc">' + escapeHtml(item.desc) + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="library-card-prompt">' + escapeHtml(item.prompt) + '</div>' +
                '<div class="library-card-actions">' +
                    '<button type="button" class="library-btn library-btn--primary" data-library-apply="' + escapeHtml(item.id) + '">' +
                        '<i data-lucide="file-input" class="icon icon--sm"></i> ' + uiText('Taikyti formoje', 'Apply to form') +
                    '</button>' +
                    '<button type="button" class="library-btn" data-library-output-only="' + escapeHtml(item.id) + '">' +
                        '<i data-lucide="file-output" class="icon icon--sm"></i> ' + uiText('Tik į išvestį', 'To output only') +
                    '</button>' +
                    '<button type="button" class="library-btn" data-library-copy="' + escapeHtml(item.id) + '">' +
                        '<i data-lucide="copy" class="icon icon--sm"></i> ' + uiText('Kopijuoti', 'Copy') +
                    '</button>' +
                '</div>' +
                '<p class="library-card-hint">' + uiText('Įrašo į lauką „Pagrindinis klausimas DI“ – redaguokite formoje. „Tik į išvestį“ – tik šablonas į išvesties lauką.', 'Writes to the main AI question field - edit in form. "To output only" – template only into output.') + '</p>';

            grid.appendChild(card);
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: grid });
        }

        grid.addEventListener('click', function (e) {
            var applyBtn = e.target.closest('[data-library-apply]');
            if (applyBtn) {
                var id = applyBtn.getAttribute('data-library-apply');
                applyLibraryPrompt(id);
                return;
            }

            var outputOnlyBtn = e.target.closest('[data-library-output-only]');
            if (outputOnlyBtn) {
                var outputOnlyId = outputOnlyBtn.getAttribute('data-library-output-only');
                applyLibraryPromptToOutputOnly(outputOnlyId);
                return;
            }

            var copyBtn = e.target.closest('[data-library-copy]');
            if (copyBtn) {
                var copyId = copyBtn.getAttribute('data-library-copy');
                copyLibraryPrompt(copyId);
            }
        });
    }

    function applyLibraryPromptToOutputOnly(id) {
        var item = LIBRARY_PROMPTS.find(function (p) { return p.id === id; });
        if (!item) return;

        var el = document.getElementById('opsOutput');
        if (!el) return;

        if (el.tagName === 'TEXTAREA') {
            el.value = item.prompt;
        } else {
            el.textContent = item.prompt;
        }

        var countEl = document.getElementById('outputCharCount');
        if (countEl) countEl.textContent = String(item.prompt.length);

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();

        showToastIfAvailable(uiText('Šablonas įrašytas į išvestį. Redaguokite pagal poreikius.', 'Template inserted into output. Edit as needed.'));
    }

    function applyLibraryPrompt(id) {
        var item = LIBRARY_PROMPTS.find(function (p) { return p.id === id; });
        if (!item) return;

        var questionField = document.querySelector('#' + MODES[activeMode].formId + ' [name="question"]');
        if (questionField && isFilled(questionField.value)) {
            if (!confirm(uiText('Šis laukas bus perrašytas šablonu. Tęsti?', 'This field will be overwritten by the template. Continue?'))) {
                return;
            }
        }

        if (questionField) {
            questionField.value = item.prompt;
            formData[activeMode].question = item.prompt;
            updateOutput();
            questionField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            questionField.focus();
            showToastIfAvailable(uiText('Šablonas įrašytas į klausimo lauką. Redaguokite formoje pagal poreikius.', 'Template inserted into question field. Edit as needed.'));
        }
    }

    function copyLibraryPrompt(id) {
        var item = LIBRARY_PROMPTS.find(function (p) { return p.id === id; });
        if (!item) return;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(item.prompt).then(function () {
                showToastIfAvailable();
            });
        } else {
            fallbackCopy(item.prompt);
            showToastIfAvailable();
        }
    }

    /* ===== RULES ===== */

    function renderRules() {
        var list = document.getElementById('rulesList');
        if (!list) return;

        list.innerHTML = '';

        RULES.forEach(function (rule) {
            var li = document.createElement('li');
            li.className = 'rules-item';
            li.innerHTML =
                '<i data-lucide="' + escapeHtml(rule.icon) + '" class="icon icon--md"></i>' +
                '<span>' + escapeHtml(rule.text) + '</span>';
            list.appendChild(li);
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: list });
        }
    }

    /* ===== COPY ===== */

    function fallbackCopy(text) {
        var ta = document.getElementById('hiddenTextarea');
        if (!ta) return;
        ta.style.position = 'fixed';
        ta.style.left = '0';
        ta.style.top = '0';
        ta.style.opacity = '0';
        ta.value = text;
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (_) { /* ignore */ }
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
    }

    function showToastIfAvailable(message) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        var msgEl = document.getElementById('toastMessage');
        if (msgEl) {
            if (message !== undefined) {
                msgEl.textContent = message;
            } else {
                var fallback = toast.getAttribute('data-copy-ops-toast-default');
                msgEl.textContent = fallback || uiText('Nukopijuota.', 'Prompt copied — paste into ChatGPT, Claude, or Gemini.');
            }
        }
        toast.classList.add('show');
        var progress = document.getElementById('toastProgress');
        if (progress) {
            progress.style.animation = 'none';
            void progress.offsetWidth;
            progress.style.animation = 'toastProgress 3000ms linear forwards';
        }
        setTimeout(function () { toast.classList.remove('show'); }, 3000);
    }

    function getCopyablePromptText() {
        var el = document.getElementById('opsOutput');
        if (!el) return getGeneratedPrompt();
        return el.tagName === 'TEXTAREA' ? el.value : (el.textContent || getGeneratedPrompt());
    }

    function doCopyOutput() {
        var text = getCopyablePromptText();
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(function () {
                showToastIfAvailable();
            });
        } else {
            fallbackCopy(text);
            showToastIfAvailable();
        }
    }

    function openExternalTool(toolKey) {
        var rawUrl = AI_TOOL_URLS[toolKey];
        if (!rawUrl) return;

        var parsed;
        try {
            parsed = new URL(rawUrl);
        } catch (_) {
            return;
        }

        if (!AI_TOOL_ALLOWED_HOSTS[parsed.hostname]) return;
        window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
    }

    function setupAiToolLaunchers() {
        document.querySelectorAll('[data-ai-tool]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tool = btn.getAttribute('data-ai-tool');
                openExternalTool(tool);
            });
        });
    }

    /** Light-only storefront: drop saved dark preference from older builds. */
    function clearLegacyThemePreference() {
        try { localStorage.removeItem(LEGACY_THEME_KEY); } catch (_) { /* ignore */ }
        document.documentElement.removeAttribute('data-theme');
    }

    /* ===== EXPOSE FOR COPY.JS ===== */

    window._getGeneratorPromptText = getGeneratedPrompt;
    window._getMiniPromptText = getGeneratedPrompt;

    /* ===== INIT ===== */

    document.addEventListener('DOMContentLoaded', function () {
        clearLegacyThemePreference();
        applyStaticLocaleText();
        var requestedMode = activeMode;
        var requestedDepth = activeDepth;

        var outputHelp = document.getElementById('opsOutput');
        if (outputHelp && outputHelp.tagName === 'TEXTAREA' && !outputHelp.placeholder) {
            outputHelp.placeholder = uiText(
                'Tavo CEO užklausa atsiras čia, kai pildysi formą.',
                'Your CEO-ready prompt appears here as you fill the form.'
            );
        }

        // Restore depth
        try {
            var storedDepth = localStorage.getItem(DEPTH_KEY);
            if (storedDepth && DEPTH_LEVELS[storedDepth]) {
                activeDepth = storedDepth;
                document.querySelectorAll('.depth-btn').forEach(function (btn) {
                    var isTarget = btn.getAttribute('data-depth') === storedDepth;
                    btn.classList.toggle('is-active', isTarget);
                    btn.setAttribute('aria-checked', isTarget ? 'true' : 'false');
                });
            }
        } catch (_) { /* ignore */ }

        try {
            var params = new URLSearchParams(window.location.search);
            var modeParam = params.get('mode');
            if (modeParam && MODES[modeParam]) requestedMode = modeParam;
            var depthParam = params.get('depth');
            if (depthParam && DEPTH_LEVELS[depthParam]) requestedDepth = depthParam;
        } catch (_) { /* ignore */ }

        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(function (tab) {
            var tabMode = tab.getAttribute('data-mode');
            var tabLabel = tab.querySelector('.mode-tab-label');
            var tabDesc = tab.querySelector('.mode-tab-desc');
            if (tabMode && MODES[tabMode]) {
                if (tabLabel) tabLabel.textContent = MODES[tabMode].label;
                if (tabDesc) tabDesc.textContent = MODES[tabMode].desc;
            }
            tab.addEventListener('click', function () {
                switchMode(tab.getAttribute('data-mode'));
            });
        });
        setupModeTabsKeyboard();

        // Depth buttons
        document.querySelectorAll('.depth-btn').forEach(function (btn) {
            var key = btn.getAttribute('data-depth');
            var icon = btn.querySelector('i');
            if (key && DEPTH_LEVELS[key]) {
                btn.textContent = '';
                if (icon) btn.appendChild(icon);
                btn.appendChild(document.createTextNode(' ' + DEPTH_LEVELS[key].label));
            }
            btn.addEventListener('click', function () {
                switchDepth(btn.getAttribute('data-depth'));
            });
        });
        setupDepthKeyboard();

        // Form inputs
        document.querySelectorAll('.ops-form input, .ops-form select, .ops-form textarea').forEach(function (field) {
            field.addEventListener('input', handleFormInput);
            field.addEventListener('change', handleFormInput);
        });

        // Output textarea: keep char count in sync when user edits
        var opsOutputEl = document.getElementById('opsOutput');
        if (opsOutputEl && opsOutputEl.tagName === 'TEXTAREA') {
            opsOutputEl.addEventListener('input', function () {
                var countEl = document.getElementById('outputCharCount');
                if (countEl) countEl.textContent = String(opsOutputEl.value.length);
            });
        }

        // Copy buttons
        var copyBtn = document.getElementById('outputCopyBtn');
        var copyCta = document.getElementById('outputCopyCta');
        var stickyCopy = document.getElementById('stickyCopyBtn');

        if (copyBtn) copyBtn.addEventListener('click', doCopyOutput);
        if (copyCta) copyCta.addEventListener('click', doCopyOutput);
        if (stickyCopy) stickyCopy.addEventListener('click', doCopyOutput);
        setupAiToolLaunchers();

        // Sessions
        var saveBtn = document.getElementById('sessionSaveBtn');
        var clearBtn = document.getElementById('sessionClearBtn');

        if (saveBtn) saveBtn.addEventListener('click', saveSession);
        if (clearBtn) clearBtn.addEventListener('click', clearSessions);

        // Render dynamic content
        renderLibrary();
        renderRules();
        renderSessions();

        // Initial output
        switchMode(requestedMode);
        switchDepth(requestedDepth);
        updateOutput();
        updateStickyCopyVisibility();
    });
})();
