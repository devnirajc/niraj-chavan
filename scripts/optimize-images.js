/**
 * Produce the image derivatives the page actually loads.
 *
 *   node scripts/optimize-images.js     # or: npm run images
 *
 * Masters live in assets-src/images/ and are read-only here. They sit outside
 * public/ on purpose: anything under public/ is copied verbatim into dist and
 * swept into the service worker's precache, so leaving the full-size originals
 * there would have shipped both them and the derivatives, costing more than
 * the resizing saved.
 *
 * Why this exists: the project screenshots were 1891px wide feeding a card
 * that maxes out near 380 CSS px, and the portrait was a 1457x1822 JPEG behind
 * an 88px circle. vite-plugin-image-optimizer re-encodes what it is given but
 * never resizes or changes format, so its `webp` setting had nothing to act on
 * — no .webp file existed in the project.
 *
 * WebP with no PNG fallback is deliberate. It is supported by every browser
 * back to Safari 14 (2020), which is already inside the es2020 build target in
 * vite.config.js, and a <picture> fallback would double what the service
 * worker precaches for a tier of browser that cannot run the bundle anyway.
 *
 * Outputs, all into public/assets/images/:
 *   <project>.webp   max 1000px wide — 380px card at 2x, with room to spare
 *   avatar.webp      256px square — the 88px hero circle at ~3x
 *   portrait.webp    800px square — never fetched by the page; it is what the
 *                    JSON-LD Person.image in index.html points a crawler at
 *
 * The dimensions printed for the project shots must match the width/height in
 * src/scripts/data/portfolio.json, which the cards use to reserve space before
 * the image lands. Re-run this after replacing any screenshot and copy the
 * numbers across.
 */

import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTERS = join(ROOT, 'assets-src/images');
const OUT = join(ROOT, 'public/assets/images');

/* A card tops out at ~380px (1180px container, three columns, 20px gaps), so
   1000px covers it at 2x and leaves headroom if the grid ever widens. */
const PROJECT_WIDTH = 1000;

/* Rendered at 88px in the hero and 64px in the sidebar. 256 covers the larger
   of the two at 3x, which is as far as any shipping display goes. */
const AVATAR_SIZE = 256;

/* Only ever fetched by a crawler resolving the JSON-LD, so it is sized for
   Google's rich-result guidance rather than for any layout on the page. */
const PORTRAIT_SIZE = 800;

const kB = (p) => (statSync(p).size / 1024).toFixed(1);

async function toWebp(sourceName, outName, transform) {
  const from = join(MASTERS, sourceName);
  const to = join(OUT, outName);

  const before = kB(from);
  const { width, height } = await transform(sharp(from))
    .webp({ quality: 80, effort: 6 })
    .toFile(to);

  console.log(
    `  ${outName.padEnd(18)} ${String(width).padStart(4)}x${String(height).padEnd(4)}` +
      `  ${before.padStart(7)} kB -> ${kB(to).padStart(6)} kB`
  );

  return { width, height };
}

const { projects } = JSON.parse(
  readFileSync(join(ROOT, 'src/scripts/data/portfolio.json'), 'utf-8')
);

console.log('\nProject screenshots');
const results = [];
for (const { image, title } of projects) {
  // portfolio.json names the derivative the page loads; the master is the PNG
  // of the same name in assets-src/.
  //
  // withoutEnlargement: flm.png and scope.png are only 612px wide. Blowing
  // them up would cost bytes and invent no detail — they stay native size and
  // simply render softer than the rest until they are re-captured.
  const { width, height } = await toWebp(image.replace(/\.webp$/, '.png'), image, (p) =>
    p.resize({ width: PROJECT_WIDTH, withoutEnlargement: true })
  );
  results.push({ title, image, width, height });
}

console.log('\nPortrait');
await toWebp('about.jpg', 'avatar.webp', (p) =>
  p.resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'top' })
);
await toWebp('about.jpg', 'portrait.webp', (p) =>
  p.resize(PORTRAIT_SIZE, PORTRAIT_SIZE, { fit: 'cover', position: 'top' })
);

console.log('\nCopy into src/scripts/data/portfolio.json:');
for (const { image, width, height } of results) {
  console.log(`  ${image.padEnd(18)} "width": ${width}, "height": ${height}`);
}
console.log('');
