import { defineConfig } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default defineConfig({
  define: {
    'process.env': process.env, // Ensure environment variables are available
  },
  appType: 'mpa',
  base: '',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'auth/login/index.html'),
        register: path.resolve(__dirname, 'auth/register/index.html'),
        profile: path.resolve(__dirname, 'profile/index.html'),
        listing: path.resolve(__dirname, 'listing/index.html'), // Ensure this exists
        editListing: path.resolve(__dirname, 'listing/edit/index.html'),
        createListing: path.resolve(__dirname, 'listing/create/index.html'),
      },
    },
  },
});
