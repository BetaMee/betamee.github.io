import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import styles from './blog.module.css'

const BlogTemplate = ({ data }) => {
  const markdownRemark = data.markdownRemark
  const site = data.site
  return (
    <Layout
      site={site}
    >
      <div className={styles.content} >
        <div className={styles.heading}>
          <h1 className={styles.title}>
            {markdownRemark.frontmatter.title}
          </h1>
          <div className={styles.info}>
            <span>{site.siteMetadata.author}</span>
            <span>{markdownRemark.frontmatter.date}</span>
          </div>
          <div className={styles.tags}>
            {(markdownRemark.frontmatter.tags || []).split(' ').map((_tag, index) => (
              <Link key={index} to={`/tag/${_tag}`}>
                #{_tag}
              </Link>
            ))}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
      </div>
    </Layout>
  )
}

export default BlogTemplate

export const blogTemplateQuery = graphql`
  query blogBySlug($slug: String!) {
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
        tags
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
