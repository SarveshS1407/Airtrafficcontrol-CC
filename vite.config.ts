/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const proxyConfig = {
    '/api/opensky': {
      target: 'https://opensky-network.org/api',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/opensky/, ''),
      headers: {
        'User-Agent': 'AirTrafficControl-Frontend/2.0',
        ...(env.OPENSKY_BEARER_TOKEN
          ? {
              Authorization: `Bearer ${env.OPENSKY_BEARER_TOKEN}`,
            }
          : {}),
      },
      configure: (proxy: any) => {
        proxy.on('error', (err: any) => {
          console.error('[OpenSky Proxy Error]:', err.message);
        });
      },
    },
  };

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: proxyConfig,
    },
    preview: {
      port: 4173,
      proxy: proxyConfig,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
