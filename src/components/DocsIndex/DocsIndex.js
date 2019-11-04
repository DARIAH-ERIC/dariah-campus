import React from 'react'
import Link from 'components/Link/Link'

import styles from './DocsIndex.module.css'

const createTocItems = (items, depth = 0, prefix) => (
  <ul className={styles.items}>
    {items.map(item => (
      <li key={item.url} className={styles.item}>
        <Link to={`${prefix}${item.url}`}>{item.title}</Link>
        {item.items && createTocItems(item.items, depth + 1, prefix)}
      </li>
    ))}
  </ul>
)

const TOC = ({ title, items, prefix }) => (
  <div className={styles.toc}>
    <h2 className={styles.tocHeading}>{title}</h2>
    <nav>{createTocItems(items, 0, prefix)}</nav>
  </div>
)

const AboutIndex = ({ docs }) => (
  <div>
    {docs.map((node, i) => (
      <TOC
        key={i}
        items={node.tableOfContents.items || []}
        prefix={`/docs/${node.frontmatter.slug}`}
        title={node.frontmatter.title}
      />
    ))}
  </div>
)

export default AboutIndex
