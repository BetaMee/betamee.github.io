import React from 'react'
import styled from 'styled-components'

const IndexWrapper = styled.div`

`

const IndexPage = ({ data }) => (
  <IndexWrapper>
    <h1>{data.site.siteMetadata.title}</h1>
    <h2>hhhh</h2>
  </IndexWrapper>
)

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
