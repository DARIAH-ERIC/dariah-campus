import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Layout from 'components/Layout/Layout'

import components from 'components'

export const shouldUpdateScroll = ({ routerProps, prevRouterProps }) => {
  if (routerProps.location.path === prevRouterProps.location.path) {
    // Hash link navigation
    const { hash } = routerProps.location
    // Scroll to top when navigating back from hash link
    if (!hash) {
      return [0, 0]
    } else {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        // Adjust for header height
        window.scrollBy({ top: -100 })
        return false
      }
    }
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
