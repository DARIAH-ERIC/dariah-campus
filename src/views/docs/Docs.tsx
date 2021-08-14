import type { Doc as DocData, DocPreview } from '@/cms/api/docs.api'
import { ResponsiveImage } from '@/common/ResponsiveImage'
import { useI18n } from '@/i18n/useI18n'
import { Mdx as DocsContent } from '@/mdx/Mdx'
import type { IsoDateString } from '@/utils/ts/aliases'
import { DocsNav } from '@/views/docs/DocsNav'

export interface DocsProps {
  docs: DocData
  lastUpdatedAt: IsoDateString | null
  nav: Array<DocPreview>
  isPreview?: boolean
}

export function Docs(props: DocsProps): JSX.Element {
  const { docs, lastUpdatedAt, nav } = props
  const { metadata } = docs.data

  const { formatDate } = useI18n()

  return (
    <article className="w-full min-w-0 mx-auto space-y-16 max-w-80ch">
      <header className="space-y-10">
        <h1 className="font-bold text-4.5xl text-center">{metadata.title}</h1>
        <div className="pl-4 border-l-2 2xl:hidden text-neutral-500 border-primary-600">
          <DocsNav nav={nav} />
        </div>
      </header>
      <div className="prose-sm prose max-w-none sm:prose sm:max-w-none">
        <DocsContent code={docs.code} components={{ Image: ResponsiveImage }} />
      </div>
      <footer>
        {lastUpdatedAt != null ? (
          <p className="text-sm text-right text-neutral-500">
            <span>Last updated: </span>
            <time dateTime={lastUpdatedAt}>
              {formatDate(new Date(lastUpdatedAt), undefined, {
                dateStyle: 'medium',
              })}
            </time>
          </p>
        ) : null}
      </footer>
    </article>
  )
}
