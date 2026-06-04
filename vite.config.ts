import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/to-provide-electricity-/', // هذا السطر هو المفتاح
})
