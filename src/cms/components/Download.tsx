import type { UrlString } from '@/utils/ts/aliases'

export interface DownloadProps {
  url: UrlString
  title: string
  fileName?: string
}

/**
 * Download link.
 */
export function Download(props: DownloadProps): JSX.Element {
  const { url, title, fileName } = props

  return (
    <a href={url} download={fileName ?? true}>
      {title}
    </a>
  )
}
