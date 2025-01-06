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
      // "/incidents": {
      //   target: 'http://127.0.0.1:3000/api',
      //   changeOrigin:true,
      //   rewrite: (path) => path.replace(/^\/incidents/, ''),
      
      // },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});