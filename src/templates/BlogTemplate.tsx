import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import ImageViewer from '../components/imageviewer'
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
  // 页面数据
  const markdownRemark = data.markdownRemark
  const siteMetadata = data.site.siteMetadata
  // hooks
  const [isOpenImageView, changeViewerState] = useState<boolean>(false)
  const [ imageUrl, changeImageUrlState ] = useState<string>('')
  const [ description, changeDescriptionState ] = useState<string>('')
  
  useEffect(() => {
    const $imageNodes: NodeList = document.querySelectorAll('.gatsby-resp-image-image')
    // !TS + DOM 怎么写？？？
    $imageNodes.forEach((node: Node) => {
      node.addEventListener('click', (evt: Event) => {
        evt.preventDefault()
        const $target: any = evt.target
        const $imageUrl: string = $target.src
        const $description: string = $target.alt
        changeViewerState(!isOpenImageView)
        changeImageUrlState($imageUrl)
        changeDescriptionState($description)
        // 返回清空函数
        return () => {
          $imageNodes.forEach((node: Node) => {
            node.removeEventListener('click', ()=> {})
          })
        }
      },false)
    })
  }, [])
  // 关闭预览窗口
  const closeViewer = () => {
    changeViewerState(false)
    changeImageUrlState('')
    changeDescriptionState('')
  }
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
      {
        isOpenImageView && (
          <ImageViewer
            imageUrl={imageUrl}
            description={description}
            closeViewer={closeViewer}
          />
        )
      }
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
