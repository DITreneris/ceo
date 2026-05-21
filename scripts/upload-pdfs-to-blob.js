'use strict';

/**
 * Upload paid PDFs to Vercel Blob (private). Run after npm run pdf:export.
 * Usage: node scripts/upload-pdfs-to-blob.js
 */

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'api', '_private', 'pdfs');

const UPLOADS = [
  {
    envKey: 'PDF_OPERATING_SOURCE_URL',
    blobPath: 'paid-pdfs/ceo-operations-playbook.pdf',
    candidates: ['CEO_Operations_Playbook.pdf', 'ceo-operations-playbook.pdf']
  },
  {
    envKey: 'PDF_STRATEGIC_SOURCE_URL',
    blobPath: 'paid-pdfs/ceo-strategic-ai-os.pdf',
    candidates: ['CEO_Strategic_AI_OS.pdf', 'ceo-strategic-ai-os.pdf']
  }
];

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(function (line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

function resolvePdfFile(candidates) {
  for (let i = 0; i < candidates.length; i += 1) {
    const full = path.join(PDF_DIR, candidates[i]);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

async function main() {
  loadDotEnv();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('Missing BLOB_READ_WRITE_TOKEN. Run: vercel env pull');
    process.exit(1);
  }
  console.log('Uploading to Vercel Blob (private)...\n');
  const envLines = [];
  for (let u = 0; u < UPLOADS.length; u += 1) {
    const spec = UPLOADS[u];
    const filePath = resolvePdfFile(spec.candidates);
    if (!filePath) {
      console.error('Missing PDF for ' + spec.envKey + '. Run: npm run pdf:export');
      process.exit(1);
    }
    const body = fs.readFileSync(filePath);
    const blob = await put(spec.blobPath, body, {
      access: 'private',
      contentType: 'application/pdf',
      token: token,
      addRandomSuffix: false,
      allowOverwrite: true
    });
    console.log(spec.envKey + '=' + blob.url);
    envLines.push(spec.envKey + '=' + blob.url);
  }
  console.log('\nSet in Vercel Production:\nBLOB_READ_WRITE_TOKEN=...\n');
  envLines.forEach(function (line) { console.log(line); });
}

main().catch(function (err) {
  console.error(err.message || err);
  process.exit(1);
});
