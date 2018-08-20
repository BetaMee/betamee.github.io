import React from 'react'


import {
  Article,
  ArticleHeader,
  ArticleLink,
  Octicon
} from '../common/article/styled'

export default class CatgoryTemplate extends React.Component {
  render() {
    const { data } = this.props
    return (
      <React.Fragment>
        {/*文章列表*/}
        {data.allMarkdownRemark.edges.map((item, index) => {
          const article = item.node
          return (
            <Article key={index}>
              {/*文章标题*/}
              <ArticleHeader>
                <ArticleLink to={article.fields.slug}>
                  {article.frontmatter.title}<Octicon />
                </ArticleLink>
              </ArticleHeader>
            </Article>
          )
        })}  
      </React.Fragment>
    )
  }
}

export const catgoryTemplateQuery = graphql`
  query catgoryQuery($category: String!) {
    allMarkdownRemark(filter: { frontmatter: { category: {eq: $category} }}) {
      edges {
        node {
          fields {
            slug
          }
          html
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
	    }
    }
  }
`
