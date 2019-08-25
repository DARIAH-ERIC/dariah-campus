import React from 'react'
import clsx from 'clsx'

import Container from 'elements/Container/Container'

import styles from './Page.module.css'

const Page = ({ children, className, size }) => (
  <Container className={clsx(styles.page, className)} size={size}>
    {children}
  </Container>
)

export default Page
