module.exports = {
  siteMetadata: {
    title: `十二棵橡树`,
  },
  plugins: [
    // `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`
      }
    },
    `gatsby-transformer-remark`
  ],
}
