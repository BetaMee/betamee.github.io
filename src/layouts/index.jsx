import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'


const LayoutWrapper = styled.div`
  width: 100vw;
`

const Header = styled.header`
  height: 54px;
  background-color: #24292e;
`

const Mainbody = styled.div`
  min-height: 90vh;
  max-width: 980px;
  margin: 0 auto;
`


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
      
    </Header>
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
