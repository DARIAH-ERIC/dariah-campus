import React from 'react'
import clsx from 'clsx'

import styles from './Flex.module.css'

const Flex = ({ children, className, columns, title }) => (
  <div
    className={clsx(styles.container, className)}
    style={{
      gridTemplateColumns: columns
        ? `repeat(${columns}, ${100 / columns}%)`
        : undefined,
    }}
  >
    <div className={styles.title}>{title}</div>
    <div className={styles.flex}>{children}</div>
  </div>
)

export default Flex
