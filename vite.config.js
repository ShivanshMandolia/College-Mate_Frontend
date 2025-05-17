import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'https://college-mate-backend-1.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
