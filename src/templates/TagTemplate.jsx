import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import styles from './tag.module.css'

export default class TagTemplate extends React.Component {
  render() {
    const allMarkdownRemark = this.props.data.allMarkdownRemark
    const site = this.props.data.site
    const pathContext = this.props.pageContext

    return (
      <Layout
        site={site}
      >
        <div className={styles.content} >
          <h1 className={styles.heading}>
            Tag: #{(pathContext.tag || '').replace(/\//g, '')}
          </h1>
          {allMarkdownRemark.edges.map(_edge => {
            const _mark = _edge.node
            return (
              <div
                key={_mark.fields.slug}
                className={styles.link}
              >
                <Link to={_mark.fields.slug}>
                  {_mark.frontmatter.title}
                </Link>
              </div>)
          })}
        </div>
      </Layout>
    )
  }
}

export const tagQuery = graphql`
  query TagPageQuery($tag: String) {
    site {
      siteMetadata {
        author
        title
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {
          tags: {
            regex: $tag
          }
        }
      }
      sort: {
        fields: [frontmatter___date],
        order: DESC
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
