import React from 'react'
import { Location } from '@reach/router'
import clsx from 'clsx'
import { FaFacebook, FaTwitter } from 'react-icons/fa'

import Link from 'components/Link/Link'

import styles from './ShareButtons.module.css'

const ShareButtons = ({ className, metadata }) => (
  <Location>
    {({ location }) => (
      <div className={clsx(styles.container, className)}>
        <Link
          to={`https://www.twitter.com/intent/tweet?text=${encodeURIComponent(
            metadata.title
          )}&url=${[location.origin, location.pathname].join(
            ''
          )}&via=DARIAHeu&related=https://twitter.com/dariaheu`}
        >
          <FaTwitter />
        </Link>
        <Link
          to={`https://www.facebook.com/sharer/sharer.php?u=${[
            location.origin,
            location.pathname,
          ].join('')}&title=${encodeURIComponent(metadata.title)}`}
        >
          <FaFacebook />
        </Link>
      </div>
    )}
  </Location>
)

export default ShareButtons
