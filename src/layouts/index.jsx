import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

/**
 * 全局布局容器
 */
const LayoutWrapper = styled.div`

`

/**
 * Header组件Group
 */
const Header = styled.header`
  height: 54px;
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

const SiteIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #424242;
`

const SiteTitle = styled.div`
  color: #FFFFFF;
  font-size: 20px;
  width: 300px;
  height: 30px;
  line-height: 30px;
  background-color: #424242;
  border-radius: 3px;
  text-align:center;
  margin: 0 10px;
`

const LinkList = styled.ul`
  margin: 0;
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

const UserProfile = styled.div`
  display: flex;
  align-items: center;
`
const Avatar = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 5px 0 0;
  border-radius: 3px;
  object-fit: cover;
`

const DownCaret = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  content: "";
  border: 4px solid;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  color: rgba(255,255,255,0.75);
`


/**
 * StaticContent组件Group
 */
const StaticContent = styled.div`

`

const GlobalBolgTitle = styled.p`

`

const SearchInput = styled.input`

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
  width: 100%;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgba(0, 0, 0, 0.067);
  display: flex;
  justify-content: center;
  align-items: center;
`
const SiteInfo = styled.div`
  max-width: 980px;
`

const DefaultLayout = ({ children, data }) =>
  <LayoutWrapper>
    <Header>
      <HeaderWrapper>
        {/*导航栏*/}
        <Navigation>
          <SiteIcon></SiteIcon>
          <SiteTitle>{data.site.siteMetadata.title}</SiteTitle>
          <LinkList>
            <StyledLink to='/'>Home</StyledLink>
            <StyledLink to='/'>Projects</StyledLink>
            <StyledLink to='/about'>About</StyledLink>
            <StyledLink to='/contact'>Contact</StyledLink>
          </LinkList>
        </Navigation>
        {/*用户信息*/}
        <UserProfile>
          <Avatar src="https://avatars2.githubusercontent.com/u/17882639?s=40&v=4"/>
          <DownCaret /> 
        </UserProfile>
      </HeaderWrapper>
    </Header>
    <StaticContent>
      <GlobalBolgTitle></GlobalBolgTitle>
      <SearchInput/>
    </StaticContent>
    <Mainbody>
      {children()}
    </Mainbody>
    <Footer>
      <SiteInfo>
        © 2016 - 2018 橡树上 Build with Gatsby.js, Host by Netlify | Inspiration from Github Blog Style
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
