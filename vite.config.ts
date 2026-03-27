import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiToken = env.VITE_API_TOKEN?.trim()

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/v4'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiToken) {
                proxyReq.setHeader('X-Auth-Token', apiToken)
              }
            })
          },
        },
      },
    },
  }
})
