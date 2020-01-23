import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'

import Heading from 'elements/Heading/Heading'

import styles from './Docs.module.css'

const Docs = ({ docs }) => (
  <MDXProvider
    components={{
      h1: () => null,
      h2: props => <Heading level="1" className={styles.h1} {...props} />,
    }}
  >
    <MDXRenderer>{docs}</MDXRenderer>
  </MDXProvider>
)

export default Docs
