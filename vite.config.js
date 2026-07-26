import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { yearsSince } from './src/scripts/utils/years.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fills the __YEARS_OF_EXPERIENCE__ token in index.html.
 *
 * The SEO and social meta tags have to be correct in the raw HTML — the
 * crawlers behind link previews don't run our JavaScript — so the number is
 * resolved here rather than by the components that render the page. Both paths
 * read the same start date in about.json, so the tags can't drift from the
 * visible copy. It refreshes on redeploy, which is often enough for a value
 * that changes once a year.
 */
function experienceMeta() {
  const aboutPath = path.resolve(__dirname, './src/scripts/data/about.json');

  return {
    name: 'experience-meta',
    transformIndexHtml(html) {
      // Read per transform, so editing about.json in dev needs no restart.
      const { experienceStartDate } = JSON.parse(fs.readFileSync(aboutPath, 'utf-8'));
      const years = yearsSince(experienceStartDate || '2014-07-01');
      return html.replaceAll('__YEARS_OF_EXPERIENCE__', String(years));
    },
  };
}

export default defineConfig({
  root: './src',
  base: '/niraj-chavan/',
  publicDir: '../public',

  plugins: [
    // Keeps the meta tags' career length in step with about.json
    experienceMeta(),

    /*
      Last-pass re-encode of whatever reaches dist. It does not resize and does
      not convert between formats, so it is not what makes the screenshots
      small — `npm run images` does that ahead of the build, from the masters
      in assets-src/. This only squeezes the generated icons and the social
      card; the .webp files arrive already encoded at this quality.
    */
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),

    // PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'assets/icons/favicon.svg',
        'assets/icons/apple-touch-icon.png',
        'assets/images/nc.ico',
        'assets/images/favicon-32x32.png',
        'assets/images/favicon-16x16.png',
      ],
      manifest: {
        name: 'Niraj Chavan - Software Engineer',
        short_name: 'NC Portfolio',
        description: 'Portfolio website of Niraj Chavan, Software Engineer specializing in JavaScript, Angular, React, and Node.js',
        // Matches --bg-canvas / --accent in src/styles/base/variables.css
        theme_color: '#F2F6FC',
        background_color: '#F2F6FC',
        display: 'standalone',
        icons: [
          {
            src: 'assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            // Separate file: a "maskable" icon may be cropped to a circle, so
            // its artwork is inset to the 80% safe zone.
            src: 'assets/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
        // Neither is ever requested by the page — the social card is fetched by
        // link-preview crawlers and the portrait only by whatever resolves the
        // JSON-LD. Precaching them would spend ~80 kB of a first visitor's
        // bandwidth on two files that visitor will never see.
        globIgnores: ['**/og-image.jpg', '**/portrait.webp'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'components': [
            './src/components/app-sidebar.js',
            './src/components/theme-toggle.js',
          ],
        },
      },
    },
  },

  css: {
    postcss: './postcss.config.js',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@scripts': path.resolve(__dirname, './src/scripts'),
      '@utils': path.resolve(__dirname, './src/scripts/utils'),
      '@data': path.resolve(__dirname, './src/scripts/data'),
    },
  },

  server: {
    open: true,
    port: 5173,
  },
});
