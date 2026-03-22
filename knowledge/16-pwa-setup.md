# PWA Setup (React+Vite)

## vite-plugin-pwa Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'App Name',
        short_name: 'App',
        description: 'App description',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
```

## Install Dependencies

```bash
yarn add -D vite-plugin-pwa workbox-build
```

## Service Worker Registration

Handled automatically by `vite-plugin-pwa` with `registerType: 'autoUpdate'`.

## Cache Strategies

- **NetworkFirst** — API calls (always try network, fallback to cache)
- **CacheFirst** — Static assets like images (serve from cache, update in background)
- **StaleWhileRevalidate** — Fonts and CSS (serve stale, revalidate)

## Offline Fallback

Configure in the workbox section for offline pages if needed.
