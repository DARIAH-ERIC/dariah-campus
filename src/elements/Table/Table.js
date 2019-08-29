import React from 'react'
import clsx from 'clsx'

import styles from './Table.module.css'

const Table = ({ children, className }) => (
  <table className={clsx(styles.table, className)}>{children}</table>
)

export default Table
