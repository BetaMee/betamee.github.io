import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

// 图片资源
import searchImg from '../images/search.png'

// 响应式media函数
import media from '../utils/mediaquery'

/**
 * Header组件Group
 */
const HeaderWrapper = styled.header`
  height: 84px;
  width: 100%;
  background-color: #24292e;
  box-sizing: border-box;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Header = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 980px;
  ${media.desktop`
    width: 980px;
  `}
  ${media.tablet`
    width: 100%;
  `}
  ${media.phone`
    width: 100%;
  `}
`


const SiteTitle = styled.div`
  color: #FFFFFF;
  font-size: 26px;
  width: 25%;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align:center;
  margin: 0 10px;
`

const Underline = styled.span`
  color: #9E9E9E;
`

const Navigation = styled.div`
  width: 55%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LinkList = styled.ul`
  width: 50%;
  margin: 0 15px 0 0;
  display: flex;
  align-items: center;
`

const StyledLink = styled(Link)`
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  padding: 0 8px;
  &:hover {
    text-decoration: none;
    color: #FFFFFF;
  }
`

const SearchInput = styled.input`
  background-color: #424242;
  border-radius: 3px;
  outline: 0;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.075);
  font-size: 16px;
  line-height: 20px;
  padding: 2px 5px 2px 25px;
  transition: width .3s ease-in-out 0s;
  width: 35%;
  font-weight: 400;
  border-width: 0;
  color: #fff;
  min-height: 34px;
  &:focus {
    width: 40%;
  }
  background: url(${searchImg}) 8px center no-repeat #202326;
`

const HeaderPortal = () =>
  <HeaderWrapper>
    <Header>
      {/*导航栏*/}
      <SiteTitle>十二棵<Underline>橡树</Underline></SiteTitle>
      <Navigation>
        <LinkList>
          <StyledLink to='/'>Home</StyledLink>
          <StyledLink to='/'>Projects</StyledLink>
          <StyledLink to='/about'>About</StyledLink>
          <StyledLink to='/contact'>Contact</StyledLink>
        </LinkList>
        {/*搜索框*/}
        <SearchInput placeholder='Search...'/>
      </Navigation>
    </Header>
  </HeaderWrapper>

export default HeaderPortal
