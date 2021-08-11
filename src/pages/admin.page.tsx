import dynamic from 'next/dynamic'
import { Fragment, memo } from 'react'

import { Metadata } from '@/metadata/Metadata'

/**
 * Lazy-loads CMS on the client, because Netlify CMS cannot be server-rendered.
 */
const Cms = dynamic(
  async () => {
    const { nanoid } = await import('nanoid')
    /**
     * We cannot use the ESM build because `netlify-cms-app` imports global css,
     * which is disallowed by Next.js.
     */
    const { default: Cms } = await import('netlify-cms-app')
    const { config } = await import('@/cms/cms.config')
    const { collection: posts } = await import(
      '@/cms/collections/posts.collection'
    )
    const { collection: courses } = await import(
      '@/cms/collections/courses.collection'
    )
    const { collection: events } = await import(
      '@/cms/collections/events.collection'
    )
    const { collection: docs } = await import(
      '@/cms/collections/docs.collection'
    )
    const { ResourcePreview } = await import('@/cms/previews/ResourcePreview')
    const { CoursePreview } = await import('@/cms/previews/CoursePreview')
    const { EventPreview } = await import('@/cms/previews/EventPreview')
    const { DocPreview } = await import('@/cms/previews/DocPreview')
    const { downloadWidget } = await import('@/cms/widgets/Download')
    const { sideNoteEditorWidget } = await import('@/cms/widgets/SideNote')
    const { videoEditorWidget } = await import('@/cms/widgets/Video')
    const { quizEditorWidget } = await import('@/cms/widgets/Quiz')
    const { videoCardEditorWidget } = await import('@/cms/widgets/VideoCard')
    const { externalResourceEditorWidget } = await import(
      '@/cms/widgets/ExternalResource'
    )
    const { eventSessionSpeakersEditorWidget } = await import(
      '@/cms/widgets/EventSessionSpeakers'
    )
    const { eventSessionDownloadEditorWidget } = await import(
      '@/cms/widgets/EventSessionDownload'
    )
    const { eventSessionLinkEditorWidget } = await import(
      '@/cms/widgets/EventSessionLink'
    )
    const { default: withResourceLinks } = await import(
      '@stefanprobst/remark-resource-links'
    )

    Cms.init({ config })

    /**
     * Generate UUIDs for collections.
     */
    Cms.registerEventListener({
      name: 'preSave',
      handler({ entry }) {
        const collections = [posts.name, courses.name, events.name]

        const data = entry.get('data')

        if (!collections.includes(entry.get('collection'))) {
          return data
        }

        if (data.get('uuid') == null) {
          return data.set('uuid', nanoid())
        }

        return data
      },
    })

    /**
     * Register preview styles.
     *
     * These are created in a `postbuild` script with `postcss-cli`.
     */
    Cms.registerPreviewStyle(
      'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400&display=swap',
    )
    Cms.registerPreviewStyle('/assets/css/tailwind.css')
    Cms.registerPreviewStyle('/assets/css/index.css')

    /**
     * Register preview templates for collections.
     */
    Cms.registerPreviewTemplate(posts.name, memo(ResourcePreview))
    Cms.registerPreviewTemplate(courses.name, memo(CoursePreview))
    Cms.registerPreviewTemplate(events.name, memo(EventPreview))
    Cms.registerPreviewTemplate(docs.name, memo(DocPreview))

    /**
     * Register richtext editor widgets.
     */
    Cms.registerEditorComponent(downloadWidget)
    Cms.registerEditorComponent(sideNoteEditorWidget)
    Cms.registerEditorComponent(videoEditorWidget)
    Cms.registerEditorComponent(quizEditorWidget)
    Cms.registerEditorComponent(videoCardEditorWidget)
    Cms.registerEditorComponent(externalResourceEditorWidget)
    Cms.registerEditorComponent(eventSessionSpeakersEditorWidget)
    Cms.registerEditorComponent(eventSessionDownloadEditorWidget)
    Cms.registerEditorComponent(eventSessionLinkEditorWidget)

    /**
     * Register plugins to the richtext editor widget to (i) avoid saving
     * autolinks, and (ii) enforce serialisation that is closer to `prettier`'s
     * format.
     */
    Cms.registerRemarkPlugin(withResourceLinks)
    Cms.registerRemarkPlugin({
      settings: {
        bullet: '-',
      },
      plugins: [],
    })

    return function () {
      return null
    }
  },
  {
    ssr: false,
    loading: function Loading(props) {
      const { error, pastDelay, retry, timedOut } = props

      const message =
        error != null ? (
          <div>
            Failed to load CMS! <button onClick={retry}>Retry</button>
          </div>
        ) : timedOut === true ? (
          <div>
            Taking a long time to load CMS&hellip;{' '}
            <button onClick={retry}>Retry</button>
          </div>
        ) : pastDelay === true ? (
          <div>Loading CMS&hellip;</div>
        ) : null

      return (
        <div className="grid min-h-screen place-items-center">{message}</div>
      )
    },
  },
)

/**
 * CMS page.
 */
export default function CmsPage(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="CMS" />
      <div id="nc-root" />
      <style jsx global>
        {`
          /* Temporary workaround to stop tailwind reset bleeding into richtext editor. */
          /* Should be fixed upstream: Netlify CMS richtext editor should explicitly set styles.
             and not rely on browser defaults. */
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ul {
            list-style: disc;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ol {
            list-style: decimal;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h1,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h2,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h3,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h4,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h5 {
            margin-bottom: 1rem;
            line-height: 1.125;
          }
        `}
      </style>
      <Cms />
    </Fragment>
  )
}

CmsPage.Layout = Fragment

// @refresh reset
