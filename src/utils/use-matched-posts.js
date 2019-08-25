import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import matchSorter from 'match-sorter'
import { useThrottle } from 'use-throttle'

export const useMatchedPosts = searchTerm => {
  const { posts } = useStaticQuery(graphql`
    query {
      posts: allMdx(
        filter: { fileInfo: { sourceInstanceName: { eq: "posts" } } }
      ) {
        nodes {
          frontmatter {
            slug
            tags {
              name
            }
            title
          }
          id
        }
      }
    }
  `)

  const throttledSearchTerm = useThrottle(searchTerm, 100)

  return React.useMemo(() => {
    if (!throttledSearchTerm.trim()) return []
    return matchSorter(posts.nodes, throttledSearchTerm, {
      keys: [item => item.frontmatter.title],
    }).slice(0, 6)
  }, [throttledSearchTerm])
}
