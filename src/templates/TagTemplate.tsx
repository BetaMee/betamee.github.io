import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import styles from "./styles/tag.module.scss";

import { ITagTemplateProps } from "../interfaces";

const TagTemplate: React.FC<ITagTemplateProps> = ({ data, pathContext }) => (
  <Layout>
    <div className={styles.content}>
      <h1 className={styles.heading}>
        Tag: #{pathContext.tag.replace(/\//g, "")}
      </h1>
      {data.allMarkdownRemark.edges.map((_edge) => {
        const _mark = _edge.node;
        return (
          <div key={_mark.frontmatter.uninqueid} className={styles.link}>
            <Link
              to={`/content/${_mark.frontmatter.category.toLowerCase()}-${_mark.frontmatter.uninqueid}`}
            >
              {_mark.frontmatter.title}
            </Link>
          </div>
        );
      })}
    </div>
  </Layout>
);

export default TagTemplate;

export const tagQuery = graphql`
  query TagPageQuery($tag: String) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { regex: $tag } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date(formatString: "YYYY")
            title
            tags
            category
            uninqueid
          }
        }
      }
    }
  }
`;
