import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'http://127.0.0.1:8000',
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      // "/login": {
      //   target: "http://127.0.0.1:8000/api_gateway/token", 
      //   changeOrigin: true, 
      // },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Ajoutez cette ligne pour définir l'alias
    },
  },
});