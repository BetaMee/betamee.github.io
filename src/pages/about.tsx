import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

import styles from './about.module.scss'

interface IProps {
  data: {
    markdownRemark: {
      html: string
    }
  }
}

const AboutPage: React.FC<IProps> =  ({ data }) => {
  return (
    <Layout>
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{__html: data.markdownRemark.html}}/>
      </div>
    </Layout>
  )
}

export default AboutPage

export const aboutQuery = graphql`
  query aboutPageQuery {
    markdownRemark(frontmatter: { tags : { eq: "_about" } }) {
      html
    }
  }
`
