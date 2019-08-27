import { graphql } from 'gatsby'

export const fragments = graphql`
  fragment AvatarSmall on File {
    image: childImageSharp {
      fixed(width: 36, height: 36, quality: 90) {
        ...GatsbyImageSharpFixed_withWebp
      }
    }
  }
`
