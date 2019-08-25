import React from 'react'
import clsx from 'clsx'

import styles from './DateTime.module.css'

const DateTime = ({ className, children }) => (
  <time className={clsx(styles.dateTime, className)}>{children}</time>
)

export default DateTime
