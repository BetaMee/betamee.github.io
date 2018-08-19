import React from 'react'

import {
  ArticleHeader,
  PublishInfo,
  PublishDate,
  Publisher,
  Category
} from '../pages/main/styled'

export default class ArticleTemplate extends React.Component {
  render() {
    const article = this.props.data.markdownRemark
    const siteMetadata = this.props.data.site.siteMetadata
    return (
      <div>
        <ArticleHeader>
          {article.frontmatter.title}
        </ArticleHeader>
        <PublishInfo>
          <PublishDate><i className="icon icon-calendar" />{article.frontmatter.date}</PublishDate>
          <Publisher>{siteMetadata.author}</Publisher>
          <Category><i className="icon icon-folder-open" />{article.frontmatter.category}</Category>
        </PublishInfo>
        <div dangerouslySetInnerHTML={{ __html: article.html }} />
      </div>
    )
  }
}

export const articleQuery = graphql`
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
