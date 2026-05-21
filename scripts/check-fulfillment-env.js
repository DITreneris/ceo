'use strict';

const fs = require('fs');
const path = require('path');

function loadDotEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

const REQUIRED = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'DOWNLOAD_TOKEN_SECRET',
  'RESEND_API_KEY',
  'FULFILLMENT_FROM_EMAIL',
  'PDF_OPERATING_SOURCE_URL',
  'PDF_STRATEGIC_SOURCE_URL'
];

async function main() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing:', missing.join(', '));
    process.exit(1);
  }

  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (secret.includes(' ') && !secret.includes('+')) {
    console.warn('WARN: DOWNLOAD_TOKEN_SECRET may be corrupted in Vercel UI.');
  }

  const { Redis } = require('@upstash/redis');
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  });
  console.log('Redis ping:', await redis.ping());
  console.log('From email:', process.env.FULFILLMENT_FROM_EMAIL);

  if (process.env.TEST_SEND !== '1') {
    console.log('Resend: skipped (TEST_SEND=1 to send test).');
    return;
  }
  const to = process.env.TEST_FULFILLMENT_EMAIL;
  if (!to) {
    console.error('Set TEST_FULFILLMENT_EMAIL when TEST_SEND=1');
    process.exit(1);
  }
  const { Resend } = require('resend');
  const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.FULFILLMENT_FROM_EMAIL,
    to,
    subject: '[check] CEO fulfillment env test',
    text: 'Resend from-address is valid.'
  });
  if (error) {
    console.error('Resend error:', error);
    process.exit(1);
  }
  console.log('Resend ok, id:', data && data.id);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
