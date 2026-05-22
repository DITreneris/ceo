'use strict';

const fs = require('fs');
const path = require('path');

const STYLES = path.join(__dirname, '..', 'styles');
const bloated = fs.readFileSync(path.join(STYLES, 'components.css'), 'utf8');

function sliceBetween(text, startHeader, endHeader) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const startRe = new RegExp('/\\* ===== ' + esc(startHeader) + ' ===== \\*/');
  const start = text.search(startRe);
  if (start < 0) return '';
  let end = text.length;
  if (endHeader) {
    const endRe = new RegExp('/\\* ===== ' + esc(endHeader) + ' ===== \\*/');
    const endIdx = text.slice(start + 1).search(endRe);
    if (endIdx >= 0) end = start + 1 + endIdx;
  }
  return text.slice(start, end).trim();
}

const base =
  sliceBetween(bloated, 'RESET', 'LUCIDE IKONOS') +
  '\n\n' +
  sliceBetween(bloated, 'LUCIDE IKONOS', 'SKIP LINK') +
  '\n\n' +
  sliceBetween(bloated, 'SKIP LINK', 'BODY') +
  '\n\n' +
  sliceBetween(bloated, 'BODY', 'TOP NAV') +
  '\n\n' +
  sliceBetween(bloated, 'TOP NAV', 'HEADER / HERO');

const components =
  sliceBetween(bloated, 'LUCIDE IKONOS', 'SKIP LINK') +
  '\n\n' +
  sliceBetween(bloated, 'CTA BUTTONS', 'MODE SWITCHER') +
  '\n\n' +
  sliceBetween(bloated, 'PILL / BADGE SYSTEM', 'STEP BADGE') +
  '\n\n' +
  sliceBetween(bloated, 'STEP BADGE', 'COLLAPSIBLE SYSTEM') +
  '\n\n' +
  sliceBetween(bloated, 'DS 0.8 — component system', null);

const sections = fs.readFileSync(path.join(STYLES, 'sections.css'), 'utf8');
const tokens = fs.readFileSync(path.join(STYLES, 'tokens.css'), 'utf8');
const responsive = fs.readFileSync(path.join(STYLES, 'responsive.css'), 'utf8');

const opsSteps = '.ops-center .ops-work-steps {\n    margin-bottom: var(--space-16);\n}\n\n';
let sectionsOut = sections;
if (!sections.includes('ops-work-steps')) {
  sectionsOut = opsSteps + sectionsOut;
}

fs.writeFileSync(path.join(STYLES, 'base.css'), base.trim() + '\n');
fs.writeFileSync(path.join(STYLES, 'components.css'), components.trim() + '\n');
fs.writeFileSync(path.join(STYLES, 'sections.css'), sectionsOut.trim() + '\n');

console.log('Fixed partition:', {
  base: base.length,
  components: components.length,
  sections: sectionsOut.length,
  tokens: tokens.length,
  responsive: responsive.length
});
