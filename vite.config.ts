import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', '**.ogg', '**.json', '**.svg'],
      manifest: {
        description: 'THE ARCs way of playing music',
        icons: [
          {
            sizes: '192x192',
            src: 'pwa-192x192.png',
            type: 'image/png',
          },
          {
            sizes: '512x512',
            src: 'pwa-512x512.png',
            type: 'image/png',
          },
          {
            purpose: 'any maskable',
            sizes: '512x512',
            src: 'pwa-512x512.png',
            type: 'image/png',
          },
        ],
        name: 'Moodsic',
        short_name: 'Moodsic',
        theme_color: '#000',
      },
    }),
  ]
})
