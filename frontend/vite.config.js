import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 설치되어 있어야 함: npm install @tailwindcss/vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
