import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '#includes': path.resolve(__dirname, './src/includes'),
      '#hooks': path.resolve(__dirname, './src/hooks'),
      '#components': path.resolve(__dirname, './src/components'),
      '#store': path.resolve(__dirname, './src/store'),
      '#global': path.resolve(__dirname, '../global'),
      '#config': path.resolve(__dirname, './src/config'),
    },
  },
});
