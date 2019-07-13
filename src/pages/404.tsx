import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout/index'
import styles from './404.module.scss'

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <span>ReferenceError: 404 is Not Found!</span>
      </div>
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
