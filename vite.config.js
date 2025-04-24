import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/webxr/',
    build: {
        outDir: 'dist'
    },
    server: {
        https: false
    }
}) 