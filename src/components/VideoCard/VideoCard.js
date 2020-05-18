import React from 'react'
import clsx from 'clsx'
import { FaRegPlayCircle } from 'react-icons/fa'

import Image from 'components/Image/Image'
import Lightbox from 'components/Lightbox/Lightbox'
import Youtube from 'components/Youtube/Youtube'

import Card from 'elements/Card/Card'
import Heading from 'elements/Heading/Heading'

import styles from './VideoCard.module.css'

const VideoCard = ({
  className,
  id,
  image,
  images,
  title,
  startTime,
  subtitle,
}) => {
  let placeholderImage = null

  // The `images` prop holds the injected images in the `images` folder of a post
  if (typeof image === 'string') {
    const fileName = image.replace(/^[./]*images\//, '')
    const resourceImage = images.find(img => img.base === fileName)
    placeholderImage = resourceImage && resourceImage.image.fluid
  } else if (image) {
    placeholderImage = image.fluid
  }

  return (
    <Lightbox
      overlay={<Youtube id={id} startTime={startTime} autoPlay />}
      className={styles.item}
    >
      <Card className={clsx(styles.card, className)}>
        <Card.Body className={styles.cardBody}>
          {placeholderImage ? (
            <Image fluid={placeholderImage} className={styles.cardImage} />
          ) : null}
          <FaRegPlayCircle color="var(--color-primary)" size="3em" />
          <Heading className={styles.cardHeading}>{title}</Heading>
          <div className={styles.cardText}>{subtitle}</div>
        </Card.Body>
      </Card>
    </Lightbox>
  )
}

export default VideoCard
