import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Specify "jsdom" or "node"
    setupFiles: './src/setup.ts', // Optional: Your test setup file
    coverage: {
      reporter: ['text', 'json', 'html'], // Optional: Coverage reporters
      exclude: ['node_modules/', 'src/test/**/*'], // Files to exclude from coverage
    },
  },
});
