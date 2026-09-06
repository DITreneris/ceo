'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');
const { Resend } = require('resend');

const DOWNLOAD_TOKEN_TTL_SECONDS = Number(process.env.DOWNLOAD_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7);
const IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS = Number(process.env.IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS || 60 * 15);
const REDIS_STATE_TTL_SECONDS = Number(process.env.FULFILLMENT_STATE_TTL_SECONDS || 60 * 60 * 24 * 90);

const PRODUCTS = {
  operating: {
    id: 'operating',
    publicId: 'operating-pdf',
    name: 'CEO AI Operations Playbook',
    price: '$9.99',
    priceEnv: 'STRIPE_PRICE_OPERATING_PDF',
    sourceUrlEnv: 'PDF_OPERATING_SOURCE_URL',
    localFileName: 'CEO_Operations_Playbook.pdf',
    downloadFileName: 'prompt-anatomy-ceo-operations-playbook.pdf'
  },
  strategic: {
    id: 'strategic',
    publicId: 'strategic-pdf',
    name: 'CEO AI Strategy Playbook',
    price: '$19.99',
    priceEnv: 'STRIPE_PRICE_STRATEGIC_PDF',
    sourceUrlEnv: 'PDF_STRATEGIC_SOURCE_URL',
    localFileName: 'CEO_Strategic_AI_OS.pdf',
    downloadFileName: 'prompt-anatomy-ceo-strategic-ai-os.pdf'
  }
};

let redisClient = null;
let resendClient = null;

const FULFILLMENT_REQUIRED_ENV = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'DOWNLOAD_TOKEN_SECRET',
  'RESEND_API_KEY',
  'FULFILLMENT_FROM_EMAIL',
  'PDF_OPERATING_SOURCE_URL',
  'PDF_STRATEGIC_SOURCE_URL'
];

function listMissingFulfillmentEnv() {
  return FULFILLMENT_REQUIRED_ENV.filter((key) => !process.env[key]);
}

function assertFulfillmentConfigured() {
  const missing = listMissingFulfillmentEnv();
  if (missing.length) {
    throw new Error(`Fulfillment env missing on server: ${missing.join(', ')}`);
  }
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (typeof secret === 'string' && secret.includes(' ') && !secret.includes('+')) {
    throw new Error(
      'DOWNLOAD_TOKEN_SECRET looks corrupted (spaces instead of +). Re-paste in Vercel with quotes or use base64url.'
    );
  }
}

async function checkFulfillmentHealth() {
  const missing = listMissingFulfillmentEnv();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (missing.length) {
    return { ok: false, missing, redis: 'skipped', blobConfigured };
  }
  try {
    const ping = await getRedis().ping();
    return {
      ok: ping === 'PONG',
      missing: [],
      redis: ping === 'PONG' ? 'ok' : String(ping),
      blobConfigured
    };
  } catch (error) {
    return {
      ok: false,
      missing: [],
      redis: 'error',
      redisDetail: error && error.message ? String(error.message) : 'Redis ping failed',
      blobConfigured
    };
  }
}

function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('Redis REST environment variables are not configured.');
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

function getResend() {
  if (resendClient) return resendClient;
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function getProductById(productId) {
  return Object.values(PRODUCTS).find((p) => p.id === productId || p.publicId === productId) || null;
}

function getProductByPriceId(priceId) {
  if (!priceId) return null;
  return Object.values(PRODUCTS).find((p) => process.env[p.priceEnv] === priceId) || null;
}

function getProductByAmountCents(amountCents) {
  if (typeof amountCents !== 'number' || !Number.isFinite(amountCents)) return null;
  if (amountCents === 999) return PRODUCTS.operating;
  if (amountCents === 1999) return PRODUCTS.strategic;
  return null;
}

function getProductFromSession(session) {
  const metadataProduct = session && session.metadata ? getProductById(session.metadata.product) : null;
  if (metadataProduct) return metadataProduct;

  const lineItems = session && session.line_items && Array.isArray(session.line_items.data)
    ? session.line_items.data
    : [];

  for (const item of lineItems) {
    const priceId = item && item.price ? item.price.id : '';
    const product = getProductByPriceId(priceId);
    if (product) return product;
    const unitAmount = item && item.price && typeof item.price.unit_amount === 'number'
      ? item.price.unit_amount
      : null;
    const byUnit = getProductByAmountCents(unitAmount);
    if (byUnit) return byUnit;
  }

  if (session && typeof session.amount_total === 'number') {
    const byTotal = getProductByAmountCents(session.amount_total);
    if (byTotal) return byTotal;
  }

  throw new Error(
    'Checkout Session does not contain a configured PDF product (metadata.product, price id, or $9.99/$19.99 amount).'
  );
}

function getCustomerEmail(session) {
  if (session && session.customer_details && session.customer_details.email) {
    return session.customer_details.email;
  }
  if (session && session.customer_email) {
    return session.customer_email;
  }
  throw new Error('Checkout Session has no customer email.');
}

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function signEncodedPayload(encodedPayload) {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) throw new Error('DOWNLOAD_TOKEN_SECRET is not configured.');
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function createDownloadToken(sessionId, productId, ttlSeconds) {
  const ttl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : DOWNLOAD_TOKEN_TTL_SECONDS;
  const payload = {
    v: 1,
    sid: sessionId,
    product: productId,
    jti: crypto.randomBytes(18).toString('base64url'),
    exp: Math.floor(Date.now() / 1000) + ttl
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  return { token: `${encodedPayload}.${signEncodedPayload(encodedPayload)}`, payload };
}

/** Prefix Redis keys per project when sharing one Upstash DB (e.g. REDIS_KEY_PREFIX=ceo:). */
function redisKey(suffix) {
  const prefix = process.env.REDIS_KEY_PREFIX || '';
  return prefix ? `${prefix}${suffix}` : suffix;
}

function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex === email.length - 1) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length === 1) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function verifyDownloadToken(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') === -1) {
    throw new Error('Invalid download token.');
  }
  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('Invalid download token.');
  const expectedSignature = signEncodedPayload(parts[0]);
  const actualSignature = parts[1];
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(actualSignature);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw new Error('Invalid download token signature.');
  }
  const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Download token has expired.');
  }
  return payload;
}

