import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'


const LayoutWrapper = styled.div`
  margin: 0 auto;
  max-width: 650px;
  padding: 1.25rem 1rem;
`

const Hearder = styled.div`
  margin-bottom: 1.5rem;
`

const SiteTitle = styled.h3`
  display: inline;
`

const Navigation = styled.ul`
  list-style: none;
  float: right;
`

const LinkWrapper = styled.li`
  display: inline-block;
  margin-right: 1rem;
`


// 私有组件

const NaviItem = ({to, children}) => (
  <LinkWrapper>
    <Link to={to}>
      {children}
    </Link>
  </LinkWrapper>
)

const DefaultLayout = ({ children, data }) =>
  <LayoutWrapper>
    <Hearder>
      <Link to="/">
        <SiteTitle>{data.site.siteMetadata.title}</SiteTitle>
      </Link>
      <Navigation>
        <NaviItem to="/">Home</NaviItem>
        <NaviItem to="/about/">About</NaviItem>
        <NaviItem to="/contact/">Contact</NaviItem>
      </Navigation>
    </Hearder>
    {children()}
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
