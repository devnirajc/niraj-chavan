/**
 * Generate PWA icons from favicon
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const sourceImage = join(projectRoot, 'public/assets/images/favicon-96x96.png');
const outputDir = join(projectRoot, 'public/assets/icons');

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate icons
const sizes = [192, 512];

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}.png`);

    try {
      await sharp(sourceImage)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 99, g: 102, b: 241, alpha: 1 } // #6366F1
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${outputPath}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error.message);
    }
  }

  console.log('Done!');
}

generateIcons().catch(console.error);
