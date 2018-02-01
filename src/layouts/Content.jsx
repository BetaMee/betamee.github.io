import React from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  width: 70%;
  box-sizing: border-box;
  padding-right: 20px;
  padding-top: 50px;
`

const ContentPortal = ({ children }) => 
  <ContentWrapper>
    {children}
  </ContentWrapper>

export default ContentPortal
