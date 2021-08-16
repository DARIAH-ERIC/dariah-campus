import Image from 'next/image'
import type { ImageProps } from 'next/image'

export function ResponsiveImage(props: ImageProps): JSX.Element {
  if (typeof props.src === 'string') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} src={props.src} />
  }

  return <Image layout="responsive" sizes="800px" {...props} alt={props.alt} />
}
