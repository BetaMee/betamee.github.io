import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout/index'
// import  './404.module.scss'

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      ReferenceError: 404 is Not Found!
    </Layout>
  )
}

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
