import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 127.0.0.1: Windows'ta localhost/IPv6 kaynaklı bağlantı sorunlarını azaltır
      "/api": { target: "http://127.0.0.1:3000", changeOrigin: true },
    },
  },
})
