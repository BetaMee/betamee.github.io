import React from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  width: 70%;
`

const ContentPortal = ({ children }) => 
  <ContentWrapper>
    {children}
  </ContentWrapper>

export default ContentPortal
