import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

import styles from './about.module.css'

const AboutPage =  ({ data }) => {
  const site = data.site
  const markdownRemark = data.markdownRemark

  return (
    <Layout
      site={site}
    >
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{__html: markdownRemark.html}}/>
      </div>
    </Layout>
  )
}

export default AboutPage

export const aboutQuery = graphql`
  query aboutPageQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { tags : { eq: "_#about" } }) {
      html
    }
  }
`
