import React from 'react'
import { graphql } from 'gatsby'

import Head from 'components/Head/Head'
// import Image from 'components/Image/Image'
import Masonry from 'components/Masonry/Masonry'
import Pagination from 'components/Pagination/Pagination'
import PostPreview from 'components/PostPreview/PostPreview'

import LeadIn from 'elements/LeadIn/LeadIn'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

const AuthorTemplate = ({ data }) => (
  <Page>
    <Head title={`Posts by ${data.author.name}`} />
    <Title>Author: {data.author.name}</Title>
    <LeadIn>{data.author.description}</LeadIn>
    {/* {data.author.avatar && (
      <Image fluid={data.author.avatar.image.fluid} style={{ width: 200 }} />
    )} */}
    <Masonry>
      {data.posts.nodes.map((post, i, posts) => (
        <PostPreview
          key={post.id}
          {...post}
          previous={posts[i - 1]}
          next={posts[i + 1]}
        />
      ))}
    </Masonry>
    <Pagination
      path="author"
      slug={data.author.slug}
      {...data.posts.pageInfo}
    />
  </Page>
)

export default AuthorTemplate

export const query = graphql`
  query($slug: String!, $skip: Int!, $limit: Int!) {
    posts: allMdx(
      limit: $limit
      filter: {
        fileInfo: {
          sourceInstanceName: { in: ["posts", "events"] }
          name: { eq: "index" }
        }
        frontmatter: { authors: { elemMatch: { slug: { eq: $slug } } } }
      }
      skip: $skip
      sort: {
        fields: [frontmatter___isoDate, frontmatter___title]
        order: [DESC, ASC]
      }
    ) {
      nodes {
        excerpt
        frontmatter {
          abstract
          authors {
            name
            slug
            avatar {
              image: childImageSharp {
                fixed(width: 36, height: 36, quality: 90) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
          date
          isoDate
          slug
          title
          type {
            icon
          }
        }
        id
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
    }
    author: person(slug: { eq: $slug }) {
      avatar {
        image: childImageSharp {
          fluid(maxWidth: 200) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      description
      name
      slug
    }
  }
`
