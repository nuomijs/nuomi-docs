module.exports = {
  title: 'NuomiJS',
  description: 'React + Redux + Router最佳实践',
  head: [
    // 网站图标
    ['link', { rel: 'icon', href: '/images/logo.png' }],
    // 自定义样式
    ['link', { rel: 'stylesheet', href: '/styles/page.css' }],
  ],
  themeConfig: {
    // 侧边栏导航深度
    sidebarDepth: 2,
    // 头部导航
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '更新日志', link: 'https://github.com/nuomijs/nuomi/blob/master/CHANGELOG.md' },
      { text: 'Github', link: 'https://github.com/nuomijs/nuomi' },
    ],
    // 侧边栏
    sidebar: {
      '/guide/': [
        ['', '指南'],
        ['started', '快速入门'],
        ['advanced', '高级用法'],
      ],
      '/api/': [
        ['', 'API'],
      ],
    },
  },
};
