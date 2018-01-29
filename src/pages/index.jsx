import React from 'react'
import styled from 'styled-components'

const IndexWrapper = styled.div`

`

const IndexPage = ({ data }) => (
  <IndexWrapper>
    <h1>{data.site.siteMetadata.title}</h1>
    <h2>hhhh</h2>
    <p>你好，这是测试句</p>
    <p>Hello this is test</p>
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
