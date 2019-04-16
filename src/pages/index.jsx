import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'

import styles from './index.module.css'

const IndexPage = ({ data }) => {
  // 数据源
  const _edges = data.allMarkdownRemark.edges
  // query 参数
  const queryRegx = new RegExp('[\\?&]page=([^&#]*)')
  const queryResult = queryRegx.exec(location.search)
  let pageIndex = 1
  if (queryResult && !isNaN(queryResult[1])) {
    pageIndex = queryResult[1]
  } else {
    pageIndex = 1
  }
  // 过滤要展示的数据，以 10 为分页项数
  const _filterdEdges = (_edges || []).filter((edge, index) => (index < pageIndex * 10 && index >= (pageIndex - 1) * 10))
  // 取日期
  const dateArr = _filterdEdges.map(edge => edge.node.frontmatter.date)
  const uniqueDateArr = Array.from(new Set(dateArr))
  const displayEdges = uniqueDateArr.map(_date => ({
    _date: _date,
    _edges: _filterdEdges.filter(edge => edge.node.frontmatter.date === _date)
  }))
  return (
    <Layout
      site={data.site}
    >
      <div className={styles.main}>
        <div className={styles.date}>

        </div>
        <div className={styles.catalog}>
          {displayEdges.map(item => (
            <div key={item._date}>
              <div>{item._date}</div>
              <div>{item._edges.map((edge => (
                <Link
                  key={edge.node.fields.slug}
                  to={edge.node.fields.slug}
                >
                  {edge.node.frontmatter.title}
                </Link>
              )))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>

        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        author
        title
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY")
            title
          }
        }
	    }
    }
  }
`
