import React from 'react'
import clsx from 'clsx'

import { capitalize } from 'utils/capitalize'

import styles from './Container.module.css'

const Container = ({ children, className, size }) => (
  <div className={clsx(styles[`container${capitalize(size)}`], className)}>
    {children}
  </div>
)

export default Container
