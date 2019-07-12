import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import styles from './styles/blog.module.scss'

interface IProps {
  data: {
    site: {
      siteMetadata: {
        author: string
        title: string
      }
    },
    markdownRemark: {
      id: string
      html: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        category: string,
        tags: string
        date: string
      }
    }
  }
}

const BlogTemplate: React.FC<IProps> = ({ data }) => {
  const markdownRemark = data.markdownRemark
  const siteMetadata = data.site.siteMetadata
  return (
    <Layout>
      <div className={styles.content} >
        <div className={styles.heading}>
          <h1 className={styles.title}>
            {markdownRemark.frontmatter.title}
          </h1>
          <div className={styles.info}>
            <span>{siteMetadata.author}</span>
            <span>{markdownRemark.frontmatter.date}</span>
          </div>
          <div className={styles.tags}>
            {markdownRemark.frontmatter.tags.split(' ').map((_tag, index) => (
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
        author
        title
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
