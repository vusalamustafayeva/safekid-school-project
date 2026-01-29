import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist-school',
    emptyOutDir: true,
    rollupOptions: {
      input: '/index.school.html'
    }
  }
});
