import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    base: './',
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    }
});
