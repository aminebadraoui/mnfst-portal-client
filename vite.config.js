import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdPlugin from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdPlugin.plugin({
      mode: ['html', 'raw']
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
