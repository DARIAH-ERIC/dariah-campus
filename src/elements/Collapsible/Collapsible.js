import React from 'react'
import clsx from 'clsx'

import styles from './Collapsible.module.css'

const Collapsible = ({ children, className, title }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={clsx(styles.collapsible, className)}>
      <button
        aria-expanded={isOpen ? true : undefined}
        data-open={isOpen ? true : undefined}
        className={styles.title}
        onClick={() => setIsOpen(isOpen => !isOpen)}
      >
        {title}
        <div className={styles.arrow} />
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  )
}

export default Collapsible
