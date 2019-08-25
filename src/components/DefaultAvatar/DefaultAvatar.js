import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Image from 'gatsby-image'

const DefaultAvatar = ({ className }) => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(relativePath: { eq: "default-avatar.png" }) {
        image: childImageSharp {
          fixed(width: 36, height: 36) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  return <Image className={className} fixed={data.avatar.image.fixed} />
}

export default DefaultAvatar
