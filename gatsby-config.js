module.exports = {
  pathPrefix: '/loveoak',
  siteMetadata: {
    title: '十二棵橡树',
    author: '橡树上'
  },
  plugins: [
    // HTML head支持
    'gatsby-plugin-react-helmet',
    // 全局样式支持
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.ts',
      },
    },
    // 文件处理
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'about',
        path: `${__dirname}/about`
      }
    },
    // markdown支持
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-autolink-headers'
          },
          { // markdown中的图片
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              linkImagesToOriginal: false
            },
          },
          { // 代码高亮
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {
                sh: 'bash'
              },
              noInlineHighlight: true
            },
          },
        ],
      },
    },
    // 图片支持
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    // TS 支持
    'gatsby-plugin-typescript',
    // TS + SCSS + CSS_MODOULE 支持
    'gatsby-plugin-scss-typescript',
    // TS 检查
    // 'gatsby-plugin-typescript-checker'
  ],
}
