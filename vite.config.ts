import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Vite config
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'), // Resolve alias for '@'
      '@': resolve(__dirname, './src'),
    },
  },

  esbuild: {
    jsxInject: `import React from 'react'`, // Ensure JSX is correctly injected
  },

  build: {
    sourcemap: false, // Disable sourcemaps to resolve sourcemap issue
    rollupOptions: {
      external: ['@/components/ui/toaster'], // Handle external dependencies if needed
    },
  },
});
