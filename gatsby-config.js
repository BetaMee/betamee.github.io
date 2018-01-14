module.exports = {
  pathPrefix: '/loveoak',

  siteMetadata: {
    title: '十二棵橡树',
  },
  plugins: [
    // 'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',    
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src`
      }
    },
    'gatsby-transformer-remark',
    // 'gatsby-source-hacker-news',
    // 'gatsby-source-test'
  ],
}
