'use strict';
/**
 * HTML lint via W3C validator.nu (POST). GitHub Actions often gets HTTP 403
 * from validator.w3.org; we try html5.validator.nu, then skip in CI only.
 * Run locally before release for full W3C checks when the API is reachable.
 */
/* eslint-env node */

const { spawnSync } = require('child_process');
const path = require('path');

const FILES = ['index.html', 'success.html', 'terms.html', 'privacy.html'];
const REPO_ROOT = path.join(__dirname, '..');
const VALIDATORS = [
  { label: 'html5.validator.nu', uri: 'https://html5.validator.nu/?out=json' },
  { label: 'validator.w3.org', uri: null }
];
const BLOCKED = /unexpected statuscode:\s*403/i;

function runCli(file, validatorUri) {
  const args = ['html-validator-cli', '--file', file];
  if (validatorUri) {
    args.push('--validator', validatorUri);
  }
  return spawnSync('npx', args, {
    encoding: 'utf8',
    shell: true,
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function combinedOutput(result) {
  return [result.stdout, result.stderr, result.error && result.error.message]
    .filter(Boolean)
    .join('\n');
}

function validateFile(file) {
  let lastOutput = '';
  for (let i = 0; i < VALIDATORS.length; i++) {
    const { label, uri } = VALIDATORS[i];
    const result = runCli(file, uri);
    const output = combinedOutput(result);
    lastOutput = output;

    if (result.status === 0) {
      if (output.trim()) process.stdout.write(output);
      return;
    }

    if (!BLOCKED.test(output)) {
      process.stderr.write(output);
      process.exit(result.status || 1);
    }

    if (i < VALIDATORS.length - 1) {
      console.warn(`[lint:html] ${label} returned 403 for ${file}; trying fallback validator.`);
    }
  }

  if (process.env.CI) {
    console.warn(
      `[lint:html] Online validators blocked (403) for ${file} in CI. ` +
        'Skipped. Run `npm run lint:html` locally before release.'
    );
    return;
  }

  process.stderr.write(lastOutput);
  process.exit(1);
}

for (const file of FILES) {
  validateFile(file);
}
