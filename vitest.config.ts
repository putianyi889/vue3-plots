import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            all: true,
            reporter: ['text', 'json-summary', 'html', 'lcov'],
            reportsDirectory: 'coverage',
            include: ['src/index.ts', 'src/components/**/*.{ts,vue}'],
            exclude: ['src/**/*.d.ts', 'src/components/pie-types.ts'],
        },
    },
})
