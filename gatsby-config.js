module.exports = {
  siteMetadata: {
    title: '十二棵橡树',
    author: '橡树上',
    siteTitle: 'LoveOak'
  },
  plugins: [
    // HTML head支持
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    // CSS
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js',
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
    // 图片支持
    'gatsby-plugin-sharp',
    // markdown支持
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          { // 代码高亮
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
          { // markdown中的图片
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
  ],
}
