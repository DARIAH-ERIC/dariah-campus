import { graphql, useStaticQuery } from 'gatsby'

export const getBasePath = path => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          paths {
            displayName
            name
            path
          }
        }
      }
    }
  `)

  const route = site.siteMetadata.paths.find(route => route.name === path)

  if (!route) {
    throw new Error(`No route path found for ${path}.`)
  }

  return route.path
}
