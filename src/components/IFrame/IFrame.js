import React from 'react'
import clsx from 'clsx'

import Spinner from 'elements/Spinner/Spinner'

import styles from './IFrame.module.css'

const IFrame = ({ aspectRatio, className, height, title, width, ...rest }) => {
  const [containerPaddingBottom, containerHeight] =
    !aspectRatio && (!height || !width)
      ? [0, '100%']
      : [(aspectRatio || height / width) * 100 + '%', 0]

  return (
    <div
      className={clsx(styles.container, className)}
      style={{
        height: containerHeight,
        paddingBottom: containerPaddingBottom,
      }}
    >
      <div className={styles.spinner}>
        <Spinner />
      </div>
      <iframe
        className={styles.iframe}
        frameBorder="0"
        title={title}
        {...rest}
      />
    </div>
  )
}

export default IFrame
