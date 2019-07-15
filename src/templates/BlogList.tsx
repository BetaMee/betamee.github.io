import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'

import styles from './styles/list.module.scss'
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
  pageContext: {
    currentPage: number,
    numPages: number
  }
}

interface PaginationNode  {
  _key: string,
  _index: number,
  _selected: boolean,
  _isDot: boolean
}

const BlogList: React.FC<IProps> = ({ data, pageContext }) => {
  // 数据源
  const _edges = data.allMarkdownRemark.edges
  const {
    currentPage,
    numPages
  } = pageContext
  // 取日期
  const YearDateArr = _edges.map(edge => edge.node.frontmatter.date.split('-')[0])
  const uniqueDateArr = Array.from(new Set(YearDateArr))
  const displayEdges = uniqueDateArr.map(_year => ({
    _year: _year,
    _edges: _edges.filter(edge => edge.node.frontmatter.date.split('-')[0] === _year)
  }))
  // 分页标志符
  let _paginationNode: Array<PaginationNode> = []
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
  // 当前时间
  const currentTime = new Date().getTime()
  return (
    <Layout>
      <div className={styles.main}>
        <div className={styles.catalog}>
          {displayEdges.map(item => (
            <div key={item._year} className={styles.item}>
              <div className={styles.year}>{item._year}</div>
              <div
                className={styles.link}
              >{item._edges.map(({ node }) => {
                // 解析 M/D 格式
                const _dateArr = node.frontmatter.date.split('-')
                const _MonthDay = `${_dateArr[1]}/${_dateArr[2]}`
                // 解析是否是最新文章
                const pageTime = new Date(node.frontmatter.date).getTime()
                let isNewPage = false
                if (pageTime < currentTime && pageTime > (currentTime - 1000 * 60 * 60 * 24 * 30)) { // 30 天以内
                  isNewPage = true
                }
                return (
                  <div key={node.id}>
                    <Link
                      to={node.fields.slug}
                    >
                      <span className={styles.date}>{_MonthDay}</span>
                      {node.frontmatter.title}
                    </Link>
                    {
                      isNewPage && <span className={styles.newcontent}>new</span>
                    }
                  </div>
                )
              })}
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
                      to={`${item._index === 1 ? '/' : `/page/${item._index}`}`}
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

export default BlogList

export const BlogListQuery = graphql`
  query BlogListQuery($skip: Int!, $limit: Int!) {
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
            date(formatString: "YYYY-MM-DD")
            title
          }
        }
	    }
    }
  }
`

