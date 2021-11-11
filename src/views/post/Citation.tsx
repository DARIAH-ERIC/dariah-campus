import cx from 'clsx'

import type { Person } from '@/cms/api/people.api'
import type { Post } from '@/cms/api/posts.api'
import { getFullName } from '@/cms/utils/getFullName'
import { useI18n } from '@/i18n/useI18n'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'

export interface CitationProps {
  metadata: Post['data']['metadata']
  className?: string
}

/**
 * Displays the recommended citation for a resource.
 */
export function Citation(props: CitationProps): JSX.Element {
  const { url } = useSiteMetadata()
  const citation = getCitation(props.metadata, url)

  const { t } = useI18n()

  function onClick() {
    navigator.clipboard.writeText(citation)
  }

  return (
    <div className={cx('space-y-1.5', props.className)}>
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        {t('common.citeAs')}
      </h2>
      <p>{citation}</p>
      <button
        onClick={onClick}
        className="px-3 py-1 text-xs font-medium transition border rounded-full border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        {t('common.copyCitation')}
      </button>
    </div>
  )
}

/**
 * Returns citation.
 */
function getCitation(metadata: CitationProps['metadata'], siteUrl: string) {
  function createNameList(persons: Array<Person>) {
    return persons
      .map((person) => {
        return getFullName(person)
      })
      .join(', ')
      .replace(/,(?!.*,)/gim, ' and')
  }

  const authors = createNameList([
    ...metadata.authors,
    ...(metadata.contributors ?? []),
  ])

  const editors =
    Array.isArray(metadata.editors) && metadata.editors.length > 0
      ? `Edited by ${createNameList(metadata.editors)}. `
      : ''

  const remoteDate = metadata.remote?.date
  const date = isNotEmpty(remoteDate) ? remoteDate : metadata.date
  const year = ` (${new Date(date).getFullYear()}). `

  const title = metadata.title.slice(-1).match(/[!?]/)
    ? metadata.title + ' '
    : metadata.title + '. '

  const version = metadata.version ? `Version ${metadata.version}. ` : ''

  const remotePublisher = metadata.remote?.publisher
  const publisher = isNotEmpty(remotePublisher)
    ? remotePublisher + '. '
    : hasRemoteUrl(metadata)
    ? metadata.categories
        .filter((cat) => {
          return cat.id !== 'dariah'
        })
        .map((cat) => {
          return cat.host
        })
        .join('') + '. '
    : 'DARIAH-Campus. '

  const contentType = `[${metadata.type.name}]. `

  const url = hasRemoteUrl(metadata)
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadata.remote!.url
    : String(new URL(`/id/${metadata.uuid}`, siteUrl))

  const citation =
    authors + year + title + version + editors + publisher + contentType + url

  return citation
}

function hasRemoteUrl(metadata: CitationProps['metadata']) {
  return isNotEmpty(metadata.remote?.url)
}

function isNotEmpty(val: string | undefined): val is string {
  return val != null && val.trim().length > 0
}
