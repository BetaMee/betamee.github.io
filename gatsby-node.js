const path = require('path')
// const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions, graphql }) => {
	const { createNodeField } = actions
	if (node.internal.type === 'MarkdownRemark') {
		// const slug = createFilePath({
		//   node,
		//   getNode,
		// })

		// createNodeField({
		//   node,
		//   name: 'slug',
		//   value: `/content${slug}`,
		// })
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
								uninqueid
								category
							}
						}
					}
				}
			}
		`).then(({ data }) => {
			const _allMarkdownRemark = data.allMarkdownRemark;
			const _edges = _allMarkdownRemark.edges
			const _totalCount = _allMarkdownRemark.totalCount

			// 创建分页
			const blogsPerPage = 10
			const numPages = Math.ceil(_totalCount / blogsPerPage)

			Array.from({ length: numPages }).forEach((_, i) => {
				createPage({
					path: i === 0 ? '/' : `/page/${i + 1}`,
					component: path.resolve('./src/templates/BlogList.tsx'),
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
				const frontmatter = node.frontmatter
				const slug = `${frontmatter.category.toLowerCase()}-${frontmatter.uninqueid}`;
				if (node.frontmatter.uninqueid) {
					createPage({
						path: `/content/${slug}`,
						component: path.resolve('./src/templates/BlogTemplate.tsx'),
						context: {
							// 传递到组件中变量
							uninqueid: frontmatter.uninqueid
						}
					})
				}
			})
			// 创建 tag 页面
			const tagsData = _edges.map(({ node }) => (node.frontmatter.tags || [])
				.split(' '))
				.reduce((_total, _tagsItem) => {
					return _total.concat(_tagsItem)
				}, [])
			Array.from(new Set(tagsData)).forEach(tag => {
				createPage({
					path: `/tag/${tag}`,
					component: path.resolve('./src/templates/TagTemplate.tsx'),
					context: {
						tag: `/${tag}/` // 提供正则表达式的字符串
					}
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
