import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const configDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    title: 'vue3-plots',
    description: 'Composable Vue 3 SVG plot layers.',
    base: '/vue3-plots/',
    cleanUrls: true,
    themeConfig: {
        search: {
            provider: 'local',
        },
        nav: [
            { text: 'Guide', link: '/' },
            { text: 'Examples', link: '/examples' },
            { text: 'Components', link: '/components' },
            { text: 'Utilities', link: '/utils' },
            { text: 'Geometry', link: '/geometry' },
        ],
        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Introduction', link: '/' },
                    { text: 'Tutorial', link: '/tutorial' },
                    { text: 'Examples', link: '/examples' },
                    { text: 'Components', link: '/components' },
                ],
            },
            {
                text: 'Components',
                items: [
                    { text: 'Axis', link: '/components/axis' },
                    { text: 'TransformGroup', link: '/components/transform-group' },
                    { text: 'Grid', link: '/components/grid' },
                    { text: 'ImageGrid', link: '/components/image-grid' },
                    { text: 'Line', link: '/components/line' },
                    { text: 'Bar', link: '/components/bar' },
                    { text: 'Scatter', link: '/components/scatter' },
                    { text: 'Pie', link: '/components/pie' },
                    { text: 'MiniPie', link: '/components/mini-pie' },
                    { text: 'MouseDraw', link: '/components/mouse-draw' },
                    { text: 'XLabel', link: '/components/x-label' },
                    { text: 'YLabel', link: '/components/y-label' },
                ],
            },
            {
                text: 'API',
                items: [
                    { text: 'Utilities', link: '/utils' },
                    { text: 'Geometry', link: '/geometry' },
                ],
            },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/putianyi889/vue3-plots' },
        ],
    },
    vite: {
        resolve: {
            alias: [
                {
                    find: '@putianyi888/vue3-plots/style.css',
                    replacement: resolve(configDir, '../../src/style.css'),
                },
                {
                    find: '@putianyi888/vue3-plots',
                    replacement: resolve(configDir, '../../src/index.ts'),
                },
            ],
        },
    },
})
