(function () {
  'use strict';

  function escapeHtmlText(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setHookText(selector, text) {
    if (typeof text !== 'string') return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = text;
    });
  }

  function setHookHtml(selector, html) {
    if (typeof html !== 'string') return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.innerHTML = html;
    });
  }

  function isPlaceholderStripeUrl(url) {
    return typeof url === 'string' && /YOUR_/.test(url);
  }

  function initCommerce(commerce) {
    if (!commerce || typeof commerce !== 'object') return;
    var links = commerce.stripePaymentLinks || {};
    document.querySelectorAll('[data-stripe-cta]').forEach(function (cta) {
      var key = cta.getAttribute('data-stripe-cta');
      var url = key && Object.prototype.hasOwnProperty.call(links, key) ? links[key] : '';
      var blocked = commerce.allowPlaceholderCheckout === false && isPlaceholderStripeUrl(url);
      if (typeof url === 'string' && /^https:\/\//.test(url) && !blocked) {
        cta.setAttribute('href', url);
      }
    });
  }

  function initPdfGuideTocs(config) {
    if (!config || !config.pdfGuides) return;
    Object.keys(config.pdfGuides).forEach(function (key) {
      var def = config.pdfGuides[key];
      if (!def || !Array.isArray(def.chapters)) return;
      var list = document.querySelector('[data-toc-list="' + key + '"]');
      var countEl = document.querySelector('[data-toc-count="' + key + '"]');
      if (countEl) countEl.textContent = def.chapters.length + ' sections';
      if (!list) return;
      var html = '';
      def.chapters.forEach(function (ch) {
        var title = typeof ch === 'string' ? ch : (ch && ch.title ? ch.title : '');
        if (!title) return;
        html += '<li>' + escapeHtmlText(title) + '</li>';
      });
      list.innerHTML = html;
    });
  }

  function initBuyerFaq(config) {
    if (!config || !Array.isArray(config.buyerFaq)) return;
    var list = document.querySelector('[data-buyer-faq-list]');
    if (!list) return;
    // Build SSR (en/) already filled the list — do not duplicate.
    if (list.children && list.children.length > 0) return;
    var html = '';
    config.buyerFaq.forEach(function (item) {
      if (!item || !item.q || !item.a) return;
      html += '<details class="buyer-faq-item"' + (item.id ? ' id="' + escapeHtmlText(item.id) + '"' : '') + '>' +
        '<summary class="buyer-faq-q">' + escapeHtmlText(item.q) + '</summary>' +
        '<div class="buyer-faq-a">' + escapeHtmlText(item.a) + '</div></details>';
    });
    list.innerHTML = html;
  }

  function initLegal(config) {
    if (config && config.legal && config.legal.operatorLine) {
      setHookText('[data-legal-operator-line]', config.legal.operatorLine);
    }
  }

  var PDF_PREVIEW_DEFS = {
    operating: { title: 'Preview — CEO AI Operations Playbook', pages: [2, 3, 4] },
    strategic: { title: 'Preview — CEO AI Strategy Playbook', pages: [2, 3, 4] }
  };

  function initPdfPromises(config) {
    if (!config || !config.pdfGuides) return;
    Object.keys(config.pdfGuides).forEach(function (key) {
      var def = config.pdfGuides[key];
      if (!def || !def.buyerPromise) return;
      document.querySelectorAll('[data-pdf-promise="' + key + '"]').forEach(function (el) {
        el.textContent = def.buyerPromise;
      });
    });
  }

  function initPdfCardLabels(config) {
    if (!config || !config.pdfGuides) return;
    var strategic = config.pdfGuides.strategic;
    if (strategic && strategic.label) {
      document.querySelectorAll('[data-product="strategic-pdf"] h3').forEach(function (el) {
        el.textContent = strategic.label;
      });
    }
  }

  function initPdfPreviewDialog() {
    var dialog = document.getElementById('pdfPreviewDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var titleEl = document.getElementById('pdfPreviewTitle');
    var pagesEl = document.getElementById('pdfPreviewPages');
    var closeBtn = document.getElementById('pdfPreviewClose');
    if (!titleEl || !pagesEl || !closeBtn) return;
    var triggers = document.querySelectorAll('[data-preview-trigger]');
    if (!triggers.length) return;
    var lastTrigger = null;

    function renderPages(key) {
      var def = PDF_PREVIEW_DEFS[key];
      if (!def) return;
      titleEl.textContent = def.title;
      var html = '';
      def.pages.forEach(function (num) {
        var guideName = key === 'strategic' ? 'the CEO AI Strategy Playbook' : 'the CEO AI Operations Playbook';
        html += '<figure class="pdf-preview-page"><img src="/assets/pdf-covers/' + key + '-p' + num + '.png?v=2.1.3" width="367" height="475" alt="Preview page ' + num + ' of ' + guideName + '"><figcaption>Page ' + num + ' (preview)</figcaption></figure>';
      });
      pagesEl.innerHTML = html;
    }

    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var key = el.getAttribute('data-preview-trigger');
        renderPages(key);
        lastTrigger = el;
        dialog.showModal();
        closeBtn.focus();
      });
    });

    function closeDialog() {
      if (dialog.open) dialog.close();
    }
    closeBtn.addEventListener('click', closeDialog);
    dialog.addEventListener('click', function (e) {
      var rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        closeDialog();
      }
    });
    dialog.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
      pagesEl.innerHTML = '';
    });
  }

  function initHeroCopy(config) {
    if (!config || !config.copy || !config.copy.hero) return;
    var h = config.copy.hero;
    if (h.badgeParent) {
      var badgeParent = document.querySelector('[data-copy-hero-badge-parent]');
      if (badgeParent) {
        if (h.badgeParent.label) badgeParent.textContent = h.badgeParent.label;
        if (h.badgeParent.href) badgeParent.setAttribute('href', h.badgeParent.href);
        if (h.badgeParent.ariaLabel) badgeParent.setAttribute('aria-label', h.badgeParent.ariaLabel);
      }
    }
    if (h.badgeSpinoff) {
      var badgeSpinoff = document.querySelector('[data-copy-hero-badge-spinoff]');
      if (badgeSpinoff) {
        if (h.badgeSpinoff.label) badgeSpinoff.textContent = h.badgeSpinoff.label;
        if (h.badgeSpinoff.ariaLabel) badgeSpinoff.setAttribute('aria-label', h.badgeSpinoff.ariaLabel);
      }
    }
    if (h.eyebrow) setHookText('[data-copy-hero-eyebrow]', h.eyebrow);
    if (h.headlineBenefit) setHookText('[data-copy-hero-headline]', h.headlineBenefit);
    if (h.lead) setHookText('[data-copy-hero-lead]', h.lead);
    if (h.ctaMeta) setHookText('[data-copy-hero-meta]', h.ctaMeta);
    if (h.useCasesLabel) setHookText('[data-copy-hero-use-cases-label]', h.useCasesLabel);
    if (h.primaryCta) {
      document.querySelectorAll('[data-copy-hero-primary-cta]').forEach(function (el) {
        el.textContent = h.primaryCta;
        el.setAttribute('aria-label', h.primaryCta + ' in the operations center');
      });
    }
    if (h.secondaryCta) {
      var secondaryLabel = h.secondaryCta.indexOf('↓') === -1 ? h.secondaryCta + ' ↓' : h.secondaryCta;
      setHookText('[data-copy-hero-secondary-cta]', secondaryLabel);
      document.querySelectorAll('[data-copy-hero-secondary-cta]').forEach(function (el) {
        if (h.secondaryHref) el.setAttribute('href', h.secondaryHref);
      });
    }
    if (h.preview) {
      var pv = h.preview;
      if (pv.label) setHookText('[data-copy-hero-preview-label]', pv.label);
      if (pv.title) setHookText('[data-copy-hero-preview-title]', pv.title);
      var rowsEl = document.querySelector('[data-copy-hero-preview-rows]');
      if (rowsEl && Array.isArray(pv.rows) && pv.rows.length) {
        var rowsHtml = '';
        pv.rows.forEach(function (row) {
          if (!row) return;
          var detail = row.detail || row.action || '';
          rowsHtml +=
            '<li class="hero-prompt-card__item">' +
            '<div class="hero-prompt-card__item-head">' +
            '<span class="hero-prompt-card__priority">' + escapeHtmlText(row.priority || '') + '</span> ' +
            '<span class="hero-prompt-card__item-title">' + escapeHtmlText(row.title || '') + '</span>' +
            '</div>' +
            (detail ? '<p class="hero-prompt-card__detail">' + escapeHtmlText(detail) + '</p>' : '') +
            '</li>';
        });
        if (pv.more) {
          rowsHtml += '<li class="hero-prompt-card__more" aria-hidden="true">' + escapeHtmlText(pv.more) + '</li>';
        }
        rowsEl.innerHTML = rowsHtml;
      }
    }
    if (config.copy.opsCenter) {
      if (config.copy.opsCenter.title) setHookText('[data-copy-ops-title]', config.copy.opsCenter.title);
      if (config.copy.opsCenter.sampleCta) {
        setHookText('[data-copy-ops-sample-cta]', config.copy.opsCenter.sampleCta);
        document.querySelectorAll('[data-copy-ops-sample-cta]').forEach(function (el) {
          if (config.copy.opsCenter.sampleAriaLabel) {
            el.setAttribute('aria-label', config.copy.opsCenter.sampleAriaLabel);
          }
        });
      }
    }
    if (Array.isArray(config.copy.journeySteps)) {
      config.copy.journeySteps.forEach(function (label, i) {
        if (!label) return;
        var step = document.querySelector('.ops-journey-step[data-journey-step="' + i + '"]');
        if (!step) return;
        var num = step.querySelector('.ops-journey-step-num');
        var numHtml = num ? '<span class="ops-journey-step-num">' + escapeHtmlText(num.textContent) + '</span> ' : '';
        step.innerHTML = numHtml + escapeHtmlText(label);
      });
    }
    if (config.copy.opsDepth && config.copy.opsDepth.tip) {
      var tipEl = document.querySelector('[data-copy-ops-depth-tip] span');
      if (tipEl) {
        var tipText = config.copy.opsDepth.tip;
        var emphasis = tipText.match(/\b(Fast|Deep|Board)\b\.?$/);
        if (emphasis) {
          var lead = tipText.slice(0, emphasis.index);
          tipEl.innerHTML = escapeHtmlText(lead) + '<strong>' + escapeHtmlText(emphasis[1]) + '</strong>' + (tipText.endsWith('.') ? '.' : '');
        } else {
          tipEl.textContent = tipText;
        }
      }
    }
    if (config.copy.opsOutput) {
      var ops = config.copy.opsOutput;
      if (ops.emptyPlaceholder) {
        var outputEl = document.getElementById('opsOutput');
        if (outputEl && outputEl.tagName === 'TEXTAREA') outputEl.setAttribute('placeholder', ops.emptyPlaceholder);
      }
      if (ops.copiedToast) {
        var toastEl = document.getElementById('toast');
        if (toastEl) toastEl.setAttribute('data-copy-ops-toast-default', ops.copiedToast);
        var toastMsg = document.getElementById('toastMessage');
        if (toastMsg && !toastMsg.dataset.userMessage) toastMsg.textContent = ops.copiedToast;
      }
      if (ops.emptyCopyToast) {
        var toastEmpty = document.getElementById('toast');
        if (toastEmpty) toastEmpty.setAttribute('data-copy-ops-empty-toast', ops.emptyCopyToast);
      }
    }
    if (config.copy.footer) {
      var footer = config.copy.footer;
      if (footer.summary) setHookText('[data-copy-footer-summary]', footer.summary);
      if (footer.productLink) setHookHtml('[data-copy-footer-product-link]', footer.productLink);
      if (footer.hubContext) setHookHtml('[data-copy-hub-context]', footer.hubContext);
      if (footer.hubHomeLabel) setHookText('[data-copy-hub-home]', footer.hubHomeLabel);
      if (footer.hubHomeAriaLabel) {
        document.querySelectorAll('[data-module="hub"]').forEach(function (el) {
          el.setAttribute('aria-label', footer.hubHomeAriaLabel);
        });
      }
    }
  }

  function initNavCopy(config) {
    if (!config || !config.copy || !config.copy.nav) return;
    var nav = config.copy.nav;
    if (nav.playbooksCta) setHookText('[data-copy-nav-playbooks-cta]', nav.playbooksCta);
    if (nav.playbooksAriaLabel) {
      document.querySelectorAll('[data-copy-nav-playbooks-cta]').forEach(function (el) {
        el.setAttribute('aria-label', nav.playbooksAriaLabel);
      });
    }
  }

  function initTrustRow(config) {
    if (!config || !config.copy || !config.copy.trust) return;
    var trust = config.copy.trust;
    document.querySelectorAll('[data-trust-row]').forEach(function (container) {
      var key = container.getAttribute('data-trust-row') || 'row';
      var items = trust[key];
      if (!Array.isArray(items) || !items.length) return;
      if (container.getAttribute('data-trust-format') === 'inline') {
        var inlineHtml = '';
        items.forEach(function (item, i) {
          if (!item || !item.label) return;
          if (i > 0) inlineHtml += '<span class="hero-use-case-sep" aria-hidden="true">·</span>';
          inlineHtml += '<span class="hero-use-case-item">' + escapeHtmlText(item.label) + '</span>';
        });
        container.innerHTML = inlineHtml;
        return;
      }
      var html = '';
      items.forEach(function (item) {
        if (!item || !item.label) return;
        var icon = item.icon ? '<i data-lucide="' + escapeHtmlText(item.icon) + '" class="icon icon--sm" aria-hidden="true"></i>' : '';
        html += '<li>' + icon + '<span>' + escapeHtmlText(item.label) + '</span></li>';
      });
      container.innerHTML = html;
    });
    if (typeof window !== 'undefined' && window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  function initPdfCardBullets(config) {
    var bullets = config && config.copy && config.copy.pdfStorefront && config.copy.pdfStorefront.cardBullets;
    if (!bullets || typeof bullets !== 'object') return;
    Object.keys(bullets).forEach(function (key) {
      var list = bullets[key];
      if (!Array.isArray(list) || !list.length) return;
      document.querySelectorAll('[data-pdf-bullets="' + key + '"]').forEach(function (el) {
        var html = '';
        list.forEach(function (line) {
          if (!line) return;
          html += '<li>' + escapeHtmlText(line) + '</li>';
        });
        el.innerHTML = html;
      });
    });
  }

  function initOpsUpsell(config) {
    if (!config || !config.copy) return;
    var el = document.querySelector('[data-copy-ops-upsell]');
    if (!el) return;
    if (config.copy.opsUpsell) {
      var href = config.copy.opsUpsellHref || '#pdf-guides';
      var cta = config.copy.opsUpsellCta || 'See playbooks';
      el.innerHTML = escapeHtmlText(config.copy.opsUpsell) + ' <a href="' + escapeHtmlText(href) + '">' + escapeHtmlText(cta) + '</a>.';
    }
  }

  function initPdfStorefrontCopy(config) {
    if (!config || !config.copy || !config.copy.pdfStorefront) return;
    var ps = config.copy.pdfStorefront;
    if (ps.eyebrow) setHookText('[data-commerce-pdf-eyebrow]', ps.eyebrow);
    if (ps.heading) setHookText('[data-commerce-pdf-heading]', ps.heading);
    if (ps.lead) setHookText('[data-commerce-pdf-lead]', ps.lead);
    if (ps.buyerFaqHeading) setHookText('[data-commerce-pdf-faq-heading]', ps.buyerFaqHeading);
    if (ps.ctaOperating) setHookText('[data-commerce-cta-operating]', ps.ctaOperating);
    if (ps.ctaStrategic) setHookText('[data-commerce-cta-strategic]', ps.ctaStrategic);
    var kickers = ps.cardKickers;
    if (kickers && typeof kickers === 'object') {
      Object.keys(kickers).forEach(function (key) {
        if (!kickers[key]) return;
        document.querySelectorAll('[data-pdf-kicker="' + key + '"]').forEach(function (el) {
          el.textContent = kickers[key];
        });
      });
    }
  }

  function loadSotConfig() {
    if (window.location.protocol === 'file:') {
      return fetch('config/sot.json').catch(function () { return null; }).then(function (r) {
        return r && r.ok ? r.json() : null;
      });
    }
    return fetch('/config/sot.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadSotConfig().then(function (config) {
      if (config && config.commerce) initCommerce(config.commerce);
      if (config) {
        initHeroCopy(config);
        initNavCopy(config);
        initPdfStorefrontCopy(config);
        initTrustRow(config);
        initPdfCardBullets(config);
        initOpsUpsell(config);
        initPdfGuideTocs(config);
        initPdfPromises(config);
        initPdfCardLabels(config);
        initBuyerFaq(config);
        initLegal(config);
      }
      initPdfPreviewDialog();
    });
  });
})();
