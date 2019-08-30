import React from 'react'
import clsx from 'clsx'

import styles from './Panel.module.css'

const Panel = ({ children, className, title }) => (
  <div className={clsx(title ? styles.panel : styles.notitlepanel, className)}>
    <div className={styles.title}>{title}</div>
    {children}
  </div>
)

export default Panel
