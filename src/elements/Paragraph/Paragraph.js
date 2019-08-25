import React from 'react'
import clsx from 'clsx'

import styles from './Paragraph.module.css'

const Paragraph = ({ children, className }) => (
  <p className={clsx(styles.paragraph, className)}>{children}</p>
)

export default Paragraph
