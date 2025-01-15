import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tt-gen-pc/',  // Replace with your repository name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
