import React from 'react'
import clsx from 'clsx'

import styles from './Heading.module.css'

const levels = ['h2', 'h3', 'h4', 'h5', 'h6']

const Heading = ({ children, className, level = 1, ...rest }) => {
  const Component = levels[level - 1]
  return (
    <Component className={clsx(styles[`heading${level}`], className)} {...rest}>
      {children}
    </Component>
  )
}

export default Heading
