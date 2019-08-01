export interface IEdge {
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


export interface IBlogLIstProps {
  data: {
    allMarkdownRemark: {
      edges: Array<IEdge>
    }
  },
  pageContext: {
    currentPage: number,
    numPages: number
  }
}

export interface IBlogTemplateProps {
  data: {
    site: {
      siteMetadata: {
        author: string,
        title: string
      }
    },
    markdownRemark: {
      id: string,
      html: string,
      fields: {
        slug: string
      },
      frontmatter: {
        title: string,
        category: string,
        tags: string,
        date: string
      }
    }
  }
}

export interface ITagTemplateProps {
  data: {
    allMarkdownRemark: {
      edges: Array<IEdge>
    }
  },
  pathContext: {
    tag: string
  }
}

export interface IAboutPageProps {
  data: {
    markdownRemark: {
      html: string
    }
  }
}
