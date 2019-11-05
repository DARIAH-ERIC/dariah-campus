import React from 'react'
import clsx from 'clsx'

import Link from 'components/Link/Link'

import styles from './TOC.module.css'

export const createTocItems = (items, depth = 0, prefix) => (
  <ul className={clsx(!depth && styles.border, styles.items)}>
    {items.map(item => (
      <li key={item.url} className={styles.item}>
        {prefix ? (
          <Link to={`${prefix}${item.url}`}>{item.title}</Link>
        ) : (
          <a href={item.url}>{item.title}</a>
        )}
        {item.items && createTocItems(item.items, depth + 1, prefix)}
      </li>
    ))}
  </ul>
)

export const TOCContainer = ({ children, className }) => (
  <div className={clsx(styles.container, className)}>
    <div className={styles.toc}>
      <h2 className={styles.tocHeading}>Table of contents</h2>

      {children}
    </div>
  </div>
)

const TOC = ({ className, toc }) => (
  <TOCContainer className={className}>{createTocItems(toc.items)}</TOCContainer>
)

export default TOC
