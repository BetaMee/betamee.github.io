import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout/index'
import './404.module.css'

const NotFoundPage = ({ data }) => (
  <Layout
    site={data.site}
  >
    ReferenceError: 404 is Not Found!
  </Layout>
)

export default NotFoundPage

export const NotFoundQuery = graphql`
  query NotFoundQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
` 
