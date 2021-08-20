import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect, useMemo } from 'react'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { Highlighter } from 'shiki'
import { compile } from 'xdm'

import type { EventFrontmatter, EventMetadata } from '@/cms/api/events.api'
import { getSyntaxHighlighter } from '@/cms/previews/getSyntaxHighlighter'
import { Preview } from '@/cms/previews/Preview'
import { Spinner } from '@/common/Spinner'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import withCmsPreviewAssets from '@/mdx/plugins/remark-cms-preview-assets'
import withTypographicQuotesAndDashes from '@/mdx/plugins/remark-smartypants'
import { useDebouncedState } from '@/utils/useDebouncedState'
import { Event } from '@/views/post/Event'

const initialMetadata: Omit<EventMetadata, 'about' | 'prep' | 'sessions'> = {
  authors: [],
  tags: [],
  categories: [],
  licence: { id: '', name: '', url: '' },
  type: { id: '', name: '' },
  uuid: '',
  title: '',
  lang: 'en',
  date: new Date(0).toISOString(),
  abstract: '',
  partners: [],
}

/**
 * CMS preview for event.
 */
export function EventPreview(
  props: PreviewTemplateComponentProps,
): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const { fieldsMetaData, getAsset } = props

  const data = entry.get('data')
  const body = entry.getIn(['data', 'body'])
  const about = entry.getIn(['data', 'about'])
  const prep = entry.getIn(['data', 'prep'])
  const sessions = entry.getIn(['data', 'sessions'])

  const [metadata, setMetadata] =
    useState<Omit<EventMetadata, 'about' | 'prep' | 'sessions'>>(
      initialMetadata,
    )
  const [mdxContent, setMdxContent] = useState<string | null | Error>(null)
  const [mdxAbout, setMdxAbout] = useState<EventMetadata['about']>(null)
  const [mdxPrep, setMdxPrep] = useState<EventMetadata['prep']>(null)
  const [mdxSessions, setMdxSessions] = useState<EventMetadata['sessions']>([])
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
            withNoReferrerLinks,
            withImageCaptions,
          ],
        }),
      )
    }
  }, [getAsset, highlighter])

  useEffect(() => {
    function resolveRelation(path: Array<string>, id: string) {
      const metadata = fieldsMetaData.getIn([...path, id])
      if (metadata == null) return null
      return { id, ...metadata.toJS() }
    }

    const { body: _, ...partialFrontmatter } = data.toJS()
    const frontmatter = partialFrontmatter as Partial<EventFrontmatter>

    const authors = Array.isArray(frontmatter.authors)
      ? frontmatter.authors
          .map((id) => {
            return resolveRelation(['authors', 'people'], id)
          })
          .filter(Boolean)
      : []

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
          .map((id) => {
            return resolveRelation(['tags', 'tags'], id)
          })
          .filter(Boolean)
      : []

    const categories = Array.isArray(frontmatter.categories)
      ? frontmatter.categories
          .map((id) => {
            return resolveRelation(['categories', 'categories'], id)
          })
          .filter(Boolean)
      : []

    const partners = Array.isArray(frontmatter.partners)
      ? frontmatter.partners
          .map((id) => {
            return resolveRelation(['partners', 'organisations'], id)
          })
          .filter(Boolean)
      : []

    const licence =
      frontmatter.licence != null
        ? resolveRelation(['licence', 'licences'], frontmatter.licence)
        : null

    const type =
      frontmatter.type != null
        ? resolveRelation(['type', 'contentTypes'], frontmatter.type)
        : null

    const date =
      frontmatter.date == null || frontmatter.date.length === 0
        ? initialMetadata.date
        : frontmatter.date

    const featuredImage =
      frontmatter.featuredImage != null
        ? String(getAsset(frontmatter.featuredImage))
        : frontmatter.featuredImage

    const logo =
      frontmatter.logo != null
        ? String(getAsset(frontmatter.logo))
        : frontmatter.logo

    const metadata = {
      ...initialMetadata,
      ...frontmatter,
      authors,
      date,
      tags,
      categories,
      partners,
      type,
      licence,
      featuredImage,
      logo,
    }

    setMetadata(metadata)
  }, [data, fieldsMetaData, getAsset, compileMdx])

  useEffect(() => {
    let wasCanceled = false

    async function processMdx() {
      try {
        if (compileMdx == null) return Promise.resolve()
        const code = await compileMdx(about)

        if (!wasCanceled) {
          setMdxAbout({ code })
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
  }, [about, compileMdx])

  useEffect(() => {
    let wasCanceled = false

    async function processMdx() {
      try {
        if (compileMdx == null) return Promise.resolve()
        const code = await compileMdx(prep)

        if (!wasCanceled) {
          setMdxPrep({ code })
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
  }, [prep, compileMdx])

  useEffect(() => {
    function resolveSpeaker(id: string) {
      const speaker = fieldsMetaData.getIn([
        'sessions',
        'speakers',
        'people',
        id,
      ])
      if (speaker == null) return null
      return { id, ...speaker.toJS() }
    }

    let wasCanceled = false

    async function processMdx() {
      try {
        if (compileMdx == null) return Promise.resolve()

        const allSessions: EventFrontmatter['sessions'] = sessions.toJS() ?? []
        const mdxSessions = Array.isArray(allSessions)
          ? await Promise.all(
              allSessions.map(async (session) => {
                const speakers = Array.isArray(session.speakers)
                  ? (
                      await Promise.all(
                        session.speakers.map((id) => {
                          return resolveSpeaker(id)
                        }),
                      )
                    )
                      .filter(Boolean)
                      .map((speaker) => {
                        // FIXME: how to resolve asset path on related item?
                        // We cannot use `getAsset` because that is bound to the `posts` collection.
                        return {
                          ...speaker,
                          avatar: undefined,
                        }
                      })
                  : []

                const body =
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  session.body != null
                    ? String(await compileMdx(session.body))
                    : ''

                return { ...session, speakers, body: { code: body } }
              }),
            )
          : []

        if (!wasCanceled) {
          setMdxSessions(mdxSessions)
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
  }, [sessions, compileMdx, fieldsMetaData])

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

  const mergedMetadata: EventMetadata = {
    ...metadata,
    about: mdxAbout,
    prep: mdxPrep,
    sessions: mdxSessions,
  }
  return (
    <Preview {...props}>
      {typeof mdxContent === 'string' ? (
        <Event
          event={{
            id: entry.get('slug'),
            kind: 'events',
            code: mdxContent,
            data: {
              metadata: mergedMetadata,
            },
          }}
          // lastUpdatedAt={null}
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
