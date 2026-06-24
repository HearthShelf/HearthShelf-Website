import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure a single React copy so Clerk (and any other lib) shares ours.
    dedupe: ['react', 'react-dom'],
  },
})
