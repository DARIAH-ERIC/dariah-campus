import React from 'react'
import clsx from 'clsx'

import styles from './Card.module.css'

const Card = ({ children, className }) => (
  <article className={clsx(styles.card, className)}>{children}</article>
)

const CardBody = ({ children, className }) => (
  <div className={clsx(styles.cardBody, className)}>{children}</div>
)

const CardFooter = ({ children, className }) => (
  <div className={clsx(styles.cardFooter, className)}>{children}</div>
)

const CardHeader = ({ children, className }) => (
  <div className={clsx(styles.cardHeader, className)}>{children}</div>
)

Card.Body = CardBody
Card.Footer = CardFooter
Card.Header = CardHeader

export default Card
