import Head from 'next/head'

import type { IsoDateString } from '@/utils/ts/aliases'

export interface DublinCoreProps {
  title: string
  date: IsoDateString
  authors?: Array<string>
  contributors?: Array<string>
  lang: string
  abstract: string
  licence?: string
  tags: Array<string>
  siteTitle: string
}

/**
 * Adds DublinCore metadata.
 *
 * @see https://www.dublincore.org/specifications/dublin-core/dc-html/
 */
export function DublinCore(props: DublinCoreProps): JSX.Element {
  const {
    title,
    date,
    authors,
    contributors,
    lang,
    abstract,
    licence,
    tags,
    siteTitle,
  } = props

  return (
    <Head>
      <link rel="schema.DCTERMS" href="http://purl.org/dc/terms/" />
      <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />

      <meta key="DC.title" name="DC.title" content={title} />
      {authors?.map((author, index) => {
        return (
          <meta
            key={`DC.creator-${index}`}
            name="DC.creator"
            content={author}
          />
        )
      })}
      {contributors != null
        ? contributors.map((contributor, index) => {
            return (
              <meta
                key={`DC.contributor-${index}`}
                name="DC.contributor"
                content={contributor}
              />
            )
          })
        : null}
      {tags.map((tag, index) => {
        return (
          <meta key={`DC.subject-${index}`} name="DC.subject" content={tag} />
        )
      })}
      {/* DC.rights */}
      {licence != null ? (
        <meta key="DCTERMS.license" name="DCTERMS.license" content={licence} />
      ) : null}
      <meta key="DC.language" name="DC.language" content={lang} />
      <meta key="DCTERMS.issued" name="DCTERMS.issued" content={date} />
      {/* DC.description */}
      <meta key="DCTERMS.abstract" name="DCTERMS.abstract" content={abstract} />
      <meta key="DC.publisher" name="DC.publisher" content={siteTitle} />
      {/* <meta key="DC.type" name="DC.type" content="Text" /> */}
    </Head>
  )
}
