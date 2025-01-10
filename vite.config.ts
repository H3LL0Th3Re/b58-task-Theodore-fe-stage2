import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Resolve alias for '@'
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
