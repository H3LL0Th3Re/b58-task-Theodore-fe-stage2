import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Correct alias resolution
    },
  },

  esbuild: {
    jsxInject: `import React from 'react'`, // Ensure JSX is correctly injected
  },

  build: {
    sourcemap: false, // Disable sourcemaps to resolve sourcemap issue
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/**/*'],
    },
  },

  // In case of Rollup module resolution issues, externalize if necessary
  build: {
    rollupOptions: {
      external: ['@/components/ui/toaster'], // Add external dependencies here if needed
    },
  },
});


