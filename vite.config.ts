import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 53357,
  },
  plugins: [
    preact(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'Dark Souls III Cheat Sheet Translate',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://zkjellberg.github.io/dark-souls-3-cheat-sheet/'],
      },
      build: {
        externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },
      },
    }),
  ],
});
