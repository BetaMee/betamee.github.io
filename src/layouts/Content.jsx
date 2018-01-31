import React from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`

`

const ContentPortal = ({ children }) => 
  <ContentWrapper>
    {children}
  </ContentWrapper>

export default ContentPortal
