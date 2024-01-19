import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#app': path.resolve(__dirname, './src/app'),
      '#graphics': path.resolve(__dirname, './src/graphics'),
      '#repositories': path.resolve(__dirname, './src/repositories'),
      '#hooks': path.resolve(__dirname, './src/hooks'),
      '#utils': path.resolve(__dirname, './src/utils'),
      '#components': path.resolve(__dirname, './src/components'),
      '#styles': path.resolve(__dirname, './src/styles'),
      '#store': path.resolve(__dirname, './src/store'),
    },
  },
})
