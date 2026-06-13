import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'vue3-plots',
  description: 'Composable Vue 3 SVG plot layers.',
  base: '/vue3-plots/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Components', link: '/components' },
      { text: 'Utilities', link: '/utils' },
      { text: 'Geometry', link: '/geometry' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Components', link: '/components' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'XAxis', link: '/components/x-axis' },
          { text: 'YAxis', link: '/components/y-axis' },
          { text: 'Grid', link: '/components/grid' },
          { text: 'Line', link: '/components/line' },
          { text: 'Scatter', link: '/components/scatter' },
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
})
