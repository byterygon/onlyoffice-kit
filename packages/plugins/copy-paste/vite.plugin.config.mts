import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  root: path.join(import.meta.dirname, 'plugin-src'),
  base: './',
  build: {
    outDir: path.join(import.meta.dirname, 'plugin'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'plugin.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
});
