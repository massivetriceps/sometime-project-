import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
=======
import tailwindcss from '@tailwindcss/vite' // 설치되어 있어야 함: npm install @tailwindcss/vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
>>>>>>> 2efdf399020f7844078853b5e424474c43f95834
