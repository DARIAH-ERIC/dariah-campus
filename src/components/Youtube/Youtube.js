import React from 'react'

import IFrame from 'components/IFrame/IFrame'

import styles from './Youtube.module.css'

const Youtube = ({
  autoPlay = false,
  caption,
  id,
  relatedVideos = false,
  startTime, // in seconds, e.g. 60
  url,
}) => {
  const aspectRatio = 9 / 16

  let embedUrl
  if (id) {
    embedUrl = new URL(`https://youtube.com/embed/${id}`)
  } else if (url) {
    const providedUrl = new URL(url)
    const searchParams = new URLSearchParams()
    let path
    providedUrl.searchParams.forEach((value, key) => {
      switch (key) {
        case 'v':
          path = `https://youtube.com/embed/${value}`
          break
        case 't:':
          searchParams.set('start', toSeconds(value))
          break
        default:
          searchParams.set(key, value)
      }
    })
    embedUrl = new URL(path)
    embedUrl.search = searchParams
  } else {
    throw new Error('Please provide either a video `id` or a full `url`.')
  }

  if (!relatedVideos) {
    embedUrl.searchParams.set('rel', 0)
  }

  if (autoPlay) {
    embedUrl.searchParams.set('autoplay', 1)
  }

  if (startTime) {
    embedUrl.searchParams.set('start', startTime)
  }

  return (
    <div
      className={styles.container}
      style={{
        // This should probably be moved to Lightbox
        maxWidth: aspectRatio ? `calc(100vh / ${aspectRatio})` : undefined,
      }}
    >
      <IFrame src={embedUrl} aspectRatio={aspectRatio} allowFullScreen />
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  )
}

const toSeconds = str => {
  const hoursMinutesSeconds = str.match(/(\d{2})/g)
  return hoursMinutesSeconds.reduceRight(
    (seconds, digits, i) => seconds + parseInt(digits, 10) * Math.pow(60, i)
  )
}

export default Youtube
