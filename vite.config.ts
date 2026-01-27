import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.PASSKEY': JSON.stringify(env.PASSKEY),
        'process.env.ADMIN_USER': JSON.stringify(env.ADMIN_USER),
        'process.env.ADMIN_PASS': JSON.stringify(env.ADMIN_PASS)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
