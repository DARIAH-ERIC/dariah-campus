import React from 'react'
import clsx from 'clsx'

import { capitalize } from 'utils/capitalize'

import styles from './Grid.module.css'

const Grid = ({ children, className, columns }) => (
  <div className={clsx(styles[`grid${capitalize(columns)}`], className)}>
    {children}
  </div>
)

export default Grid
