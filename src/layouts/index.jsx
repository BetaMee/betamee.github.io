import React from 'react'
import styled from 'styled-components'


import HeaderPortal from './Header'
import FooterPortal from './Footer'
import ContentPortal from './Content'
import SideBarPortal from './SideBar'

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


const DefaultLayout = ({ children }) =>
  <LayoutWrapper>
    {/*Header*/}
    <HeaderPortal />
    <Mainbody>
      {/*正文内容*/}
      <ContentPortal>
        {children()}
      </ContentPortal>
      {/*侧边栏*/}
      <SideBarPortal />
    </Mainbody>
    {/*Footer*/}
    <FooterPortal />
  </LayoutWrapper>

export default DefaultLayout
