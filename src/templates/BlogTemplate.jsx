import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import styles from './template.module.css'

export default class BlogTemplate extends React.Component {
  render() {
    const article = this.props.data.markdownRemark
    const site = this.props.data.site
    return (
      <Layout
        site={site}
      >
        <div className={styles.content} >
          <div className={styles.heading}>
            <h1 className={styles.title}>
              {article.frontmatter.title}
            </h1>
            <div className={styles.info}>
              <span>{site.siteMetadata.author}</span>
              <span>{article.frontmatter.date}</span>
            </div>
            <div className={styles.tags}>

            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.html }} />
        </div>
      </Layout>
    )
  }
}

export const blogTemplateQuery = graphql`
  query articleBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        category
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
