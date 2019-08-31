import React from 'react'
import clsx from 'clsx'

import styles from './Panel.module.css'

const Panel = ({ children, className, title }) => (
  <div className={clsx(styles.panel, className)}>
    {title ? <div className={styles.title}>{title}</div> : null}
    {children}
  </div>
)

export default Panel
