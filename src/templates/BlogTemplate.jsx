import React from 'react'
import { graphql } from 'gatsby'


export default class BlogTemplate extends React.Component {
  render() {
    const article = this.props.data.markdownRemark
    const siteMetadata = this.props.data.site.siteMetadata
    return (
      <div>
        {article.frontmatter.title}
        <div dangerouslySetInnerHTML={{ __html: article.html }} />
      </div>
    )
  }
}

export const blogTemplateQuery = graphql`
  query articleBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        category
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
