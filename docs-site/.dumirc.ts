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
  locales: [
    { id: 'zh-CN', name: '中文', suffix: '' },
    { id: 'en-US', name: 'English', suffix: '-en' },
  ],
  themeConfig: {
    name: 'Ant Design x-markdown-mini',
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
          title: '介绍',
          children: [
            { title: '文档概览', link: '/docs/quickstart' },
            { title: '在线体验', link: '/playground' },
            { title: '主题', link: '/docs/quickstart#插件' },
            { title: '流式渲染', link: '/docs/streaming' },
          ],
        },
        {
          title: '组件',
          children: [
            { title: '总览', link: '/docs/platforms' },
            { title: '对话', link: '/docs/streaming' },
            { title: '图表', link: '/docs/adapter-rules' },
            { title: '高亮', link: '/docs/quickstart#围栏代码块' },
          ],
        },
        {
          title: '插件集',
          children: [
            { title: '总览', link: '/docs/quickstart#插件' },
            { title: '公式', link: '/docs/quickstart#插件' },
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
    footer: "",
    prefersColor: { default: 'light', switch: true },
    locales: {
      'en-US': {
        nav: [
          { title: 'Playground', link: '/playground' },
          { title: 'Docs', link: '/docs/quickstart' },
        ],
        sidebar: {
          '/docs': [
            {
              title: 'Introduction',
              children: [
                { title: 'Overview', link: '/docs/quickstart' },
                { title: 'Playground', link: '/playground' },
                { title: 'Themes', link: '/docs/quickstart#plugins' },
                { title: 'Streaming Rendering', link: '/docs/streaming' },
              ],
            },
            {
              title: 'Components',
              children: [
                { title: 'Overview', link: '/docs/platforms' },
                { title: 'Conversation', link: '/docs/streaming' },
                { title: 'Charts', link: '/docs/adapter-rules' },
                { title: 'Highlight', link: '/docs/quickstart#fenced-code-blocks' },
              ],
            },
            {
              title: 'Plugins',
              children: [
                { title: 'Overview', link: '/docs/quickstart#plugins' },
                { title: 'Formula', link: '/docs/quickstart#plugins' },
                { title: 'Custom Platform', link: '/docs/custom-platform' },
              ],
            },
            {
              title: 'Reference',
              children: [
                { title: 'API Reference', link: '/docs/api' },
                { title: 'Type Exports', link: '/docs/types' },
                { title: 'Changelog', link: '/docs/changelog' },
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
