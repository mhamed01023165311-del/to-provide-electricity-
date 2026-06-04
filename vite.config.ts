import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// الكود ده بيجبر السيرفر يقرأ من جوه مجلد المستودع بتاعك بالظبط
export default defineConfig({
  plugins: [react()],
  base: './', 
})
