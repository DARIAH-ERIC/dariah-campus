import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'

import Head from 'components/Head/Head'
import Link from 'components/Link/Link'
import { TOCContainer, createTocItems } from 'components/TOC/TOC'

import Container from 'elements/Container/Container'
import Heading from 'elements/Heading/Heading'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

const styles = {
  docsHeader: {
    fontWeight: 700,
    margin: '2rem 0 1rem',
  },
}

const TagTemplate = ({ data }) => (
  <Page>
    <Head title={data.doc.frontmatter.title} />
    <Container
      size="small"
      style={{ position: 'relative', flex: 1, marginBottom: '60px' }}
    >
      <Title>{data.doc.frontmatter.title}</Title>
      <TOCContainer>
        <div>
          <Link to="/about">
            <div style={styles.docsHeader}>What is DARIAH-Campus?</div>
          </Link>
        </div>
        {data.tocs.nodes.map(node => {
          const prefix = `/docs/${node.frontmatter.slug}`
          return (
            <div key={prefix}>
              <Link to={prefix}>
                <div style={styles.docsHeader}>{node.frontmatter.title}</div>
              </Link>
              {createTocItems(node.tableOfContents.items || [], 0, prefix)}
            </div>
          )
        })}
      </TOCContainer>
      <article>
        <MDXProvider
          components={{
            h1: () => null,
            h2: props => (
              <Heading
                level="1"
                style={{
                  marginBottom: 'var(--margin-large)',
                  marginTop: 'var(--margin-huge)',
                }}
                {...props}
              />
            ),
          }}
        >
          <MDXRenderer>{data.doc.body}</MDXRenderer>
        </MDXProvider>
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
        tableOfContents(maxDepth: 3)
      }
    }
  }
`
