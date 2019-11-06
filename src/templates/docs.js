import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'

import Head from 'components/Head/Head'
import TOC from 'components/TOC/TOC'

import Container from 'elements/Container/Container'
import Heading from 'elements/Heading/Heading'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

const TagTemplate = ({ data }) => (
  <Page>
    <Head title={data.doc.frontmatter.title} />
    <Container size="small" style={{ position: 'relative' }}>
      <Title>{data.doc.frontmatter.title}</Title>
      {data.doc.frontmatter.toc && <TOC toc={data.doc.tableOfContents} />}
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
        toc
      }
      tableOfContents(maxDepth: 4)
    }
  }
`
