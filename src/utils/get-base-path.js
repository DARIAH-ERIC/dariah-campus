import { graphql, useStaticQuery } from 'gatsby'

export const getBasePath = path => {
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
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
