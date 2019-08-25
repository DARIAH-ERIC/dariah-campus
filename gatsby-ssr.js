import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Layout from 'components/Layout/Layout'

import components from 'components'

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([<div id="overlay" key="overlay" />])
}

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
)

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
