import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';


const vitePWAConfig = {
  registerType: 'autoUpdate',
  manifest: {
    injectRegister: 'auto',
    name: '',
    short_name: 'BERP',
    description: 'Your app description',
    theme_color: '#FFFFFF',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  workbox: {
    importScripts: ['/service-worker/push.js'],
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  },
  includeAssets: ['favicon.ico', 'apple-touch-icon.png']
}
export default defineConfig({
  plugins: [react(), VitePWA(vitePWAConfig)],
  server: {
    proxy: {
      "/api": {
        target: 'http://127.0.0.1:8000',
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});