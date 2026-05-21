'use strict';

/**
 * Renders PDF cover + sample pages (2-4) as PNG for storefront preview.
 * Run after pdf:export: npm run pdf:preview-images
 * Uses pdf-asset-export mode in pdf-print.css (734×950, one page at a time).
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'pdf-covers');

const COVER_WIDTH = 734;
const COVER_HEIGHT = 950;
const MIN_COVER_BYTES = 40000;
const MIN_PAGE_BYTES = 15000;

const JOBS = [
  {
    key: 'operating',
    html: path.join(ROOT, 'docs', 'pdf-source', 'operating-cadence.html'),
    coverOut: 'operating.png',
    pages: [2, 3, 4]
  },
  {
    key: 'strategic',
    html: path.join(ROOT, 'docs', 'pdf-source', 'strategic-os.html'),
    coverOut: 'strategic.png',
    pages: [2, 3, 4]
  }
];

function fileUrl(p) {
  const abs = path.resolve(p).replace(/\\/g, '/');
  return abs.startsWith('/') ? `file://${abs}` : `file:///${abs}`;
}

function readPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) {
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function validatePng(outFile, minBytes, label) {
  const buf = fs.readFileSync(outFile);
  const dim = readPngDimensions(buf);
  if (buf.length < minBytes) {
    throw new Error(
      label + ' too small (' + buf.length + ' bytes, min ' + minBytes + '): ' + outFile
    );
  }
  if (
    !dim ||
    dim.width !== COVER_WIDTH ||
    dim.height !== COVER_HEIGHT
  ) {
    throw new Error(
      label + ' dimensions ' + (dim ? dim.width + 'x' + dim.height : 'invalid') +
        ', expected ' + COVER_WIDTH + 'x' + COVER_HEIGHT + ': ' + outFile
    );
  }
}

async function renderSectionScreenshot(page, htmlPath, sectionIndex, outFile) {
  await page.goto(fileUrl(htmlPath), { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async (idx) => {
    document.body.classList.add('pdf-asset-export');
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const sections = document.querySelectorAll('section.page');
    sections.forEach((el, i) => {
      el.style.display = i === idx ? '' : 'none';
    });
  }, sectionIndex);
  const target = page.locator('section.page').nth(sectionIndex);
  await target.waitFor({ state: 'visible', timeout: 15000 });
  await target.screenshot({ path: outFile, type: 'png' });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: COVER_WIDTH, height: COVER_HEIGHT },
    deviceScaleFactor: 1
  });
  const page = await ctx.newPage();
  try {
    for (const job of JOBS) {
      const coverPath = path.join(OUT_DIR, job.coverOut);
      await renderSectionScreenshot(page, job.html, 0, coverPath);
      validatePng(coverPath, MIN_COVER_BYTES, job.key + ' cover');
      console.log('Wrote ' + path.relative(ROOT, coverPath));

      for (const num of job.pages) {
        const sectionIndex = num - 1;
        const out = path.join(OUT_DIR, job.key + '-p' + num + '.png');
        await renderSectionScreenshot(page, job.html, sectionIndex, out);
        validatePng(out, MIN_PAGE_BYTES, job.key + ' p' + num);
        console.log('Wrote ' + path.relative(ROOT, out));
      }
    }
  } finally {
    await browser.close();
  }
  console.log('\nPreview images ready in assets/pdf-covers/');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
