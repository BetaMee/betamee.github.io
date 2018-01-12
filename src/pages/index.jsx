import React from 'react'

export default ({ data }) => (
  <div>
    <h1>{data.site.siteMetadata.title}</h1>
    <div>
      <img
        src="https://2.bp.blogspot.com/-BMP2l6Hwvp4/TiAxeGx4CTI/AAAAAAAAD_M/XlC_mY3SoEw/s1600/panda-group-eating-bamboo.jpg"
        alt="Group of pandas eating bamboo"
      />
    </div>
  </div>
)


export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
