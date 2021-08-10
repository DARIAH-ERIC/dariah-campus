import type { UrlString } from '@/utils/ts/aliases'

export interface DownloadProps {
  url: UrlString
  title: string
}

/**
 * Download link.
 */
export function Download(props: DownloadProps): JSX.Element {
  const { url, title } = props

  return (
    <a href={url} download>
      {title}
    </a>
  )
}
