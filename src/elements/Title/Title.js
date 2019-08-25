import React from 'react'
import clsx from 'clsx'

import styles from './Title.module.css'

const Title = ({ children, className, ...rest }) => (
  <h1 className={clsx(styles.title, className)} {...rest}>
    {children}
  </h1>
)

export default Title
