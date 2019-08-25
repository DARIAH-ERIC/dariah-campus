import React from 'react'
import clsx from 'clsx'

import styles from './Section.module.css'

const Section = ({ children, className }) => (
  <section className={clsx(styles.section, className)}>{children}</section>
)

export default Section
