import React from 'react'

import {
  CategoryHeader,
  CategoryTag,
  CategoryName,
  CategoryItem,
  CategoryPostTitle,
  CategoryPostDate
} from '../common/category/styled'

export default class CatgoryTemplate extends React.Component {
  render() {
    const {
      data,
      pathContext
    } = this.props

    return (
      <React.Fragment>
        {/*标题*/}
        <CategoryHeader>
          <CategoryTag> <i className='icon icon-books' />分类 * </CategoryTag>
          <CategoryName>{pathContext.category}</CategoryName>
        </CategoryHeader>
        {/*文章列表*/}
        {data.allMarkdownRemark.edges.map((item, index) => {
          const article = item.node
          return (
            <CategoryItem key={index}>
              {/*文章*/}
              <CategoryPostDate>{article.frontmatter.date}</CategoryPostDate>
              <CategoryPostTitle to={article.fields.slug}>
                {article.frontmatter.title}
              </CategoryPostTitle>
            </CategoryItem>
          )
        })}  
      </React.Fragment>
    )
  }
}

export const catgoryTemplateQuery = graphql`
  query catgoryQuery($category: String!) {
    allMarkdownRemark(filter: {frontmatter: { category: {eq: $category}}}, sort: { fields: [frontmatter___date], order: DESC}) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
          }
        }
	    }
    }
  }
`
