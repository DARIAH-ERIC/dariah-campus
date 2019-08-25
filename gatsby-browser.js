import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Layout from 'components/Layout/Layout'

import components from 'components'

export const shouldUpdateScroll = ({ routerProps }) => {
  // Handle hash links to event sessions ourselves and don't let
  // `gatsby-remark-autolink-headers` mess with things
  const { hash } = routerProps.location
  if (hash && hash.startsWith('#session-')) {
    const element = document.getElementById(hash.slice(1))
    // offsetTop is relative to the closest relatively positioned ancestor,
    // so we need to add 100vh, which is the height of EventHome
    const offset = element.offsetTop + window.innerHeight
    return [0, offset]
  }

  // Let Gatsby handle the rest
  return undefined
}

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
)
