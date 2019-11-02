import React from 'react'
import clsx from 'clsx'

import { capitalize } from 'utils/capitalize'

import styles from './Container.module.css'

const Container = ({ children, className, size, ...rest }) => (
  <div
    className={clsx(styles[`container${capitalize(size)}`], className)}
    {...rest}
  >
    {children}
  </div>
)

export default Container
