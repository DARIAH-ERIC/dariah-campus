import React from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'

import AdditionalMetadata from 'components/AdditionalMetadata/AdditionalMetadata'
import Head from 'components/Head/Head'
import { PostLink } from 'components/Link/Link'
import PostMetadata from 'components/PostMetadata/PostMetadata'
// import PreviousNextPosts from 'components/PreviousNextPosts/PreviousNextPosts'
import RelatedPosts from 'components/RelatedPosts/RelatedPosts'
import ShareButtons from 'components/ShareButtons/ShareButtons'
import TOC from 'components/TOC/TOC'
import VideoCard from 'components/VideoCard/VideoCard'

import Container from 'elements/Container/Container'
import Heading from 'elements/Heading/Heading'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

import components from 'components'

const PostTemplate = ({ data }) => (
  <Page>
    <Head article={data.post.frontmatter} type="article" />
    <Container size="small" style={{ flex: 1, marginBottom: '60px' }}>
      <Title>{data.post.frontmatter.title}</Title>
      <PostMetadata metadata={data.post.frontmatter} />
      {data.post.frontmatter.featuredImage && (
        <Image fluid={data.post.frontmatter.featuredImage.image.fluid} />
      )}
      <article style={{ position: 'relative' }}>
        {data.post.frontmatter.toc && <TOC toc={data.post.tableOfContents} />}
        <MDXProvider
          components={{
            ...components,
            a: props => <PostLink {...props} />,
            h1: () => null,
            h2: ({ style, ...props }) => (
              <Heading
                level="1"
                style={{
                  ...style,
                  marginBottom: 'var(--margin-large)',
                  marginTop: 'var(--margin-huge)',
                }}
                {...props}
              />
            ),
            h3: ({ style, ...props }) => (
              <Heading
                level="2"
                style={{
                  ...style,
                  marginTop: 'var(--margin-large)',
                }}
                {...props}
              />
            ),
            VideoCard: props => (
              <VideoCard {...props} images={data.images.nodes} />
            ),
          }}
        >
          <MDXRenderer>{data.post.body}</MDXRenderer>
        </MDXProvider>
      </article>
      <AdditionalMetadata metadata={data.post.frontmatter} />
      <ShareButtons metadata={data.post.frontmatter} />
      {/* <PreviousNextPosts /> */}
      <RelatedPosts
        byCategory={data.postsRelatedByCategory.nodes}
        byTag={data.postsRelatedByTag.nodes}
      />
    </Container>
  </Page>
)

export default PostTemplate

export const query = graphql`
  query(
    $categories: [String!]!
    $id: String!
    $imageFolder: String!
    $tags: [String!]!
  ) {
    post: mdx(id: { eq: $id }) {
      body
      frontmatter {
        authors {
          avatar {
            image: childImageSharp {
              fixed(width: 36, height: 36, quality: 90) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
          id
          name
          slug
        }
        categories {
          name
          slug
        }
        contributors {
          name
          slug
        }
        date
        dateModified
        domain
        editors {
          name
          slug
        }
        featuredImage {
          image: childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        isoDate
        lang
        license {
          name
          url
        }
        tags {
          name
          slug
        }
        targetGroup
        title
        toc
        type {
          icon
          name
        }
        version
      }
      id
      tableOfContents(maxDepth: 4)
    }
    images: allFile(filter: { relativeDirectory: { eq: $imageFolder } }) {
      nodes {
        base
        image: childImageSharp {
          fluid(maxWidth: 800) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
    postsRelatedByCategory: allMdx(
      filter: {
        id: { ne: $id }
        fileInfo: { sourceInstanceName: { eq: "posts" } }
        frontmatter: {
          categories: { elemMatch: { slug: { in: $categories } } }
        }
      }
      limit: 5
    ) {
      nodes {
        frontmatter {
          slug
          title
        }
        id
      }
    }
    postsRelatedByTag: allMdx(
      filter: {
        id: { ne: $id }
        fileInfo: { sourceInstanceName: { eq: "posts" } }
        frontmatter: { tags: { elemMatch: { slug: { in: $tags } } } }
      }
      limit: 5
    ) {
      nodes {
        frontmatter {
          slug
          title
        }
        id
      }
    }
  }
`
