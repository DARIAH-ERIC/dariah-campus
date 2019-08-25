import React from 'react'
import clsx from 'clsx'

import Link from 'components/Link/Link'

import styles from './ReadMoreLink.module.css'

const ReadMoreLink = ({ children, className, posts, ...rest }) =>
  posts && posts.length ? (
    <Link className={clsx(styles.link, className)} {...rest}>
      {children || <>Read more &rarr;</>}
    </Link>
  ) : (
    children || null
  )

export default ReadMoreLink
