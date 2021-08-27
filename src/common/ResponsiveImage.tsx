import Image from 'next/image'
import type { ImageProps } from 'next/image'

export function ResponsiveImage(props: ImageProps): JSX.Element {
  const isUnoptimized =
    typeof props.src === 'string' &&
    (props.width == null || props.height == null)

  return (
    <Image
      layout="responsive"
      sizes="800px"
      {...props}
      alt={props.alt}
      unoptimized={isUnoptimized}
    />
  )
}
