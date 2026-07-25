/**
 * Generate every raster icon from the single SVG source.
 *
 *   node scripts/generate-icons.js     # or: npm run icons
 *
 * Source of truth is public/assets/icons/favicon.svg — edit that and re-run
 * rather than editing any PNG by hand. (The previous version resized an
 * already-rasterised 96px PNG and padded it with the old indigo brand colour,
 * so every output was both soft and off-palette.)
 *
 * Outputs (every one of these is referenced — nothing here is generated and
 * then left unused):
 *   favicon-16/32.png      PNG fallback for browsers without SVG icon support
 *   nc.ico                 legacy container, 16/32/48
 *   apple-touch-icon.png   180px, opaque — iOS composites onto white otherwise
 *   icon-192/512.png       PWA, purpose "any"
 *   icon-maskable-512.png  PWA, purpose "maskable" — art inside the 80% safe zone
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICONS = join(ROOT, 'public/assets/icons');
const IMAGES = join(ROOT, 'public/assets/images');
const SOURCE = join(ICONS, 'favicon.svg');

/** Matches --ink-900 in src/styles/base/variables.css. */
const INK = '#1a1917';

if (!existsSync(ICONS)) mkdirSync(ICONS, { recursive: true });

const svg = readFileSync(SOURCE);

/**
 * Rasterise the source at `size`. `safeZone` shrinks the artwork inside an
 * opaque tile, which is what "maskable" icons need so a circular crop cannot
 * clip the letterform.
 */
async function render(size, outPath, { safeZone = 1, background } = {}) {
  const art = Math.round(size * safeZone);
  const pad = Math.round((size - art) / 2);

  // High density so the vector is rendered at full resolution, not upscaled.
  let pipeline = sharp(svg, { density: 384 }).resize(art, art);

  if (pad > 0) {
    pipeline = pipeline.extend({
      top: pad,
      bottom: size - art - pad,
      left: pad,
      right: size - art - pad,
      background: background || INK,
    });
  }

  if (background) {
    // `extend` only pads around the artwork; the tile's own rounded corners
    // stay transparent. Maskable and apple-touch icons have to be fully
    // opaque, or the platform composites those corners onto white — so
    // flatten the whole canvas rather than only padding it.
    pipeline = pipeline.flatten({ background });
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`  ${outPath.replace(ROOT, '.')}  ${size}x${size}`);
}

/**
 * Writes a multi-size .ico wrapping PNG-encoded entries.
 *
 * An ICO is a 6-byte directory header, one 16-byte entry per image, then the
 * image payloads. Entries may be PNG rather than BMP (supported since Vista),
 * which is why this needs no bitmap encoder — sharp produces the PNGs and this
 * only assembles the container.
 */
async function writeIco(sizes, outPath) {
  const images = await Promise.all(
    sizes.map((size) =>
      sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
    )
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map((png, i) => {
    const entry = Buffer.alloc(16);
    // 0 encodes 256; every size we emit is smaller, so a plain write is fine.
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0); // width
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  writeFileSync(outPath, Buffer.concat([header, ...entries, ...images]));
  console.log(`  ${outPath.replace(ROOT, '.')}  ${sizes.join('/')}`);
}

async function main() {
  console.log('Generating icons from favicon.svg');

  // Classic favicons — index.html has always referenced these from /images.
  await render(16, join(IMAGES, 'favicon-16x16.png'));
  await render(32, join(IMAGES, 'favicon-32x32.png'));

  // Legacy container, still referenced by index.html.
  await writeIco([16, 32, 48], join(IMAGES, 'nc.ico'));

  // iOS home screen; must be opaque.
  await render(180, join(ICONS, 'apple-touch-icon.png'), { background: INK });

  // PWA, purpose "any".
  await render(192, join(ICONS, 'icon-192.png'));
  await render(512, join(ICONS, 'icon-512.png'));

  // PWA, purpose "maskable".
  await render(512, join(ICONS, 'icon-maskable-512.png'), {
    safeZone: 0.8,
    background: INK,
  });

  console.log('Done.');
}

main().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(1);
});
