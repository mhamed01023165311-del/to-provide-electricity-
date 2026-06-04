import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // السطر ده مهم جداً عشان جيت هاب يقرا المسارات صح جوه رابط موقعك
  base: '/to-provide-electricity-/',
  plugins: [react()],
});
