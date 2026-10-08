/**
 * Generate the social preview card.
 *
 *   node scripts/generate-og.js     # or: npm run og
 *
 * Output: public/assets/images/og-image.jpg (1200x630), the default
 * og:image / twitter:image for every page (src/components/layout/Seo.astro).
 *
 * The artwork is an SVG rasterised by sharp, so the renderer only has the
 * host's fonts: the "N" mark is the path from favicon.svg rather than a
 * glyph, and the text is set in a generic stack — a substituted face changes
 * the texture and nothing else.
 *
 * The years figure comes from CAREER_START in src/data/profile.ts — the same
 * value the site uses — so re-running after a career anniversary keeps the
 * card in step with the copy. Re-run whenever the role or the year changes.
 */

import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/assets/images/og-image.jpg');
const WIDTH = 1200;
const HEIGHT = 630;

// profile.ts is TypeScript, so read the one constant rather than import it.
const profileSource = readFileSync(join(ROOT, 'src/data/profile.ts'), 'utf8');
const start = profileSource.match(/const CAREER_START = '(\d{4}-\d{2}-\d{2})'/)?.[1];
if (!start) throw new Error('CAREER_START not found in src/data/profile.ts');
const years = Math.floor((Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

/* From src/styles/tokens.css. The card uses the dark palette so it holds its
   edges against both the light and dark chrome that LinkedIn, Slack and X
   composite it onto. */
const INK = '#08090b';
const FG = '#eef0f3';
const MUTED = '#9aa1ad';
const INDIGO_300 = '#a5b4fc';
const INDIGO_500 = '#6366f1';
const GRID = 'rgba(238,240,243,0.05)';
const FONT = "Inter, 'Segoe UI', system-ui, -apple-system, Helvetica, Arial, sans-serif";
const MONO = "'Cascadia Mono', Consolas, 'SFMono-Regular', Menlo, monospace";

const gridLines = [];
for (let x = 0; x <= WIDTH; x += 48) gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}"/>`);
for (let y = 0; y <= HEIGHT; y += 48) gridLines.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}"/>`);

const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${INDIGO_500}" stop-opacity="0.28"/>
      <stop offset="70%" stop-color="${INDIGO_500}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fade" cx="30%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridMask"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/></mask>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${INK}"/>
  <g stroke="${GRID}" stroke-width="1" mask="url(#gridMask)">${gridLines.join('')}</g>
  <ellipse cx="1000" cy="60" rx="640" ry="520" fill="url(#glow)"/>

  <g transform="translate(80, 76)">
    <rect width="72" height="72" rx="16" fill="#0c0e12" stroke="rgba(238,240,243,0.12)"/>
    <g transform="translate(4, 4)">
      <path d="M18 48V16h10l10 20V16h10v32H38L28 28v20z" fill="${INDIGO_300}"/>
    </g>
  </g>

  <text x="80" y="300" font-family="${FONT}" font-size="84" font-weight="600" letter-spacing="-2" fill="${FG}">Niraj Chavan</text>
  <text x="80" y="368" font-family="${FONT}" font-size="40" font-weight="500" fill="${INDIGO_300}">Senior UI Engineer</text>

  <text x="80" y="450" font-family="${FONT}" font-size="28" fill="${MUTED}">Fast, accessible interfaces for enterprise teams</text>
  <text x="80" y="494" font-family="${FONT}" font-size="28" fill="${MUTED}">${years} years · Angular · React · TypeScript · Design systems</text>

  <text x="80" y="566" font-family="${MONO}" font-size="22" fill="${MUTED}">devnirajc.github.io/niraj-chavan</text>
</svg>
`;

await sharp(Buffer.from(card), { density: 192 })
  .resize(WIDTH, HEIGHT)
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
  .toFile(OUT);

console.log(`  ${OUT.replace(ROOT, '.')}  ${WIDTH}x${HEIGHT}  ${(statSync(OUT).size / 1024).toFixed(1)} kB`);
