/**
 * Print the résumé PDF from its HTML source.
 *
 *   node scripts/build-resume.mjs     # or: npm run resume
 *
 * Source: resume/resume.html. Output: public/assets/documents/Niraj-Chavan.pdf,
 * the file the site's résumé buttons download.
 *
 * Uses the installed Chrome (or Edge) in headless mode; set CHROME_PATH to use
 * another. The headings use Archivo from Google Fonts, so this needs network
 * access. The virtual-time budget gives the font time to load before printing.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'resume/resume.html');
const OUT = join(ROOT, 'public/assets/documents/Niraj-Chavan.pdf');

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((path) => path && existsSync(path));

if (!chrome) {
  console.error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${OUT}`,
    pathToFileURL(SOURCE).href,
  ],
  { stdio: 'inherit' },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Résumé written to ${OUT}`);
