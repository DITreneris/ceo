'use strict';

/**
 * Vercel output is the repo root. After npm run build, drop scripts/ so
 * operator/build JS is not served as static files.
 */
const fs = require('fs');
const path = require('path');

if (!process.env.VERCEL) process.exit(0);

fs.rmSync(path.join(__dirname), { recursive: true, force: true });
