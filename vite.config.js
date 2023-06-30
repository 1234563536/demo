import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import inject from '@rollup/plugin-inject'
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    base: './',
    server: {
        host: 'localhost',
        port: 8080, //如果窗口被占用，会自动往后加1
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: false
            }
        }
    },
    plugins: [vue(), inject({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
    })],
    build: {
        target: ['edge90', 'chrome90', 'firefox90', 'safari15']
    },
})