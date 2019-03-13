import styled from 'styled-components'
import Link from 'gatsby-link'

const CategoryHeader = styled.div`
  font-size: 1.6rem;
  margin-bottom: 30px;
`
const CategoryTag = styled.span`
  color: #bbb;
`

const CategoryName = styled.span`
  font-weight: bold;
`

const CategoryItem = styled.div`
  border-bottom: 1px dashed #ccc;
  position: relative;
  margin-bottom: 22px; 
  &::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 12px;
    width: 6px;
    height: 6px;
    margin-left: -4px;
    background: #bbb;
    border-radius: 50%;
    border: 1px solid #fff;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    transition-property: background;
  }
`

const CategoryPostDate = styled.span`
  margin: 0 12px 0 15px;
`

const CategoryPostTitle = styled(Link)`
`
const CategoryLink = styled(Link)`
  color: #999;
`

export {
  CategoryHeader,
  CategoryTag,
  CategoryName,
  CategoryItem,
  CategoryPostTitle,
  CategoryPostDate,
  CategoryLink
}

