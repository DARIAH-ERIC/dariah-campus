import Image from 'next/image'
import type { ImageProps } from 'next/image'

export function ResponsiveImage(props: ImageProps): JSX.Element | null {
  if (props.width == null || props.height == null) {
    if (typeof props.src === 'string') {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={props.src} alt={props.alt} />
    }
    return null
  }

  return <Image layout="responsive" sizes="800px" {...props} alt={props.alt} />
}
