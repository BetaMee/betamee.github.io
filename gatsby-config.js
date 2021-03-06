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
    // mdx
    'gatsby-plugin-mdx',
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
              maxWidth: 1000,
              quality: 50,
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
          { // 数学图标
            resolve: 'gatsby-remark-katex',
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`
            }
          }
        ],
      },
    },
    // 图片支持
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    // TS 支持
    'gatsby-plugin-typescript',
    // TS + SCSS + CSS_MODOULE 支持
    'gatsby-plugin-sass'
    // TS 检查
    // 'gatsby-plugin-typescript-checker'
  ],
}
