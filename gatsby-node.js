const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({
      node,
      getNode,
    })

    createNodeField({
      node,
      name: 'slug',
      value: `/content${slug}`,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  return new Promise((resolve) => {
    graphql(`
      {
        allMarkdownRemark {
          totalCount
          edges {
            node {
              frontmatter {
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      const _edges = result.data.allMarkdownRemark.edges
      const _totalCount = result.data.allMarkdownRemark.totalCount

      // 创建分页
      const blogsPerPage = 10
      const numPages = Math.ceil(_totalCount / blogsPerPage)

      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? '/' : `/page/${i + 1}`,
          component: path.resolve('./src/templates/BlogList.jsx'),
          context: {
            limit: blogsPerPage,
            skip: i * blogsPerPage,
            numPages,
            currentPage: i + 1
          }
        })
      })
      // 创建单个文章页面
      _edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/BlogTemplate.jsx'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
      // 创建 tag 页面
      const tagsData = _edges.map(edge => (edge.node.frontmatter.tags || []).split(' '))
        .reduce((_total, _tagsItem) => {
          return _total.concat(_tagsItem)
        }, [])
      Array.from(new Set(tagsData)).forEach((tag) => {
        createPage({
          path: `/tag/${tag}`,
          component: path.resolve('./src/templates/TagTemplate.jsx'),
          context: {
            tag: `/${tag}/` // 提供正则表达式的字符串
          },
        })
      })
      // 页面重定向
      createRedirect({
        fromPath: '/content',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      createRedirect({
        fromPath: '/tag',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      createRedirect({
        fromPath: '/page/1',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      createRedirect({
        fromPath: '/page',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      // 进入下一步
      resolve()
    })
  })
}
