import React from 'react'


const IndexPage = ({ data }) =>
  <React.Fragment>
    <div>Hello</div>
  </React.Fragment>

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        author
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          html
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            category
          }
        }
	    }
    }
  }
`
