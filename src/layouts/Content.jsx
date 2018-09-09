import React from 'react'
import styled from 'styled-components'
// 响应式media函数
import media from '../utils/mediaquery'

const ContentWrapper = styled.main`
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  padding-right: 20px;
  padding-top: 50px;
  ${media.desktop`
     width: 90%;
  `}
  ${media.tablet`
    width: 100%;
    padding-left: 20px;
  `}
  ${media.phone`
    width: 100%;
    padding-left: 20px;
  `}
`

const ContentPortal = ({ children }) => 
  <ContentWrapper>
    {children}
  </ContentWrapper>

export default ContentPortal
