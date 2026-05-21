'use strict';

/**
 * Generate WebP siblings for PDF cover/preview PNGs (storefront perf).
 * Optional follow-up: install sharp first → `npm i -D sharp`.
 * If sharp is missing, this script logs a hint and exits 0 (non-blocking).
 *
 * Usage:
 *   npm run optimize:covers
 *
 * Output: assets/pdf-covers/*.webp (siblings of *.png)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COVER_DIR = path.join(ROOT, 'assets', 'pdf-covers');
const OG_DIR = path.join(ROOT, 'assets', 'og');

let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.log('[optimize:covers] sharp is not installed — skipping WebP generation.');
  console.log('[optimize:covers] To enable: `npm i -D sharp`, then rerun this script.');
  process.exit(0);
}

async function convertToWebp(srcPng, quality) {
  const dest = srcPng.replace(/\.png$/i, '.webp');
  await sharp(srcPng).webp({ quality }).toFile(dest);
  const before = fs.statSync(srcPng).size;
  const after = fs.statSync(dest).size;
  const savedPct = Math.round((1 - after / before) * 100);
  console.log(
    '[optimize:covers] ' +
      path.relative(ROOT, srcPng) +
      ' (' +
      Math.round(before / 1024) +
      ' KB) → ' +
      path.relative(ROOT, dest) +
      ' (' +
      Math.round(after / 1024) +
      ' KB, -' +
      savedPct +
      '%)'
  );
}

async function processDir(dir, quality) {
  if (!fs.existsSync(dir)) {
    return;
  }
  const entries = fs.readdirSync(dir).filter((n) => /\.png$/i.test(n));
  for (const name of entries) {
    await convertToWebp(path.join(dir, name), quality);
  }
}

(async () => {
  await processDir(COVER_DIR, 82);
  await processDir(OG_DIR, 85);
  console.log('\n[optimize:covers] Done. Add WebP <source> tags to PDF card <picture> for storefront perf.');
})().catch((err) => {
  console.error('[optimize:covers]', err);
  process.exit(1);
});
