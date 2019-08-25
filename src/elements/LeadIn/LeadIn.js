import React from 'react'
import clsx from 'clsx'

import styles from './LeadIn.module.css'

const LeadIn = ({ children, className, ...rest }) => (
  <h2 className={clsx(styles.leadIn, className)} {...rest}>
    {children}
  </h2>
)

export default LeadIn
