import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/cesium/Build/Cesium/Workers/*',
                    dest: 'Workers'
                },
                {
                    src: 'node_modules/cesium/Build/Cesium/ThirdParty/*',
                    dest: 'ThirdParty'
                },
                {
                    src: 'node_modules/cesium/Build/Cesium/Assets/*',
                    dest: 'Assets'
                },
                {
                    src: 'node_modules/cesium/Build/Cesium/Widgets/*',
                    dest: 'Widgets'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': '/src',
            'cesium': path.resolve(__dirname, 'node_modules/cesium/Build/Cesium')
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
    },
    server: {
        port: 3000,
        open: true
    }
});