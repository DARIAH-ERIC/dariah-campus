import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect, useMemo } from 'react'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { Highlighter } from 'shiki'
import { compile } from 'xdm'

import type { DocFrontmatter, DocMetadata } from '@/cms/api/docs.api'
import { getSyntaxHighlighter } from '@/cms/previews/getSyntaxHighlighter'
import { Preview } from '@/cms/previews/Preview'
import { Spinner } from '@/common/Spinner'
import withHeadingLinks from '@/mdx/plugins/rehype-heading-links'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import withCmsPreviewAssets from '@/mdx/plugins/remark-cms-preview-assets'
import withTypographicQuotesAndDashes from '@/mdx/plugins/remark-smartypants'
import { useDebouncedState } from '@/utils/useDebouncedState'
import { Docs } from '@/views/docs/Docs'

const initialMetadata: DocMetadata = {
  title: '',
  order: 1,
}

/**
 * CMS preview for documentation page.
 */
export function DocPreview(props: PreviewTemplateComponentProps): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const { getAsset } = props

  const data = entry.get('data')
  const body = entry.getIn(['data', 'body'])

  const [metadata, setMetadata] = useState<DocMetadata>(initialMetadata)
  const [mdxContent, setMdxContent] = useState<string | null | Error>(null)
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)

  useEffect(() => {
    async function initializeHighlighter() {
      const highlighter = await getSyntaxHighlighter()
      setHighlighter(highlighter)
    }

    initializeHighlighter()
  }, [])

  const compileMdx = useMemo(() => {
    if (highlighter == null) return null

    return async (code: string) => {
      return String(
        await compile(code, {
          outputFormat: 'function-body',
          useDynamicImport: false,
          remarkPlugins: [
            withGitHubMarkdown,
            withFootnotes,
            withTypographicQuotesAndDashes,
            [withCmsPreviewAssets, getAsset],
          ],
          rehypePlugins: [
            [withSyntaxHighlighting, { highlighter }],
            withHeadingIds,
            withHeadingLinks,
            withNoReferrerLinks,
            withImageCaptions,
          ],
        }),
      )
    }
  }, [getAsset, highlighter])

  useEffect(() => {
    const { body: _, ...partialFrontmatter } = data.toJS()
    const frontmatter = partialFrontmatter as Partial<DocFrontmatter>

    const metadata = {
      ...initialMetadata,
      ...frontmatter,
    }

    setMetadata(metadata)
  }, [data])

  useEffect(() => {
    let wasCanceled = false

    async function processMdx() {
      try {
        if (compileMdx == null) return Promise.resolve()
        const code = await compileMdx(body)

        if (!wasCanceled) {
          setMdxContent(code)
        }
      } catch (error) {
        console.error(error)
        setMdxContent(new Error('Failed to render mdx.'))
      }
    }

    processMdx()

    return () => {
      wasCanceled = true
    }
  }, [body, compileMdx])

  return (
    <Preview {...props}>
      {typeof mdxContent === 'string' ? (
        <Docs
          docs={{
            id: entry.get('slug'),
            code: mdxContent,
            data: {
              metadata,
              toc: [],
            },
          }}
          nav={[]}
          lastUpdatedAt={null}
          isPreview
        />
      ) : mdxContent instanceof Error ? (
        <div>
          <p>Failed to render preview.</p>
          <p>This usually indicates a syntax error in the Markdown content.</p>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Spinner
            className="w-6 h-6 text-primary-600"
            aria-label="Loading..."
          />
          <p>Trying to render preview...</p>
        </div>
      )}
    </Preview>
  )
}
