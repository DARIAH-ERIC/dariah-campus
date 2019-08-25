import React from 'react'
import clsx from 'clsx'

import styles from './PostsCount.module.css'

const PostsCount = ({ className, posts }) => (
  <div className={clsx(styles.postsCount, className)}>
    {posts ? posts.length : 0} Resource{posts && posts.length === 1 ? '' : 's'}
  </div>
)

export default PostsCount
