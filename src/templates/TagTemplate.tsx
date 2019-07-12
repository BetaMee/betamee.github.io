import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import styles from './styles/tag.module.scss'

interface Edge {
  node: {
    id: string,
    fields: {
      slug: string
    },
    frontmatter: {
      date: string,
      title: string
    }
  }
}

interface IProps {
  data: {
    allMarkdownRemark: {
      edges: Array<Edge>
    }
  },
  pathContext: {
    tag: string
  }
}


const TagTemplate: React.FC<IProps> = ({ data, pathContext }) => (
  <Layout>
      <div className={styles.content} >
        <h1 className={styles.heading}>
          Tag: #{pathContext.tag.replace(/\//g, '')}
        </h1>
        {data.allMarkdownRemark.edges.map(_edge => {
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

export default TagTemplate

export const tagQuery = graphql`
  query TagPageQuery($tag: String) {
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
