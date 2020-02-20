import React from 'react'
import { graphql } from 'gatsby'

import Docs from 'components/Docs/Docs'
import Head from 'components/Head/Head'
import Link from 'components/Link/Link'
import TOC, { TOCContainer, createTocItems } from 'components/TOC/TOC'

import Container from 'elements/Container/Container'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

const styles = {
  docsHeader: {
    margin: '2rem 0 1rem',
  },
  activeLink: {
    color: 'var(--color-primary)',
    pointerEvents: 'none',
    cursor: 'default',
  },
}

const TagTemplate = ({ data }) => (
  <Page>
    <Head title={data.doc.frontmatter.title} />
    <Container size="small" style={{ flex: 1, marginBottom: '60px' }}>
      <Title>{data.doc.frontmatter.title}</Title>
      <article style={{ position: 'relative' }}>
        <TOCContainer left title="Documentation Overview">
          <div>
            <Link activeStyle={styles.activeLink} to="/about">
              <div style={styles.docsHeader}>What is DARIAH-Campus?</div>
            </Link>
          </div>
          {data.tocs.nodes
            .filter(node => node.frontmatter.toc)
            .map(node => {
              const prefix = `/docs/${node.frontmatter.slug}`
              return (
                <div key={prefix}>
                  <Link activeStyle={styles.activeLink} to={prefix}>
                    <div style={styles.docsHeader}>
                      {node.frontmatter.title}
                    </div>
                  </Link>
                  {createTocItems(node.tableOfContents.items || [], 0, prefix)}
                </div>
              )
            })}
        </TOCContainer>
        <TOC toc={data.doc.tableOfContents} />
        <Docs docs={data.doc.body} />
      </article>
    </Container>
  </Page>
)

export default TagTemplate

export const query = graphql`
  query($id: String!) {
    doc: mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
      }
      id
      tableOfContents(maxDepth: 3)
    }
    tocs: allMdx(
      filter: {
        fileInfo: {
          sourceInstanceName: { eq: "docs" }
          name: { nin: ["index", "Sample-resource"] }
        }
      }
      sort: { fields: [frontmatter___number], order: [ASC] }
    ) {
      nodes {
        frontmatter {
          slug
          title
          toc
        }
        id
        tableOfContents(maxDepth: 1) # TODO: should use title?
      }
    }
  }
`
