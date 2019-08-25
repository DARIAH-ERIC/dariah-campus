import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Dialog } from '@reach/dialog'

import Link from 'components/Link/Link'

import '@reach/dialog/styles.css'

const CloseButton = ({ onClick }) => (
  <button
    className="popin-closer button-picto button-picto--naked show-hide-close"
    aria-label="Close"
    onClick={onClick}
    style={{ background: 'none' }}
  >
    &times;
  </button>
)

const EventOverlay = ({ onDismiss, overlay }) => (
  <Dialog onDismiss={onDismiss} id="eventoverlay">
    <div
      className="popin-content"
      style={{ display: 'block', margin: '3.125vw auto' }}
    >
      <CloseButton onClick={onDismiss} />

      <div className="popin-core">
        <MDXProvider
          components={{
            a: Link,
            h1: props => <h1 className="h1" {...props} />,
            h2: props => <h1 className="h3" {...props} />,
          }}
        >
          <MDXRenderer>{overlay}</MDXRenderer>
        </MDXProvider>
      </div>
    </div>
  </Dialog>
)

export default EventOverlay
