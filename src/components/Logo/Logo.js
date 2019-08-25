import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import Image from 'components/Image/Image'

const Logo = ({ critical, text }) => {
  const { logo, logoWithText, logoWithTextCritical } = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "dariah-flower.png" }) {
        image: childImageSharp {
          fixed(width: 36, height: 36) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      logoWithText: file(relativePath: { eq: "dariah-campus-logo.png" }) {
        image: childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      logoWithTextCritical: file(
        relativePath: { eq: "dariah-campus-logo.png" }
      ) {
        image: childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
    }
  `)

  return text ? (
    <Image
      critical={critical}
      loading={critical ? 'eager' : 'auto'}
      fadeIn={!critical}
      fixed={
        critical ? logoWithTextCritical.image.fixed : logoWithText.image.fixed
      }
    />
  ) : (
    <Image fixed={logo.image.fixed} />
  )
}

export default Logo
