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
  ],
  metas: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  scripts: [{ src: '/site.js', defer: true }],
  locales: [
    { id: 'zh-CN', name: '中文', suffix: '' },
    { id: 'en-US', name: 'English', suffix: '-en' },
  ],
  themeConfig: {
    name: 'x-markdown-mini',
    logo: '/brand/x-markdown-mark.png',
    nav: [
      { title: '在线体验', link: '/playground' },
      { title: '文档', link: '/docs/introduce' },
    ],
    socialLinks: {
      github: 'https://github.com/ant-design/x-markdown-mini',
    },
    sidebar: {
      '/docs': [
        {
          title: '',
          children: [
            { title: '介绍', link: '/docs/introduce' },
            { title: '代码示例', link: '/docs/code-examples' },
            { title: '流式渲染', link: '/docs/streaming' },
          ],
        },
        {
          title: '组件',
          children: [
            { title: '组件使用', link: '/docs/components' },
          ],
        },
        {
          title: '插件',
          children: [
            { title: '代码高亮', link: '/docs/plugins-code-highlight' },
            { title: '公式', link: '/docs/plugins-latex' },
            { title: '自定义插件', link: '/docs/plugins-custom' },
          ],
        },
      ],
    },
    footer: "",
    prefersColor: { default: 'light', switch: true },
    locales: {
      'en-US': {
        nav: [
          { title: 'Playground', link: '/playground' },
          { title: 'Docs', link: '/docs/introduce' },
        ],
        sidebar: {
          '/docs': [
            {
              title: '',
              children: [
                { title: 'Introduction', link: '/docs/introduce' },
                { title: 'Code Examples', link: '/docs/code-examples' },
                { title: 'Streaming Rendering', link: '/docs/streaming' },
              ],
            },
            {
              title: 'A Components',
              children: [
                { title: 'Component Usage', link: '/docs/components' },
              ],
            },
            {
              title: 'B Plugins',
              children: [
                { title: 'Code Highlight', link: '/docs/plugins-code-highlight' },
                { title: 'Formula', link: '/docs/plugins-latex' },
                { title: 'Custom Plugin', link: '/docs/plugins-custom' },
              ],
            },
          ],
        },
      },
    },
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [],
  },
  mfsu: false,
});
