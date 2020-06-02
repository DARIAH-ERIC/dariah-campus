import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Layout from 'components/Layout/Layout'

import components from 'components'

import { scrollToElement } from 'utils/scroll-to-element'

// shouldUpdateScroll does not fire on initial page load
export const shouldUpdateScroll = ({ routerProps, prevRouterProps }) => {
  if (routerProps.location.pathname === prevRouterProps.location.pathname) {
    // Hash link navigation
    // remaining problem: if a user navigates to an element#id and
    // then clicks the browser back button, this will scroll the page
    // to the element referenced in the location.hash, not the previous
    // scroll position (which is annoying for footnote nav)
    const { hash } = routerProps.location
    // Scroll to top when navigating back from hash link
    if (!hash) {
      return [0, 0]
    } else {
      const el = document.getElementById(hash.slice(1))
      const position = scrollToElement(el)
      return [0, position]
    }
  }

  // Let Gatsby handle the rest
  return true
}

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
)
