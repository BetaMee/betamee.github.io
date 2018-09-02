import React from 'react'

import {
  ArticleHeader,
  PublishInfo,
  PublishDate,
  Publisher,
  Category
} from '../common/article/styled'

import {
  CategoryLink
} from '../common/category/styled'

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
          <Category>
            <i className="icon icon-folder-open" />
            <CategoryLink to={`/category/${article.frontmatter.category}`}>{article.frontmatter.category}</CategoryLink>
          </Category>
        </PublishInfo>
        <div dangerouslySetInnerHTML={{ __html: article.html }} />
      </div>
    )
  }
}

export const articleTemplateQuery = graphql`
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
