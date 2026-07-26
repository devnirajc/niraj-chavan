/**
 * Generate the social preview card.
 *
 *   node scripts/generate-og.js     # or: npm run og
 *
 * Output: public/assets/images/og-image.jpg (1200x630)
 *
 * One image serves both og:image and twitter:image — Twitter's
 * `summary_large_image` wants the same 1.91:1 frame Facebook and LinkedIn use,
 * so a second file would only be the same picture under another name. (The
 * tags previously pointed at og-image.jpg and twitter-card.jpg; neither file
 * had ever existed, so every share rendered a blank card.)
 *
 * The artwork is an SVG rasterised by sharp, which means the same caveat the
 * favicon carries applies here: the renderer has only the host's fonts, so the
 * "N" mark is the path from favicon.svg rather than a glyph. The remaining
 * text is set in a generic stack — it is a wordmark on a plain field, so a
 * substituted face changes the texture and nothing else.
 *
 * The years figure is read from about.json through the same yearsSince() the
 * page and the meta tags use, so re-running after a birthday of the career
 * cannot leave the card disagreeing with the copy beside it.
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { yearsSince } from '../src/scripts/utils/years.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = join(ROOT, 'public/assets/images');
const OUT = join(IMAGES, 'og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;

/* All five match src/styles/base/variables.css. The card is deliberately the
   dark palette: it has to hold its own edges against both the light and dark
   chrome that LinkedIn, Slack and X composite it onto. */
const NAVY = '#111c2e';
const MIST_100 = '#f7fafd';
const MIST_500 = '#6d8099';
const BLUE_400 = '#60a5fa';
const BLUE_500 = '#3b82f6';

const { experienceStartDate } = JSON.parse(
  readFileSync(join(ROOT, 'src/scripts/data/about.json'), 'utf-8')
);
const years = yearsSince(experienceStartDate || '2014-07-01');

const FONT = "Inter, 'Segoe UI', system-ui, -apple-system, Helvetica, Arial, sans-serif";

const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BLUE_500}" stop-opacity="0.22"/>
      <stop offset="68%" stop-color="${BLUE_500}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>

  <!-- The same soft halo the hero sits in, anchored off the top-right so it
       never sits behind the text. -->
  <ellipse cx="980" cy="90" rx="620" ry="620" fill="url(#glow)"/>

  <!-- Logo tile: the favicon artwork, scaled 64 -> 76 and moved into place.
       Kept as a path for the reason favicon.svg documents. -->
  <g transform="translate(80, 74)">
    <rect width="76" height="76" rx="17" fill="${BLUE_500}" fill-opacity="0.12"/>
    <g transform="translate(6, 6) scale(1.0)">
      <path d="M18 48V16h10l10 20V16h10v32H38L28 28v20z" fill="${BLUE_400}"/>
    </g>
  </g>

  <text x="80" y="300" font-family="${FONT}" font-size="88" font-weight="600" fill="${MIST_100}">Niraj Chavan</text>
  <text x="80" y="370" font-family="${FONT}" font-size="40" font-weight="500" fill="${BLUE_400}">Software Engineer</text>

  <text x="80" y="452" font-family="${FONT}" font-size="28" font-weight="400" fill="${MIST_500}">${years}+ years building scalable web applications</text>
  <text x="80" y="496" font-family="${FONT}" font-size="28" font-weight="400" fill="${MIST_500}">Angular &#183; React &#183; TypeScript &#183; Node.js</text>

  <rect x="80" y="556" width="120" height="4" rx="2" fill="${BLUE_500}"/>
</svg>
`;

if (!existsSync(IMAGES)) mkdirSync(IMAGES, { recursive: true });

// density lifts the rasteriser above the nominal 96dpi so the type is resolved
// at full size rather than scaled up from a smaller bitmap.
await sharp(Buffer.from(card), { density: 192 })
  .resize(WIDTH, HEIGHT)
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
  .toFile(OUT);

const { size } = statSync(OUT);
console.log(`  ${OUT.replace(ROOT, '.')}  ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(1)} kB`);
