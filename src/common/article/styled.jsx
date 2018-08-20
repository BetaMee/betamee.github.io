import styled from 'styled-components'
import Link from 'gatsby-link'

import OcticonImg from '../../assets/images/link.svg'

// 文章组件
const Article = styled.article`
  margin-bottom: 30px;
`
// 文章发布信息
const ArticleHeader = styled.header`
  font-size: 1.6rem;
  margin-bottom: 5px;
`
// 文章链接
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
  top: -4px;
  left: -16px;
  width: 16px;
  height: 100%;
  &:before {
    content: url(${OcticonImg});
  }
`
// 发布信息
const PublishInfo = styled.p`
  margin-bottom: 5px;
  color: #999;
  font-size: 13px;
`
const PublishDate = styled.span`
  padding-right: 8px;
`
const Publisher = styled.span`
  padding-right: 8px;
`
const Category = styled.span``
// 文章内容
const ArticleContent = styled.div``

// 分页组件
const Pagination = styled.div`
  width: 100%;
`

export {
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
}
