/**
 * Quick production trace: HEAD homepage + og image with Twitter crawler UA.
 * Usage: npm run trace:og
 * Optional: SITE_URL=https://example.com npm run trace:og
 */
/* eslint-env node */
/* eslint-disable no-console */

const { execSync } = require('child_process');

const BASE = (process.env.SITE_URL || 'https://www.promptanatomy.ceo').replace(/\/$/, '');
const paths = ['/', '/assets/og/og-cover.png?v=4'];

console.log('OG trace — Twitterbot User-Agent, HEAD');
console.log('Base:', BASE);
for (let i = 0; i < paths.length; i++) {
  const u = BASE + paths[i];
  console.log('\n--- ' + u);
  execSync('curl.exe -sI -A "Twitterbot/1.0" ' + JSON.stringify(u), { stdio: 'inherit' });
}
