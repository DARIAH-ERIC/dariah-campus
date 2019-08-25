import React from 'react'
import clsx from 'clsx'

import Link from 'components/Link/Link'

import Button from 'elements/Button/Button'
import Heading from 'elements/Heading/Heading'

import styles from './CTA.module.css'

const CTA = ({ className, subtitle, title, url }) => (
  <div className={clsx(styles.cta, className)}>
    <Heading className={styles.title}>{title}</Heading>
    <div className={styles.subtitle}>{subtitle}</div>
    {url && (
      <Button as={Link} className={styles.button} primary to={url}>
        Go to this resource
      </Button>
    )}
  </div>
)

export default CTA
