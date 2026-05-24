/**
 * Local HTML lint – no network dependency.
 *
 * The optional W3C gate (scripts/lint-html.js) can fail when validator.w3.org
 * is unreachable or returns false negatives. These checks cover the static
 * invariants this repo depends on: doctype, unique IDs, balanced common tags
 * and existing local assets.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML_FILES = [
  'index.html',
  'lt/index.html',
  'en/index.html',
  'success.html',
  'terms.html',
  'privacy.html',
  'privatumas.html'
];

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

const BALANCED_TAGS = new Set([
  'a',
  'article',
  'aside',
  'body',
  'button',
  'details',
  'div',
  'fieldset',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'head',
  'header',
  'html',
  'label',
  'li',
  'main',
  'nav',
  'ol',
  'option',
  'p',
  'script',
  'section',
  'select',
  'span',
  'strong',
  'summary',
  'textarea',
  'title',
  'ul'
]);

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
  console.log(`✅ ${message}`);
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function getLocalAssetRefs(html) {
  const refs = [];
  const attrRe = /\b(?:href|src)=(['"])(.*?)\1/g;
  let match;
  while ((match = attrRe.exec(html)) !== null) {
    const value = match[2];
    if (
      !value ||
      value.startsWith('#') ||
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      value.startsWith('data:') ||
      value.startsWith('/_vercel/') ||
      /\+|\$\{|\{\{/.test(value)
    ) {
      continue;
    }
    refs.push(value.split('#')[0].split('?')[0]);
  }
  return refs;
}

function resolveAsset(pageRelPath, assetRef) {
  if (assetRef.startsWith('/')) {
    return path.join(ROOT, assetRef.slice(1));
  }
  return path.join(ROOT, path.dirname(pageRelPath), assetRef);
}

function assertUniqueIds(html, relPath) {
  const ids = new Map();
  const idRe = /\bid=(['"])([^'"]+)\1/g;
  let match;
  while ((match = idRe.exec(html)) !== null) {
    const id = match[2];
    ids.set(id, (ids.get(id) || 0) + 1);
  }
  const duplicates = Array.from(ids.entries())
    .filter(([, count]) => count > 1)
    .map(([id, count]) => `${id} (${count})`);
  assert(duplicates.length === 0, `${relPath}: unique id attributes`);
}

function assertBalancedTags(html, relPath) {
  const cleaned = stripComments(html);
  const stack = [];
  const tagRe = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*)?>/g;
  let match;
  while ((match = tagRe.exec(cleaned)) !== null) {
    const raw = match[0];
    const tag = match[1].toLowerCase();
    if (!BALANCED_TAGS.has(tag) || VOID_TAGS.has(tag) || raw.startsWith('<!')) continue;
    if (raw.startsWith('</')) {
      const open = stack.pop();
      if (open !== tag) {
        throw new Error(`${relPath}: expected </${open || 'none'}> before </${tag}>`);
      }
    } else if (!raw.endsWith('/>')) {
      stack.push(tag);
    }
  }
  assert(stack.length === 0, `${relPath}: no unclosed tracked tags`);
}

function lintHtmlFile(relPath) {
  const html = read(relPath);
  assert(/^<!doctype html>/i.test(html.trim()), `${relPath}: has doctype`);
  assert(
    /<html\s+lang="(?:lt|en(?:-[A-Za-z]+)?)"/i.test(html),
    `${relPath}: has supported html lang`
  );
  assert(/<meta\s+name="viewport"/i.test(html), `${relPath}: has viewport meta`);
  assert(!html.includes('<//'), `${relPath}: no broken closing tags`);
  assert(!/\s(?:href|src)=""/.test(html), `${relPath}: no empty href/src attributes`);
  assertUniqueIds(html, relPath);
  assertBalancedTags(html, relPath);

  getLocalAssetRefs(html).forEach((assetRef) => {
    const assetPath = resolveAsset(relPath, assetRef);
    assert(fs.existsSync(assetPath), `${relPath}: local asset exists (${assetRef})`);
  });
}

function run() {
  HTML_FILES.forEach(lintHtmlFile);
  console.log('\nHTML lint passed without remote validator.');
}

run();
