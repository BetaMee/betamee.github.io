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
    pageIndex = parseInt(queryResult[1])
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
  // 分页
  // 总的页数
  const _paginationLength = Math.ceil(_edges.length / 10)
  let _paginationNode = []
  if (_paginationLength <= 5) {
    _paginationNode = Array(_paginationLength).fill(0).map((item, i) => ({
      _index: i + 1,
      _selected: (i + 1) === pageIndex
    }))
  } else if (_paginationLength === 6) {
    if (pageIndex  < 4) {
      _paginationNode = Array(4).fill(0).map((item, i) => ({
        _index: i + 1,
        _selected: (i + 1) === pageIndex,
        _isDot: false
      }))
      _paginationNode
        .push({
          _index: 5,
          _selected: false,
          _isDot: true
        })
      _paginationNode
        .push({
          _index: 6,
          _selected: false,
          _isDot: false
        })
    } else {
      _paginationNode = Array(4).fill(0).map((item, i) => ({
        _index: i + 1 + 2,
        _selected: (i + 1 + 2) === pageIndex,
        _isDot: false
      }))
      _paginationNode
        .unshift({
          _index: 2,
          _selected: false,
          _isDot: true
        })
      _paginationNode
        .unshift({
          _index: 1,
          _selected: false,
          _isDot: false
        })
    }
  } else {
    if (pageIndex > 3 && pageIndex < _paginationLength - 2) {
      // TODO
    } else if (1 <= pageIndex && pageIndex << 3) {
      _paginationNode = Array(4).fill(0).map((item, i) => ({
        _index: i + 1,
        _selected: (i + 1) === pageIndex,
        _isDot: false
      }))
      
      _paginationNode
        .push({
          _index: 5,
          _selected: false,
          _isDot: true
        })
      _paginationNode
        .push({
          _index: _paginationLength + 1,
          _selected: false,
          _isDot: false
        })
    } else {
      _paginationNode = Array(4).fill(0).map((item, i) => ({
        _index: i + _paginationLength - 2,
        _selected: (i + _paginationLength - 2) === pageIndex,
        _isDot: false
      }))
      _paginationNode
        .unshift({
          _index: 2,
          _selected: false,
          _isDot: true
        })
      _paginationNode
        .unshift({
          _index: 1,
          _selected: false,
          _isDot: false
        })
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
              >{item._edges.map((edge => (
                  <div key={edge.node.fields.slug}>
                    <Link
                      to={edge.node.fields.slug}
                    >
                      {edge.node.frontmatter.title}
                    </Link>
                  </div>
                )))}
              </div>
            </div>
          ))}
        </div>
        {displayEdges.length !== 0 && (
          <div className={styles.pagination}>
            {_paginationNode.map(item => {
              if (item._isDot) {
                return (
                  <span
                    key={item._index}
                    className={
                      `${styles.paginationItem}`
                    }
                  >
                    ...
                  </span>
                )
              } else {
                return (
                  <span
                    key={item._index}
                    className={
                      `${styles.paginationItem} ${item._selected ? styles.itemSelected : ''}`
                    }
                  >
                    {item._index}
                  </span>
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

export const query = graphql`
  query IndexPageQuery {
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
            ne: "_#about"
          }
        }
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
          }
        }
	    }
    }
  }
`
