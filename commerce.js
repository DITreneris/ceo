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
    if (commerce.deliveryPromise) {
      setHookText('[data-commerce-delivery-promise]', commerce.deliveryPromise);
    }
    var compare = commerce.compareStrip || {};
    if (compare.pdLabel) setHookText('[data-commerce-compare-pd-label]', compare.pdLabel);
    if (compare.pdValue) setHookText('[data-commerce-compare-pd-value]', compare.pdValue);
    if (compare.vsLabel) setHookText('[data-commerce-compare-vs]', compare.vsLabel);
    if (compare.operatingLabel) setHookText('[data-commerce-compare-operating-label]', compare.operatingLabel);
    if (compare.strategicLabel) setHookText('[data-commerce-compare-strategic-label]', compare.strategicLabel);
    if (compare.caption) setHookText('[data-commerce-compare-caption]', compare.caption);
    var pricing = commerce.pricing || {};
    if (pricing.operating && pricing.operating.now) {
      setHookText('[data-commerce-compare-operating-value]', pricing.operating.now);
    }
    if (pricing.strategic && pricing.strategic.now) {
      setHookText('[data-commerce-compare-strategic-value]', pricing.strategic.now);
    }
    var list = document.querySelector('[data-commerce-testimonials]');
    if (list && Array.isArray(commerce.testimonials)) {
      var html = '';
      commerce.testimonials.forEach(function (t) {
        if (!t || !t.quote) return;
        html += '<blockquote class="pdf-testimonial"><p>“' + escapeHtmlText(t.quote) + '”</p><footer>' +
          escapeHtmlText(t.cite || '') + (t.meta ? ' · ' + escapeHtmlText(t.meta) : '') + '</footer></blockquote>';
      });
      list.innerHTML = html;
    }
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
    var html = '';
    config.buyerFaq.forEach(function (item) {
      if (!item || !item.q || !item.a) return;
      html += '<details class="footer-faq-item"' + (item.id ? ' id="' + escapeHtmlText(item.id) + '"' : '') + '>' +
        '<summary class="footer-faq-q">' + escapeHtmlText(item.q) + '</summary>' +
        '<div class="footer-faq-a">' + escapeHtmlText(item.a) + '</div></details>';
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
        html += '<figure class="pdf-preview-page"><img src="/assets/pdf-covers/' + key + '-p' + num + '.png" width="367" height="475" alt="Preview page ' + num + ' of ' + key + ' guide"><figcaption>Page ' + num + ' (preview)</figcaption></figure>';
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
