import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: './src',
  base: '/niraj-chavan/',
  publicDir: '../public',

  plugins: [
    // Image optimization
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
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Niraj Chavan - Software Engineer',
        short_name: 'NC Portfolio',
        description: 'Portfolio website of Niraj Chavan, Software Engineer specializing in JavaScript, Angular, React, and Node.js',
        theme_color: '#6366F1',
        background_color: '#F9FAFB',
        display: 'standalone',
        icons: [
          {
            src: '/niraj-chavan/assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/niraj-chavan/assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
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
