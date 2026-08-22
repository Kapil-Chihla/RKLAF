import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Hero video + vendor bundle exceed Vite’s default 500 kB advisory
    chunkSizeWarningLimit: 1200,
  },
})
