import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Google's token endpoint doesn't send CORS headers, so proxy it in dev.
      '/oauth/google/token': {
        target: 'https://oauth2.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth\/google\/token/, '/token'),
      },
    },
  },
})
