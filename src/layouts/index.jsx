import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

// 图片资源
import searchImg from '../images/search.png'

/**
 * 全局布局容器
 */
const LayoutWrapper = styled.div`

`

/**
 * Header组件Group
 */
const Header = styled.header`
  height: 84px;
  background-color: #24292e;
  box-sizing: border-box;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderWrapper = styled.div`
  width: 980px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Navigation = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`


const SiteTitle = styled.div`
  color: #FFFFFF;
  font-size: 26px;
  width: 250px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align:center;
  margin: 0 10px;
`

const Underline = styled.span`
  color: #9E9E9E;
`

const LinkList = styled.ul`
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
  width: 200px;
  font-weight: 400;
  border-width: 0;
  color: #fff;
  min-height: 34px;
  &:focus {
    width: 250px;
  }
  background: url(${searchImg}) 8px center no-repeat #202326;
`


/**
 * Mainbody组件Group
 */
const Mainbody = styled.div`
  min-height: 90vh;
  max-width: 980px;
  margin: 0 auto;
`


/**
 * Footer组件Group
 */
const Footer = styled.footer`
  height: 105px;
  max-width: 980px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.067);
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const SiteInfo = styled.div`
  max-width: 980px;
`
const ButtomLink = styled(Link)`
  text-decoration: underline;
  margin: 0 5px;
`

const DefaultLayout = ({ children, data }) =>
  <LayoutWrapper>
    <Header>
      <HeaderWrapper>
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
      </HeaderWrapper>
    </Header>
    <Mainbody>
      {children()}
    </Mainbody>
    <Footer>
      <SiteInfo>
        © 2016 - 2018 橡树上
      </SiteInfo>
      <SiteInfo>
        <ButtomLink>Gatsby.js </ButtomLink>
        <ButtomLink>Netlify</ButtomLink> | Inspiration from <ButtomLink>Github Blog Style</ButtomLink>
      </SiteInfo>
    </Footer>
  </LayoutWrapper>

export default DefaultLayout

export const query = graphql`
  query DefaultLayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
