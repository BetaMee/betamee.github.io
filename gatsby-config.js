module.exports = {
  siteMetadata: {
    title: '十二棵橡树',
    author: '橡树上',
    siteTitle: 'LoveOak'
  },
  plugins: [
    // HTML head支持
    'gatsby-plugin-react-helmet',
    // 'gatsby-plugin-react-next',
    // CSS
    'gatsby-plugin-styled-components',
    // {
    //   resolve: 'gatsby-plugin-typography',
    //   options: {
    //     pathToConfigModule: 'src/utils/typography.js',
    //   },
    // },
    // 文件处理
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/blogs`
      }
    },
    'gatsby-transformer-sharp',
    // markdown支持
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          { // markdown中的图片
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 650,
              showCaptions: true,
            },
          },
          { // 代码高亮
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
        ],
      },
    },
    // 图片支持
    'gatsby-plugin-sharp'
  ],
}
