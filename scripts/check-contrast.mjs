/**
 * Colour contrast audit.
 *
 * Parses the semantic tokens out of src/styles/base/variables.css, resolves
 * var() indirection, and checks every foreground/background pair the design
 * actually renders against its WCAG 2.2 threshold.
 *
 *   node scripts/check-contrast.mjs        # or: npm run check:contrast
 *
 * Exits non-zero if any pair falls short, so the claim "AA everywhere" is
 * something the build can prove rather than something a comment asserts.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = readFileSync(join(ROOT, 'src/styles/base/variables.css'), 'utf8');

/* ============================================================
   TOKEN PARSING
   ============================================================ */

/**
 * Pulls `--name: value;` declarations out of a single CSS block.
 *
 * Brace-matched rather than searching for the first `\n}`, so adding a nested
 * rule (a `@media`, a `@supports`) inside a block cannot silently truncate the
 * token set and leave the audit checking fewer pairs than it reports.
 * Comments are stripped first so prose mentioning a token is never parsed as
 * a declaration.
 */
function parseBlock(source, selector) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');

  const start = clean.indexOf(selector);
  if (start === -1) throw new Error(`Block not found: ${selector}`);

  const open = clean.indexOf('{', start);
  let depth = 0;
  let close = -1;

  for (let i = open; i < clean.length; i += 1) {
    if (clean[i] === '{') depth += 1;
    else if (clean[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) throw new Error(`Unbalanced braces in block: ${selector}`);

  const tokens = {};
  for (const [, name, value] of clean.slice(open + 1, close).matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

const paletteAndLight = parseBlock(CSS, ':root {');
const darkOverrides = parseBlock(CSS, "[data-theme='dark'] {");

const THEMES = {
  light: paletteAndLight,
  dark: { ...paletteAndLight, ...darkOverrides },
};

/** Follows `var(--x)` chains down to a literal colour. */
function resolve(tokens, name, depth = 0) {
  if (depth > 10) throw new Error(`Cyclic token: --${name}`);

  const value = tokens[name];
  if (value === undefined) throw new Error(`Unknown token: --${name}`);

  const varMatch = value.match(/^var\(\s*--([\w-]+)\s*\)$/);
  return varMatch ? resolve(tokens, varMatch[1], depth + 1) : value;
}

/* ============================================================
   COLOUR MATH (WCAG 2.x relative luminance)
   ============================================================ */

function toRgb(color) {
  const hex = color.trim().replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;

  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Not a plain hex colour: ${color}`);
  }

  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance(color) {
  const [r, g, b] = toRgb(color).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ============================================================
   PAIRS UNDER TEST
   ============================================================
   `min` follows WCAG 2.2: 4.5 for body text (1.4.3), 3.0 for large text and
   for UI component / graphical boundaries (1.4.11). Body copy is held to the
   AAA threshold of 7.0 where the design already clears it. */
const PAIRS = [
  // Body and heading text on each surface
  { fg: 'text-primary', bg: 'bg-canvas', min: 7, note: 'body text on page' },
  { fg: 'text-primary', bg: 'bg-surface', min: 7, note: 'body text on card' },
  { fg: 'text-primary', bg: 'bg-sunken', min: 7, note: 'body text on well' },
  { fg: 'text-secondary', bg: 'bg-canvas', min: 7, note: 'prose on page' },
  { fg: 'text-secondary', bg: 'bg-surface', min: 7, note: 'prose on card' },
  { fg: 'text-secondary', bg: 'bg-sunken', min: 4.5, note: 'prose on well' },

  // Muted text — labels, captions, meta
  { fg: 'text-muted', bg: 'bg-canvas', min: 4.5, note: 'muted on page' },
  { fg: 'text-muted', bg: 'bg-surface', min: 4.5, note: 'muted on card' },
  { fg: 'text-muted', bg: 'bg-sunken', min: 4.5, note: 'muted on well' },

  // Accent text: links, eyebrows, current nav item
  { fg: 'accent-strong', bg: 'bg-canvas', min: 4.5, note: 'link on page' },
  { fg: 'accent-strong', bg: 'bg-surface', min: 4.5, note: 'link on card' },
  { fg: 'accent-strong', bg: 'accent-quiet', min: 4.5, note: 'current nav item' },
  { fg: 'accent-strong', bg: 'bg-sunken', min: 4.5, note: 'link on well' },

  // Solid controls
  { fg: 'text-on-accent', bg: 'accent-surface', min: 4.5, note: 'primary button label' },
  { fg: 'text-inverse', bg: 'bg-inverse', min: 4.5, note: 'skip link' },

  // Non-text contrast (SC 1.4.11): focus ring, control outlines, indicators
  { fg: 'focus-ring', bg: 'bg-canvas', min: 3, note: 'focus ring on page' },
  { fg: 'focus-ring', bg: 'bg-surface', min: 3, note: 'focus ring on card' },
  { fg: 'border-interactive', bg: 'bg-canvas', min: 3, note: 'control outline on page' },
  { fg: 'border-interactive', bg: 'bg-surface', min: 3, note: 'control outline on card' },
  { fg: 'border-interactive', bg: 'bg-sunken', min: 3, note: 'control outline on well' },
  { fg: 'accent-surface', bg: 'bg-canvas', min: 3, note: 'timeline marker / filled dot' },
  { fg: 'accent-surface', bg: 'bg-surface', min: 3, note: 'filled dot on card' },
  { fg: 'accent-surface', bg: 'accent-quiet', min: 3, note: 'current-item marker bar' },

  /* Reported but not enforced. `--border-subtle` / `--border-default` draw
     card edges, section rules and the timeline rail — decoration and visual
     grouping, none of it the boundary of a control or required to understand
     any content, so SC 1.4.11 does not set a floor for them. They are printed
     so a deliberately-quiet line can never be confused with an oversight. */
  { fg: 'border-subtle', bg: 'bg-surface', min: null, note: 'card hairline (decorative)' },
  { fg: 'border-default', bg: 'bg-canvas', min: null, note: 'timeline rail (decorative)' },
  { fg: 'border-strong', bg: 'bg-surface', min: null, note: 'hover boundary (decorative)' },
];

/* ============================================================
   RUN
   ============================================================ */

let failures = 0;
let enforcedCount = 0;
const rows = [];

for (const theme of Object.keys(THEMES)) {
  for (const { fg, bg, min, note } of PAIRS) {
    const fgColor = resolve(THEMES[theme], fg);
    const bgColor = resolve(THEMES[theme], bg);
    const ratio = contrast(fgColor, bgColor);
    const enforced = min !== null;
    const pass = !enforced || ratio >= min;

    if (!pass) failures += 1;
    if (enforced) enforcedCount += 1;

    rows.push({
      theme,
      pair: `${fg} on ${bg}`,
      note,
      ratio: `${ratio.toFixed(2)}:1`,
      required: enforced ? `${min}:1` : '—',
      result: enforced ? (pass ? 'PASS' : 'FAIL') : 'info',
    });
  }
}

console.table(rows);

if (failures > 0) {
  console.error(`\n${failures} of ${enforcedCount} enforced colour pairs are below threshold.`);
  process.exit(1);
}

console.log(
  `\nAll ${enforcedCount} enforced colour pairs meet their WCAG 2.2 threshold (light + dark).`
);
