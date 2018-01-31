import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'


// 响应式media函数
import media from '../utils/mediaquery'

/**
 * Footer组件Group
 */
const FooterWrapper = styled.footer`
  box-sizing: border-box;
  height: 105px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.067);
  display: flex;
  justify-content: center;
  align-items: center;
`
const Footer = styled.div`
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

const SiteInfo = styled.div`
  max-width: 980px;
`
const ButtomLink = styled(Link)`
  text-decoration: underline;
  margin: 0 5px;
`

const FooterPortal = () =>
  <FooterWrapper>
    <Footer>
      <SiteInfo>
        © 2016 - 2018 橡树上
      </SiteInfo>
      <SiteInfo>
        <ButtomLink>Gatsby.js </ButtomLink>
        <ButtomLink>Netlify</ButtomLink> | Inspiration from <ButtomLink>Github Blog Style</ButtomLink>
      </SiteInfo>
    </Footer>
  </FooterWrapper>

export default FooterPortal
