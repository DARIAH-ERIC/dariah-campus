import type { ReactNode } from 'react'

import { ResponsiveImage } from '@/common/ResponsiveImage'

export interface FigureProps {
  src: string
  alt?: string
  children?: ReactNode
  width?: number
  height?: number
  blurDataURL?: string
  placeholder?: 'blur'
}

export function Figure(props: FigureProps): JSX.Element {
  const {
    src,
    alt = '',
    children: caption,
    width,
    height,
    blurDataURL,
    placeholder,
  } = props

  return (
    <figure className="flex flex-col">
      {width == null || height == null ? (
        /** CMS preview cannot provide width/height for images which have not been saved yet. */
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full" />
      ) : (
        <ResponsiveImage
          src={{ src, width, height, blurDataURL }}
          alt={alt}
          blurDataURL={blurDataURL}
          placeholder={placeholder}
        />
      )}
      {caption != null ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
