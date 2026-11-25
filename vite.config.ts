import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base` is set from the workflow so assets resolve under /<repo>/ on GitHub Pages.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  // satellite.js ships an optional WASM worker that uses top-level await.
  worker: { format: 'es' },
  // The globe chunk (three.js) is lazy-loaded, so its size doesn't block first paint.
  build: { chunkSizeWarningLimit: 2500 },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
