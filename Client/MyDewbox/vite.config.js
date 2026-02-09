import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // If you access the dev server via a LAN IP (phone/another PC), set HMR host explicitly:
    //   setx VITE_HMR_HOST 192.168.x.x
    // and restart `npm run dev`.
    hmr: process.env.VITE_HMR_HOST ? { host: process.env.VITE_HMR_HOST } : undefined,
    // This is crucial for client-side routing
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
