import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'dist',
  publicPath: '/',
  favicons: ['/brand/x-markdown-mark.png'],
  links: [
    { rel: 'stylesheet', href: '/site.css' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    { rel: 'stylesheet', href: '/katex.min.css' },
    { rel: 'stylesheet', href: '/hljs-theme.min.css' },
  ],
  metas: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  scripts: [{ src: '/site.js', defer: true }],
  themeConfig: {
    name: 'x-markdown-mini',
    logo: '/brand/x-markdown-mark.png',
    nav: [
      { title: '在线体验', link: '/playground' },
      { title: '文档', link: '/docs/quickstart' },
    ],
    socialLinks: {
      github: 'https://github.com/ant-design/x-markdown-mini',
    },
    sidebar: {
      '/docs': [
        {
          title: '入门',
          children: [
            { title: '文档概览', link: '/docs/quickstart' },
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
    footer: 'MIT Licensed',
    prefersColor: { default: 'light', switch: false },
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [],
  },
  mfsu: false,
});
