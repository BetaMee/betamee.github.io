const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

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

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators

  return new Promise((resolve) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                category
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
      // 创建单个文章页面
      _edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/ArticleTemplate.jsx'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
      // 创建catgory归档页面
      // const categoryData = _edges.map(edge => edge.node.frontmatter.category)
      // Array.from(new Set(categoryData)).forEach((category) => {
      //   createPage({
      //     path: `/category/${category}`,
      //     component: path.resolve('./src/templates/CatgoryTemplate.jsx'),
      //     context: {
      //       // Data passed to context is available in page queries as GraphQL variables.
      //       category: category,
      //     },
      //   })
      // })
      // 页面重定向
      createRedirect({
        fromPath: '/content',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      createRedirect({
        fromPath: '/category',
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
      // 进入下一步
      resolve()
    })
  })
}