import React from 'react'
import clsx from 'clsx'

import styles from './List.module.css'

const List = ({ children, className, ordered }) => {
  const Component = ordered ? 'ol' : 'ul'

  return (
    <Component className={clsx(styles.list, className)}>{children}</Component>
  )
}

export default List
