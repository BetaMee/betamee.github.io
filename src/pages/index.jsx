import React from 'react'
import styled from 'styled-components'

// const IndexWrapper = styled.div`

// `
const Article = styled.article`

`
// 文章发布信息
const ArticleHeader = styled.header`

`
const PublishInfo = styled.p``

const PublishDate = styled.span`

`
const Publisher = styled.span`

`
const Category =styled.span`

`
// 文章内容
const ArticleContent = styled.div`

`

// 分页组件


const IndexPage = ({ indexpageposts, data }) => (
  <React.Fragment>
    {/*文章列表*/}
    {indexpageposts.map((posts, index) => (
      <Article key={index}>
        {/*文章标题*/}
        <ArticleHeader></ArticleHeader>
        {/*文章信息*/}
        <PublishInfo>
          <PublishDate></PublishDate>
          <Publisher></Publisher>
          <Category></Category>
        </PublishInfo>
        {/*文章内容*/}
        <ArticleContent>
        </ArticleContent>
      </Article>
    ))}  
    {/*分页*/}
  </React.Fragment>
)

export default IndexPage

// mock数据

const indexpageposts = [
  {

  },
  {},
  {},
  {}
]

IndexPage.defaultProps = {
  indexpageposts: [],
}

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
