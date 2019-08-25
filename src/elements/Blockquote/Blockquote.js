import React from 'react'
import clsx from 'clsx'

import styles from './Blockquote.module.css'

const Blockquote = ({ children, className }) => (
  <blockquote className={clsx(styles.blockquote, className)}>
    {children}
  </blockquote>
)

export default Blockquote
