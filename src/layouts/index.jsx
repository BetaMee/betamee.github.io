import React from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'

import HeaderPortal from './Header'
import FooterPortal from './Footer'
import ContentPortal from './Content'
import SideBarPortal from './SideBar'

import favicon from '../assets/images/favicon.ico'

import '../assets/icomoon/iconmoon.css'
import '../assets/style.css'
import 'prismjs/themes/prism-okaidia.css'

// 响应式media函数
import media from '../utils/mediaquery'

/**
 * 全局布局容器
 */
const LayoutWrapper = styled.div`
  box-sizing: border-box;
`

/**
 * Mainbody组件Group
 */
const Mainbody = styled.div`
  box-sizing: border-box;
  min-height: 90vh;
  margin: 0 auto;
  width: 64.5%;
  display: flex;
  ${media.desktop`
    width: 64.5%;
  `}
  ${media.tablet`
    width: 100%;
  `}
  ${media.phone`
    width: 100%;
  `}
`

const DefaultLayout = ({ children, data, location  }) =>
  <LayoutWrapper>
    {/* Helmet */}
    <Helmet>
      <title>{data.site.siteMetadata.siteTitle}</title>
      <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
    </Helmet>
    {/*Header*/}
    <HeaderPortal />
    <Mainbody>
      {/*正文内容*/}
      <ContentPortal>
        {children()}
      </ContentPortal>
      {/*侧边栏*/}
      <SideBarPortal
        sortedMKData={data.sortedMKData}
        categoryMKData={data.categoryMKData}
        location={location}
      />
    </Mainbody>
    {/*Footer*/}
    <FooterPortal />
  </LayoutWrapper>

export default DefaultLayout

export const layoutQuery = graphql`
  query layoutDataQuery {
    site {
      siteMetadata {
        siteTitle
      }
    }
    sortedMKData: allMarkdownRemark (sort: {fields: [frontmatter___date], order: DESC}, limit: 3 ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
    categoryMKData: allMarkdownRemark (sort: {fields: [frontmatter___date], order: DESC}){
      edges {
        node {
          frontmatter {
            category
          }
        }
      }
    }
  }
`
