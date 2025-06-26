import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({

    define: {
    global: 'window',
  },
  
  plugins: [react()],
  resolve: {
    alias: {
      '@hq': path.resolve(__dirname, 'src/component/hq'),
      '@store': path.resolve(__dirname, 'src/component/store'),
      '@user': path.resolve(__dirname, 'src/component/user'),
      '@components': path.resolve(__dirname, 'src/component'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090', // ✅ Spring 서버 주소
        changeOrigin: true,
      }
    }
  }
})