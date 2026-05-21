'use strict';

const { checkFulfillmentHealth } = require('./_lib/fulfillment');

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(JSON.stringify(payload));
}

module.exports = async function fulfillmentHealth(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  const health = await checkFulfillmentHealth();
  sendJson(res, health.ok ? 200 : 503, health);
};
