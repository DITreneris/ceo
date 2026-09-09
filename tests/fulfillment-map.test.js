'use strict';

const assert = require('assert');
const { isForeignCheckout, getProductFromSession, PRODUCTS } = require('../api/_lib/fulfillment');

function hireSession() {
  return {
    metadata: {},
    success_url: 'https://www.promptanatomy.help/success.html',
    amount_total: 1199
  };
}

function hubSession() {
  return {
    metadata: { plan: '6' },
    success_url: 'https://www.promptanatomy.app/success',
    amount_total: 9900
  };
}

const hire = hireSession();
assert.strictEqual(isForeignCheckout(hire), true, 'Hire .help session is foreign');
assert.strictEqual(getProductFromSession(hire), null, 'Hire 1199 cents does not map to a CEO PDF');

const hub = hubSession();
assert.strictEqual(isForeignCheckout(hub), true, 'hub metadata.plan 6 is foreign');
assert.strictEqual(getProductFromSession(hub), null, 'hub session does not map to a CEO PDF');

const ceoMetaOnHelpUrl = {
  metadata: { product: 'operating' },
  success_url: 'https://www.promptanatomy.help/success.html',
  amount_total: 1199
};
assert.strictEqual(isForeignCheckout(ceoMetaOnHelpUrl), false, 'CEO metadata.product wins over .help URL');
assert.strictEqual(getProductFromSession(ceoMetaOnHelpUrl), PRODUCTS.operating, 'CEO metadata maps to operating');

const ceoUnitAmount = {
  metadata: {},
  success_url: 'https://www.promptanatomy.ceo/success.html?session_id=cs_live_example',
  line_items: {
    data: [{ price: { id: 'price_other', unit_amount: 999 } }]
  }
};
assert.strictEqual(isForeignCheckout(ceoUnitAmount), false, 'CEO .ceo URL is not foreign');
assert.strictEqual(getProductFromSession(ceoUnitAmount), PRODUCTS.operating, 'unit_amount 999 maps to operating');

const ceoAmountTotal = {
  metadata: {},
  success_url: 'https://www.promptanatomy.ceo/success.html',
  amount_total: 999
};
assert.strictEqual(isForeignCheckout(ceoAmountTotal), false, 'CEO amount_total last resort is not foreign');
assert.strictEqual(getProductFromSession(ceoAmountTotal), PRODUCTS.operating, 'amount_total 999 on .ceo maps to operating');

const trapHelpNineNinetyNine = {
  metadata: {},
  success_url: 'https://www.promptanatomy.help/success.html',
  amount_total: 999
};
assert.strictEqual(isForeignCheckout(trapHelpNineNinetyNine), true, '.help URL with 999 cents is still foreign');
assert.strictEqual(
  getProductFromSession(trapHelpNineNinetyNine),
  null,
  'amount_total 999 must not map a .help checkout to operating'
);

const unmappedCeo = {
  metadata: {},
  success_url: 'https://www.promptanatomy.ceo/success.html',
  amount_total: 5000
};
assert.strictEqual(isForeignCheckout(unmappedCeo), false, 'unmapped .ceo session is not foreign');
assert.strictEqual(getProductFromSession(unmappedCeo), null, 'unmapped .ceo does not invent a product');

console.log('fulfillment-map.test.js: 7 cases passed');
