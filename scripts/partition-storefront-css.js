'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STYLE_PATH = path.join(ROOT, 'style.css');
const STYLES = path.join(ROOT, 'styles');

const css = fs.readFileSync(STYLE_PATH, 'utf8');
const rootMatch = css.match(/:root\s*\{[\s\S]*?\n\}/);
if (!rootMatch) {
  console.error(':root not found');
  process.exit(1);
}

const tokensCss = '/* Design tokens — hex literals allowed here (DS 0.8) */\n' + rootMatch[0] + '\n';

const mediaBlocks = [];
let withoutMedia = css.replace(/@media[^{]+\{([\s\S]*?)\n\}/g, function (full) {
  mediaBlocks.push(full.trim());
  return '';
});

withoutMedia = withoutMedia.replace(/:root\s*\{[\s\S]*?\n\}/, '').trim();

const COMPONENT_HEADERS = [
  'LUCIDE IKONOS',
  'CTA BUTTONS',
  'PILL / BADGE SYSTEM',
  'STEP BADGE',
  'DS 0.8 — component system'
];

const BASE_HEADERS = ['RESET', 'SKIP LINK', 'BODY'];

function sliceBetween(text, startHeader, endHeader) {
  const startRe = new RegExp('/\\* ===== ' + startHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ===== \\*/');
  const start = text.search(startRe);
  if (start < 0) return '';
  const afterStart = start;
  let end = text.length;
  if (endHeader) {
    const endRe = new RegExp('/\\* ===== ' + endHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ===== \\*/');
    const endIdx = text.slice(afterStart + 1).search(endRe);
    if (endIdx >= 0) end = afterStart + 1 + endIdx;
  }
  return text.slice(afterStart, end).trim();
}

let componentsCss = '';
let baseCss = '';
const usedRanges = [];

COMPONENT_HEADERS.forEach(function (header, i) {
  const next = COMPONENT_HEADERS[i + 1] || 'MODE SWITCHER';
  const chunk = sliceBetween(withoutMedia, header, next);
  if (chunk) {
    componentsCss += chunk + '\n\n';
    usedRanges.push(header);
  }
});

BASE_HEADERS.forEach(function (header, i) {
  const next = BASE_HEADERS[i + 1] || 'TOP NAV';
  const chunk = sliceBetween(withoutMedia, header, next);
  if (chunk) baseCss += chunk + '\n\n';
});

const topNav = sliceBetween(withoutMedia, 'TOP NAV', 'HEADER / HERO');
baseCss += topNav + '\n\n';

let sectionsCss = withoutMedia;
COMPONENT_HEADERS.concat(BASE_HEADERS).concat(['TOP NAV']).forEach(function (h) {
  const re = new RegExp('/\\* ===== ' + h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ===== \\*/[\\s\\S]*?(?=\\/\\* ===== |$)');
  sectionsCss = sectionsCss.replace(re, '');
});
sectionsCss = sectionsCss.replace(/\n{3,}/g, '\n\n').trim();

const responsiveCss = '/* Breakpoints */\n' + mediaBlocks.join('\n\n') + '\n';

fs.mkdirSync(STYLES, { recursive: true });
fs.writeFileSync(path.join(STYLES, 'tokens.css'), tokensCss);
fs.writeFileSync(path.join(STYLES, 'base.css'), baseCss.trim() + '\n');
fs.writeFileSync(path.join(STYLES, 'components.css'), componentsCss.trim() + '\n');
fs.writeFileSync(path.join(STYLES, 'sections.css'), sectionsCss + '\n');
fs.writeFileSync(path.join(STYLES, 'responsive.css'), responsiveCss);

fs.writeFileSync(
  STYLE_PATH,
  "/* Storefront entry — DS 0.8 partitioned */\n@import url('styles/tokens.css');\n@import url('styles/base.css');\n@import url('styles/components.css');\n@import url('styles/sections.css');\n@import url('styles/responsive.css');\n"
);

console.log('Wrote styles/*.css and updated style.css imports');
