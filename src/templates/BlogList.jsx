import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'

import styles from './styles/list.module.css'

const IndexPage = ({ data, pageContext }) => {
  // 数据源
  const _edges = data.allMarkdownRemark.edges

  const {
    currentPage,
    numPages
  } = pageContext
  // 取日期
  const dateArr = _edges.map(edge => edge.node.frontmatter.date)
  const uniqueDateArr = Array.from(new Set(dateArr))
  const displayEdges = uniqueDateArr.map(_date => ({
    _date: _date,
    _edges: _edges.filter(edge => edge.node.frontmatter.date === _date)
  }))
  // 分页标志符

  let _paginationNode = [] 
  if (numPages <= 6) {
    _paginationNode = Array.from({length: numPages}, ((item, i) => ({
      _key: `${i} + ${numPages}`,
      _index: i + 1,
      _selected: (i + 1) === currentPage,
      _isDot: false
    })))
  } else {

    if (1 <= currentPage && currentPage <= 3) {
      _paginationNode = Array.from({length: 6}, ((item, i) => {
        if (i <= 3) {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: (i + 1) === currentPage,
            _isDot: false
          }
        } else if (i === 5) {
          return {
            _key: `${i} + ${numPages}`,
            _index: numPages,
            _selected: false,
            _isDot: false
          }
        } else {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: false,
            _isDot: true
          }
        }
      }))
    } else if (numPages - 2 <= currentPage && currentPage <= numPages) {
      _paginationNode = Array.from({length: 6}, ((item, i) => {
        if (2 <= i && i <= 5) {
          return {
            _key: `${i} + ${numPages}`,
            _index: numPages - (5 - i),
            _selected: (5 - i) === (numPages - currentPage),
            _isDot: false
          }
        } else if (i === 0) {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: false,
            _isDot: false
          }
        } else {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: false,
            _isDot: true
          }
        }
      }))
    } else {
      _paginationNode = Array.from({length: 7}, ((item, i) => {
        if (i === 0) {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: false,
            _isDot: false
          }
        } else if (i === 6) {
          return {
            _key: `${i} + ${numPages}`,
            _index: numPages,
            _selected: false,
            _isDot: false
          }
        } else if (i === 1 || i === 5) {
          return {
            _key: `${i} + ${numPages}`,
            _index: i + 1,
            _selected: false,
            _isDot: true
          }
        } else {
          return {
            _key: `${i} + ${numPages}`,
            _index: currentPage + (i - 3),
            _selected: i === 3,
            _isDot: false
          }
        }
      }))
    }
  }

  return (
    <Layout
      site={data.site}
    >
      <div className={styles.main}>
        <div className={styles.catalog}>
          {displayEdges.map(item => (
            <div key={item._date} className={styles.catalogItem}>
              <div className={styles.catalogDate}>{item._date}</div>
              <div
                className={styles.catalogLink}
              >{item._edges.map(({ node }) => (
                  <div key={node.id}>
                    <Link
                      to={node.fields.slug}
                    >
                      {node.frontmatter.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {_paginationNode.length !== 0 && (
          <div className={styles.pagination}>
            {_paginationNode.map(item => {
              if (item._isDot) {
                return (
                  <span
                    key={item._key}
                    className={
                      `${styles.paginationItem}`
                    }
                  >
                    ...
                  </span>
                )
              } else {
                return (
                  <Link
                    key={item._key}
                    to={`/page/${item._index}`}
                    className={
                      `${styles.paginationItem} ${item._selected ? styles.itemSelected : ''}`
                    }
                  >
                    {item._index}
                  </Link>
                )
              }
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage

export const BlogListQuery = graphql`
  query BlogListQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        author
        title
      }
    }
    allMarkdownRemark(
      sort: {
        fields: [frontmatter___date],
        order: DESC
      },
      filter: {
        frontmatter: {
          tags: {
            ne: "_about"
          }
        }
      },
      limit: $limit,
      skip: $skip
    ) {
      edges {
        node {
          id
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

