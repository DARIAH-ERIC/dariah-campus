import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import DocsIndex from 'components/DocsIndex/DocsIndex'
import Head from 'components/Head/Head'

import Page from 'elements/Page/Page'
// import Title from 'elements/Title/Title'

const About = ({ data }) => (
  <Page>
    <Head title="About" />
    {/* <Title>About DARIAH Campus</Title> */}
    <MDXRenderer>{data.index.body}</MDXRenderer>
    <DocsIndex docs={data.docs.nodes} />
  </Page>
)

export default About

export const quey = graphql`
  query {
    index: mdx(
      fileInfo: { sourceInstanceName: { eq: "docs" }, name: { eq: "index" } }
    ) {
      body
    }
    docs: allMdx(
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
        }
        tableOfContents(maxDepth: 4)
      }
    }
  }
`
