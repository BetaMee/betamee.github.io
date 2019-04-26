import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import styles from './tag.module.css'

export default class TagTemplate extends React.Component {
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
              {(article.frontmatter.tags || []).split(' ').map((_tag, index) => (
                <Link key={index} to={'/'}>
                  #{_tag}
                </Link>
              ))}
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.html }} />
        </div>
      </Layout>
    )
  }
}

export const tagQuery = graphql`
  query articleByTag($slug: String!) {
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
