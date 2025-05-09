import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      manifest: {
        name: 'BERP-BFC group SA Enterprise resource planning',
        short_name: 'BERP',
        description: 'BFC group SA Enterprise resource planning',
        theme_color: '#ffffff'
      }
    }
  })],
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