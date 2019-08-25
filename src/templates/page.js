import React from 'react'

import Head from 'components/Head/Head'

import Page from 'elements/Page/Page'

const PageTemplate = ({ children, pageContext }) => {
  // If this is a MDX component directly imported into JS, like faq.mdx,
  // we don't get pageContext - and we don't want to wrap in <Page />.
  // NOTE: This should never be the case, because those components should
  // be rendered with the `component` layout template.
  if (!pageContext) {
    return children
  }

  return (
    <Page
      size={
        String(pageContext.frontmatter.title).toLowerCase() ===
        'course registry'
          ? 'huge'
          : undefined
      }
    >
      <Head title={pageContext.frontmatter.title} />
      {children}
    </Page>
  )
}

export default PageTemplate
