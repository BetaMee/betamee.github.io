import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

import OcticonImg from '../images/link.svg'

// const IndexWrapper = styled.div`

// 文章组件
const Article = styled.article`
`
// 文章发布信息
const ArticleHeader = styled.header`
  font-size: 1.6rem;
`
// Article Link
const ArticleLink = styled(Link)`
  position: relative;
`

const Octicon = styled.span`
  ${ArticleLink}:hover & {
    visibility:visible;
    opacity: 1;
  }
  display: inline-block;
  visibility:hidden;
  opacity: 0.1;
  transition: visibility,opacity .6s ease;
  user-select: none;
  position: absolute;
  top: 0;
  left: -16px;
  width: 16px;
  height: 100%;
  &:before {
    content: url(${OcticonImg});
  }
`

const PublishInfo = styled.p``

const PublishDate = styled.span`

`
const Publisher = styled.span`

`
const Category = styled.span`

`
// 文章内容
const ArticleContent = styled.div`

`

// 分页组件
const Pagination = styled.div`
  width: 100%;
`




const IndexPage = ({ indexpagearticles, data }) => (
  <React.Fragment>
    {/*文章列表*/}
    {indexpagearticles.map((article, index) => (
      <Article key={index}>
        {/*文章标题*/}
        <ArticleHeader>
          <ArticleLink>{article.title}<Octicon /></ArticleLink>
        </ArticleHeader>
        {/*文章信息*/}
        <PublishInfo>
          <PublishDate>{article.updateAt}</PublishDate>
          <Publisher>{article.author}</Publisher>
          <Category>{article.category}</Category>
        </PublishInfo>
        {/*文章内容*/}
        <ArticleContent>
          {article.content}
        </ArticleContent>
      </Article>
    ))}  
    {/*分页*/}
    <Pagination>分页</Pagination>
  </React.Fragment>
)

export default IndexPage

// mock数据
const indexpagearticles = [
  {
    articleId: '1234566', // 文章唯一ID
    title: 'Preview the new Organization Invitation API', // 文章title
    content: 'hhhhhhhh', // markdown数据
    author: 'BetaMee', // 作者
    avatar: '', // 头像地址
    updateAt: '2018-10-1', // 更新日期
    publishAt: '2018-5-9', // 发表时间
    category: 'JS Logs', // 类别
    // comments: [] // 评论，主页不放评论
  },
  {
    articleId: '1234566', // 文章唯一ID
    title: 'Preview the new Organization Invitation API', // 文章title
    content: 'hhhhhhhh', // markdown数据
    author: 'BetaMee', // 作者
    avatar: '', // 头像地址    
    updateAt: '2018-10-1', // 更新日期
    publishAt: '2018-5-9', // 发表时间
    category: 'JS Logs', // 类别
    // comments: [] // 评论，主页不放评论
  },
  {
    articleId: '1234566', // 文章唯一ID
    title: 'Preview the new Organization Invitation API', // 文章title
    content: 'hhhhhhhh', // markdown数据
    author: 'BetaMee', // 作者
    avatar: '', // 头像地址    
    updateAt: '2018-10-1', // 更新日期
    publishAt: '2018-5-9', // 发表时间
    category: 'JS Logs', // 类别
    // comments: [] // 评论，主页不放评论
  },
  {
    articleId: '1234566', // 文章唯一ID
    title: 'Preview the new Organization Invitation API', // 文章title
    content: 'hhhhhhhh', // markdown数据
    author: 'BetaMee', // 作者
    updateAt: '2018-10-1', // 更新日期
    publishAt: '2018-5-9', // 发表时间
    category: 'JS Logs', // 类别
    // comments: [] // 评论，主页不放评论
  }
]

IndexPage.defaultProps = {
  indexpagearticles: indexpagearticles,
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
