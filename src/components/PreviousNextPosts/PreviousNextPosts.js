import React from 'react'
import clsx from 'clsx'

import styles from './PreviousNextPosts.module.css'

const PreviousNextPosts = ({ className, previous, next }) => (
  <div className={clsx(styles.container, className)}>Previous/Next post</div>
)

export default PreviousNextPosts
