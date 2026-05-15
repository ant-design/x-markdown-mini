import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'dist',
  publicPath: '/',
  favicons: ['/brand/x-markdown-mark.svg'],
  links: [{ rel: 'stylesheet', href: '/site.css' }],
  scripts: [{ src: '/site.js', defer: true }],
  themeConfig: {
    name: 'x-markdown-mini',
    logo: '/brand/x-markdown-mark.svg',
    nav: [
      { title: '首页', link: '/' },
      { title: 'Examples', link: '/examples/markdown' },
      { title: 'Playground', link: '/playground' },
      { title: 'Docs', link: '/docs/quickstart' },
      { title: 'GitHub', link: 'https://github.com/ant-design/x-markdown-mini' },
    ],
    sidebar: {
      '/examples': [
        {
          title: '组件',
          children: [
            { title: 'Markdown', link: '/examples/markdown' },
            { title: '流式渲染', link: '/examples/streaming' },
          ],
        },
        {
          title: '进阶',
          children: [{ title: 'RichText 路径', link: '/examples/richtext' }],
        },
      ],
      '/docs': [
        {
          title: '入门',
          children: [
            { title: '快速开始', link: '/docs/quickstart' },
            { title: '一次性渲染', link: '/docs/oneshot' },
          ],
        },
        {
          title: '流式',
          children: [
            { title: '流式渲染', link: '/docs/streaming' },
            { title: '打字机模式', link: '/docs/typewriter' },
            { title: '动画', link: '/docs/animation' },
          ],
        },
        {
          title: '平台',
          children: [
            { title: '能力矩阵', link: '/docs/platforms' },
            { title: '适配规则', link: '/docs/adapter-rules' },
            { title: '自定义平台', link: '/docs/custom-platform' },
          ],
        },
        {
          title: '参考',
          children: [
            { title: 'API 参考', link: '/docs/api' },
            { title: '类型导出', link: '/docs/types' },
            { title: 'Changelog', link: '/docs/changelog' },
          ],
        },
      ],
    },
    socialLinks: {
      github: 'https://github.com/ant-design/x-markdown-mini',
    },
    footer: 'MIT Licensed · Built for multi-mini-program markdown rendering.',
    prefersColor: { default: 'light', switch: false },
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [],
  },
  mfsu: false,
});
