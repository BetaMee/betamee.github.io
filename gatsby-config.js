module.exports = {
  siteMetadata: {
    title: '十二棵橡树',
  },
  plugins: [
    // 'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/src/content`
      }
    },
    'gatsby-transformer-remark',
  ],
}