async function redisGetJson(key) {
  const value = await getRedis().get(key);
  if (!value) return null;
  return typeof value === 'string' ? JSON.parse(value) : value;
}

async function redisSetJson(key, value, ttlSeconds, options) {
  const setOptions = Object.assign({}, options || {}, ttlSeconds ? { ex: ttlSeconds } : {});
  return getRedis().set(key, JSON.stringify(value), setOptions);
}

async function acquireLock(key, ttlSeconds) {
  const result = await redisSetJson(key, { lockedAt: new Date().toISOString() }, ttlSeconds, { nx: true });
  return result === 'OK' || result === true;
}

async function releaseLock(key) {
  await getRedis().del(key);
}

function getSiteUrl(origin) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (origin) return origin.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://www.promptanatomy.ceo';
}

function getLocalPdfPath(product) {
  return path.join(__dirname, '..', '_private', 'pdfs', product.localFileName);
}

async function assertProductAssetAvailable(product) {
  if (process.env[product.sourceUrlEnv]) return;
  if (fs.existsSync(getLocalPdfPath(product))) return;
  throw new Error(`${product.name} PDF source is not configured.`);
}

function getSourceHeaders(sourceUrl) {
  const headers = {};
  if (process.env.PDF_SOURCE_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.PDF_SOURCE_AUTH_TOKEN}`;
  }
  if (
    sourceUrl &&
    /blob\.vercel-storage\.com/i.test(sourceUrl) &&
    process.env.BLOB_READ_WRITE_TOKEN &&
    !headers.Authorization
  ) {
    headers.Authorization = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
  }
  return headers;
}

async function loadProductPdf(product) {
  const sourceUrl = process.env[product.sourceUrlEnv];
  if (sourceUrl) {
    const response = await globalThis.fetch(sourceUrl, { headers: getSourceHeaders(sourceUrl) });
    if (!response.ok) {
      throw new Error(`${product.name} PDF source returned ${response.status}.`);
    }
    return {
      type: 'buffer',
      body: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get('content-type') || 'application/pdf'
    };
  }
  const localPath = getLocalPdfPath(product);
  if (!fs.existsSync(localPath)) {
    throw new Error(`${product.name} PDF file is missing.`);
  }
  return {
    type: 'stream',
    body: fs.createReadStream(localPath),
    contentType: 'application/pdf'
  };
}

function buildDownloadUrl(token, origin) {
  const url = new URL('/api/download/', getSiteUrl(origin));
  url.searchParams.set('t', token);
  return url.toString();
}

function buildEmailText(product, downloadUrl) {
  return [
    `Thank you for buying ${product.name}.`,
    '',
    `Download link: ${downloadUrl}`,
    '',
    `This secure link expires in ${Math.round(DOWNLOAD_TOKEN_TTL_SECONDS / 86400)} days.`,
    'You also received a Stripe receipt under separate cover.',
    '',
    'Executive license: internal use for you and your immediate leadership team at the same company.',
    'Do not redistribute as-is. Full license: https://www.promptanatomy.ceo/terms.html#paid-pdf-license',
    '',
    '14-day no-questions-asked refund: reply to this email or to your Stripe receipt.',
    'Questions: info@promptanatomy.app',
    '',
    'Prompt Anatomy'
  ].join('\n');
}

function buildEmailHtml(product, downloadUrl) {
  const days = Math.round(DOWNLOAD_TOKEN_TTL_SECONDS / 86400);
  return [
    '<p>Thank you for your purchase of <strong>' + product.name + '</strong>.</p>',
    '<p><a href="' + downloadUrl + '">Download PDF</a></p>',
    '<p>This secure link expires in ' + days + ' days. You also received a Stripe receipt.</p>',
    '<p>Executive license — internal leadership team use. <a href="https://www.promptanatomy.ceo/terms.html#paid-pdf-license">Full license</a>.</p>',
    '<p>14-day no-questions-asked refund: reply to this email.</p>',
    '<p>Prompt Anatomy</p>'
  ].join('');
}

async function sendFulfillmentEmail(email, product, downloadUrl) {
  if (!process.env.FULFILLMENT_FROM_EMAIL) {
    throw new Error('FULFILLMENT_FROM_EMAIL is not configured.');
  }
  const { data, error } = await getResend().emails.send({
    from: process.env.FULFILLMENT_FROM_EMAIL,
    to: email,
    subject: `Your ${product.name} download`,
    text: buildEmailText(product, downloadUrl),
    html: buildEmailHtml(product, downloadUrl)
  });
  if (error) {
    throw new Error(`Resend rejected email: ${error.message || JSON.stringify(error)}`);
  }
  if (!data || !data.id) {
    throw new Error('Resend did not return a message id.');
  }
}

async function fulfillCheckoutSession(stripe, sessionId, origin) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  if (session.payment_status !== 'paid') {
    return { status: 'not_paid', sessionId };
  }

  const fulfillmentKey = redisKey(`fulfillment:${session.id}`);
  const existing = await redisGetJson(fulfillmentKey);
  if (existing && existing.status === 'fulfilled') {
    return { status: 'already_fulfilled', sessionId };
  }

  const lockKey = redisKey(`fulfillment-lock:${session.id}`);
  const locked = await acquireLock(lockKey, 300);
  if (!locked) {
    return { status: 'locked', sessionId };
  }

  try {
    const lockedExisting = await redisGetJson(fulfillmentKey);
    if (lockedExisting && lockedExisting.status === 'fulfilled') {
      return { status: 'already_fulfilled', sessionId };
    }

    const product = getProductFromSession(session);
    await assertProductAssetAvailable(product);
    const email = getCustomerEmail(session);
    const token = createDownloadToken(session.id, product.id, DOWNLOAD_TOKEN_TTL_SECONDS);
    const downloadUrl = buildDownloadUrl(token.token, origin);

    await redisSetJson(redisKey(`download-token:${token.payload.jti}`), {
      sessionId: session.id,
      productId: product.id,
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(token.payload.exp * 1000).toISOString()
    }, DOWNLOAD_TOKEN_TTL_SECONDS);

    await redisSetJson(fulfillmentKey, {
      status: 'email_pending',
      sessionId: session.id,
      productId: product.id,
      email,
      createdAt: new Date().toISOString()
    }, REDIS_STATE_TTL_SECONDS);

    await sendFulfillmentEmail(email, product, downloadUrl);

    await redisSetJson(fulfillmentKey, {
      status: 'fulfilled',
      sessionId: session.id,
      productId: product.id,
      email,
      fulfilledAt: new Date().toISOString()
    }, REDIS_STATE_TTL_SECONDS);

    return { status: 'fulfilled', sessionId: session.id, productId: product.id };
  } finally {
    await releaseLock(lockKey);
  }
}

async function resolveDownload(token) {
  const payload = verifyDownloadToken(token);
  const product = getProductById(payload.product);
  if (!product) throw new Error('Unknown PDF product.');

  const tokenRecord = await redisGetJson(redisKey(`download-token:${payload.jti}`));
  if (!tokenRecord || tokenRecord.sessionId !== payload.sid || tokenRecord.productId !== product.id) {
    throw new Error('Download token is not active.');
  }

  const fulfillment = await redisGetJson(redisKey(`fulfillment:${payload.sid}`));
  if (!fulfillment || fulfillment.status !== 'fulfilled' || fulfillment.productId !== product.id) {
    throw new Error('Purchase has not been fulfilled.');
  }

  return { product, fulfillment };
}

async function getDownloadUrlBySessionId(sessionId, origin) {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Missing session id.');
  }

  const fulfillment = await redisGetJson(redisKey(`fulfillment:${sessionId}`));
  if (!fulfillment) {
    throw new Error('Unknown checkout session.');
  }
  if (fulfillment.status !== 'fulfilled') {
    return { status: 'processing' };
  }

  const product = getProductById(fulfillment.productId);
  if (!product) {
    throw new Error('Unknown PDF product on fulfillment record.');
  }

  const token = createDownloadToken(sessionId, product.id, IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS);
  await redisSetJson(redisKey(`download-token:${token.payload.jti}`), {
    sessionId,
    productId: product.id,
    email: fulfillment.email,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(token.payload.exp * 1000).toISOString(),
    inPage: true
  }, IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS);

  return {
    status: 'ready',
    downloadUrl: buildDownloadUrl(token.token, origin),
    expiresAt: new Date(token.payload.exp * 1000).toISOString(),
    maskedEmail: maskEmail(fulfillment.email),
    productId: product.id,
    productName: product.name
  };
}

module.exports = {
  PRODUCTS,
  assertFulfillmentConfigured,
  checkFulfillmentHealth,
  listMissingFulfillmentEnv,
  fulfillCheckoutSession,
  loadProductPdf,
  resolveDownload,
  getDownloadUrlBySessionId,
  maskEmail
};
