import React from 'react'
import '../assets/icomoon/iconmoon.css'
import '../assets/style.css'

import {
  Article,
  ArticleHeader,
  ArticleLink,
  Octicon,
  PublishInfo,
  PublishDate,
  Publisher,
  Category,
  ArticleContent,
  Pagination
} from './main/styled'

const IndexPage = ({ data }) =>
  <React.Fragment>
    {/*文章列表*/}
    {data.allMarkdownRemark.edges.map((item, index) => {
      const article = item.node
      const siteMetadata = data.site.siteMetadata
      return (
        <Article key={index}>
          {/*文章标题*/}
          <ArticleHeader>
            <ArticleLink to={article.fields.slug}>
              {article.frontmatter.title}<Octicon />
            </ArticleLink>
          </ArticleHeader>
          {/*文章信息*/}
          <PublishInfo>
            <PublishDate><i className="icon icon-calendar" />{article.frontmatter.date}</PublishDate>
            <Publisher>{siteMetadata.author}</Publisher>
            <Category><i className="icon icon-folder-open" />{article.frontmatter.category}</Category>
          </PublishInfo>
          {/*文章内容*/}
          <ArticleContent>
            {article.excerpt}
          </ArticleContent>
        </Article>
      )
    })}  
    {/*分页*/}
    <Pagination>分页</Pagination>
  </React.Fragment>

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        author
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          excerpt
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
