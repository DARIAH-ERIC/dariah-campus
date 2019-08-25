import React from 'react'
import clsx from 'clsx'

import Portal from 'components/Portal/Portal'

import styles from './Lightbox.module.css'

const Lightbox = ({ children, className, overlay }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const setOverlayVisible = () => {
    const documentWidth = document.documentElement.clientWidth
    const windowWidth = window.innerWidth
    const scrollBarWidth = windowWidth - documentWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollBarWidth + 'px'
    setIsVisible(true)
  }

  const setOverlayInvisible = () => {
    document.body.style.overflow = 'unset'
    document.body.style.paddingRight = 0
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => setOverlayInvisible()
  }, [])

  const overlayContainer = (
    <div
      className={styles.container}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      {overlay}
      <button onClick={setOverlayInvisible} className={styles.closeButton}>
        &times;
      </button>
    </div>
  )

  return (
    <>
      <div
        className={clsx(styles.lightboxLink, className)}
        onClick={setOverlayVisible}
      >
        {children}
      </div>
      {isVisible ? <Portal>{overlayContainer}</Portal> : null}
    </>
  )
}

export default Lightbox
