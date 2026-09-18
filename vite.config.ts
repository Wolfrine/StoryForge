import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['storyforge-icon.svg'],
      manifest: {
        id: '/',
        name: 'StoryForge',
        short_name: 'StoryForge',
        description:
          'A visualization and experience engine for living storyworlds.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f3efe7',
        theme_color: '#f3efe7',
        orientation: 'any',
        categories: ['books', 'entertainment', 'education'],
        icons: [
          {
            src: '/storyforge-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/storyforge-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/__/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'storyforge-firestore-network',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60
              }
            }
          },
          {
            urlPattern:
              /\/storyworld\/.*\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm|mp3|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'storyforge-media',
              expiration: {
                maxEntries: 180,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/Wolfrine\/StoryForge\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'storyforge-published-media',
              expiration: {
                maxEntries: 240,
                maxAgeSeconds: 60 * 60 * 24 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2022',
    sourcemap: true
  }
});
