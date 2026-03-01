import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5571,
    proxy: {
      '/api': {
        target: 'http://localhost:5570',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:5570',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
