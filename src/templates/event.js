import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Head from 'components/Head/Head'
import Event from 'components/Event/Event'

const EventTemplate = ({ data }) => (
  <>
    <Head title={data.index.frontmatter.title} />
    <Helmet>
      <script async defer src="https://hypothes.is/embed.js" />
    </Helmet>

    <Event {...data} />
  </>
)

export default EventTemplate

export const query = graphql`
  query(
    $docsFolder: String!
    # $imageFolder: String!
    $indexId: String!
    $aboutId: String!
    $prepId: String!
    $sessionIds: [String!]!
  ) {
    index: mdx(id: { eq: $indexId }) {
      body
      frontmatter {
        abstract
        date
        featuredImage {
          image: childImageSharp {
            fluid(maxWidth: 1200, quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        license {
          name
        }
        logo {
          publicURL
          image: childImageSharp {
            fluid(maxWidth: 200) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
        partners {
          name
          logo {
            publicURL
            image: childImageSharp {
              fluid(maxWidth: 200) {
                ...GatsbyImageSharpFluid_withWebp_noBase64
              }
            }
          }
          url
        }
        social {
          name
          url
        }
        synthesis {
          prettySize
          publicURL
        }
        tags {
          name
          slug
        }
        title
      }
    }
    about: mdx(id: { eq: $aboutId }) {
      body
    }
    prep: mdx(id: { eq: $prepId }) {
      body
    }
    sessions: allMdx(
      filter: { id: { in: $sessionIds } }
      sort: { fields: [frontmatter___number], order: [ASC] }
    ) {
      nodes {
        body
        frontmatter {
          number
          speakers {
            avatar {
              image: childImageSharp {
                fluid(maxWidth: 400) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            description
            descriptionHtml
            email
            linkedin
            name
            slug
            twitter
            website
          }
          synthesis {
            prettySize
            publicURL
          }
          title
        }
      }
    }
    downloads: allFile(filter: { relativeDirectory: { eq: $docsFolder } }) {
      nodes {
        base
        prettySize
        publicURL
      }
    }
    # images: allFile(filter: { relativeDirectory: { eq: $imageFolder } }) {
    #   image: childImageSharp {
    #     fluid {
    #       ...GatsbyImageSharpFluid_withWebp
    #     }
    #   }
    #   publicURL
    # }
  }
`
